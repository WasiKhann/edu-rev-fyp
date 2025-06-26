const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql-db-edu-rev.j.aivencloud.com', // Corrected hostname
  port: 22963, // Explicit port from your screenshot
  user: 'placeholderUsername',
  password: 'placeholderPassword',
  database: 'edurev',
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Test route
app.get('/', (req, res) => {
  res.send('Node server is running...');
});

/**
 * SIGNUP
 * Expects: { fullName, email, password, role }
 */
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user with this email already exists
    const [existingUser] = await db.promise().query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into DB (default role to 'student' if not provided)
    const userRole = role || 'student';
    await db.promise().query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, hashedPassword, userRole]
    );

    return res.json({ success: true, message: 'Sign-up successful' });
  } catch (err) {
    console.error('Error during sign-up:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * LOGIN
 * Expects: { email, password }
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [rows] = await db.promise().query(
      'SELECT user_id, full_name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare given password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Return user data
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * UPDATE USER (Profile update)
 * PUT /api/users/:id
 * Expects: { full_name, current_password, new_password, confirm_new_password }
 *
 * 1) If new_password is provided:
 *    - Must validate current_password matches DB
 *    - Must validate new_password === confirm_new_password
 *    - Then update password in DB
 * 2) If full_name is provided, update it as well.
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, current_password, new_password, confirm_new_password } = req.body;

    // Check if user exists
    const [rows] = await db.promise().query(
      'SELECT user_id, password_hash FROM users WHERE user_id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

    // We'll build an array of update clauses
    const updateFields = [];
    const values = [];

    // 1) Update full_name if provided
    if (full_name && full_name.trim().length > 0) {
      updateFields.push('full_name = ?');
      values.push(full_name.trim());
    }

    // 2) Update password if new_password is provided
    if (new_password && new_password.trim().length > 0) {
      // Must have current_password
      if (!current_password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current password to change password.',
        });
      }

      // Check current password matches the DB
      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }

      // Check new_password == confirm_new_password
      if (!confirm_new_password || new_password !== confirm_new_password) {
        return res.status(400).json({
          success: false,
          message: 'New passwords do not match.',
        });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);
      updateFields.push('password_hash = ?');
      values.push(hashedNewPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No changes to update.' });
    }

    // Construct the final query
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    values.push(id);

    await db.promise().query(sql, values);

    return res.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
