# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import requests

# import our summarizer blueprint
from summarizer.summarizer import summarizer_bp

app = Flask(__name__)
CORS(app)

# --- MySQL connection ---
db = mysql.connector.connect(
    host= 'mysql-db-edu-rev.j.aivencloud.com', 
    port= 22963, 
    user= 'avnadmin',
    password= 'AVNS_KQtfh-PMpPiTprKNdog',
    database= 'edurev',
   
)
cursor = db.cursor(dictionary=True)

# register summarizer blueprint
app.register_blueprint(summarizer_bp)


# Your Ngrok‐exposed RAG endpoint
RAG_URL = "https://b04c-34-126-126-50.ngrok-free.app/ask"


@app.route('/')
def home():
    return 'Flask server is running...'


# --- SIGNUP ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    fullName = data.get('fullName')
    email    = data.get('email')
    password = data.get('password')
    role     = data.get('role', 'student')

    cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify(success=False, message="Email already in use."), 400

    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (%s, %s, %s, %s)",
        (fullName, email, pw_hash, role)
    )
    db.commit()
    return jsonify(success=True, message="Sign-up successful")


# --- LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email    = data.get('email')
    password = data.get('password')

    cursor.execute(
        "SELECT user_id, full_name, email, password_hash, role FROM users WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(password.encode('utf-8'),
                                      user['password_hash'].encode('utf-8')):
        return jsonify(success=False, message="Invalid email or password"), 401

    user_data = {
        'user_id':   user['user_id'],
        'full_name': user['full_name'],
        'email':     user['email'],
        'role':      user['role']
    }
    return jsonify(success=True, message="Login successful", user=user_data)


# --- UPDATE PROFILE ---
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    full_name      = data.get('full_name', '').strip()
    current_pw     = data.get('current_password', '').strip()
    new_pw         = data.get('new_password', '').strip()
    confirm_new_pw = data.get('confirm_new_password', '').strip()

    cursor.execute("SELECT password_hash FROM users WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    if not row:
        return jsonify(success=False, message="User not found"), 404

    updates, params = [], []

    if full_name:
        updates.append("full_name = %s")
        params.append(full_name)

    if new_pw:
        if not current_pw or not bcrypt.checkpw(current_pw.encode('utf-8'),
                                                row['password_hash'].encode('utf-8')):
            return jsonify(success=False, message="Current password is incorrect."), 401
        if new_pw != confirm_new_pw:
            return jsonify(success=False, message="New passwords do not match."), 400

        hashed_new = bcrypt.hashpw(new_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        updates.append("password_hash = %s")
        params.append(hashed_new)

    if not updates:
        return jsonify(success=False, message="No changes to update."), 400

    params.append(user_id)
    sql = f"UPDATE users SET {', '.join(updates)} WHERE user_id = %s"
    cursor.execute(sql, tuple(params))
    db.commit()
    return jsonify(success=True, message="User updated successfully")


# --- AI ASSISTANT (RAG) ---
@app.route('/api/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get('question', '').strip()
    if not question:
        return jsonify(success=False, message="No question provided"), 400

    try:
        resp = requests.post(RAG_URL, json={'question': question}, timeout=600)
        resp.raise_for_status()
        payload = resp.json()
        answer  = payload.get('answer') or payload.get('message') or str(payload)
        return jsonify(success=True, answer=answer)
    except requests.exceptions.RequestException as e:
        return jsonify(success=False, message=f"RAG request failed: {e}"), 502
    except ValueError:
        return jsonify(success=False, message="Invalid JSON from RAG"), 502

# # --- COURSES / ENROLLMENTS / LESSONS ---

# # GET /api/courses
# @app.route('/api/courses', methods=['GET'])
# def list_courses():
#     cursor.execute("SELECT course_id AS id, title, description, price FROM courses")
#     courses = cursor.fetchall()
#     return jsonify(success=True, courses=courses)


# # GET /api/users/<uid>/courses
# @app.route('/api/users/<int:uid>/courses', methods=['GET'])
# def user_enrolled(uid):
#     cursor.execute("""
#       SELECT c.course_id AS id, c.title, c.description, c.price
#       FROM courses c
#       JOIN enrollments e ON e.course_id=c.course_id
#       WHERE e.user_id=%s
#     """, (uid,))
#     courses = cursor.fetchall()
#     return jsonify(success=True, courses=courses)


# # GET /api/courses/<cid>
# @app.route('/api/courses/<int:cid>', methods=['GET'])
# def course_detail(cid):
#     # fetch course
#     cursor.execute("SELECT course_id AS id, title, description, price FROM courses WHERE course_id=%s", (cid,))
#     course = cursor.fetchone()
#     if not course:
#         return jsonify(success=False, message="Course not found"), 404

#     # fetch topics/modules
#     cursor.execute("""
#       SELECT topic_id AS id, name AS title
#       FROM topics
#       WHERE course_id=%s
#       ORDER BY topic_id
#     """, (cid,))
#     modules = cursor.fetchall()

#     # for each module, fetch its lessons
#     for m in modules:
#         cursor.execute("""
#           SELECT lesson_id AS id, title, duration
#           FROM lessons
#           WHERE course_id=%s
#             AND topic_id=%s
#         """, (cid, m['id']))
#         m['lessons'] = cursor.fetchall()

#     course['curriculum'] = modules
#     return jsonify(success=True, course=course)


# # POST /api/courses/<cid>/enroll
# @app.route('/api/courses/<int:cid>/enroll', methods=['POST'])
# def enroll(cid):
#     data = request.get_json()
#     uid = data.get('userId')
#     if not uid:
#         return jsonify(success=False, message="No user ID provided"), 400

#     # avoid duplicate
#     cursor.execute("SELECT 1 FROM enrollments WHERE user_id=%s AND course_id=%s", (uid, cid))
#     if not cursor.fetchone():
#         cursor.execute("INSERT INTO enrollments (user_id, course_id) VALUES (%s,%s)", (uid, cid))
#         db.commit()

#     return jsonify(success=True, message="Enrolled")


# # GET /api/courses/<cid>/lessons
# @app.route('/api/courses/<int:cid>/lessons', methods=['GET'])
# def list_lessons(cid):
#     cursor.execute("""
#       SELECT lesson_id AS id, title, duration
#       FROM lessons
#       WHERE course_id=%s
#     """, (cid,))
#     lessons = cursor.fetchall()
#     return jsonify(success=True, lessons=lessons)


# # GET /api/courses/<cid>/lessons/<lid>
# @app.route('/api/courses/<int:cid>/lessons/<int:lid>', methods=['GET'])
# def lesson_content(cid, lid):
#     cursor.execute("""
#       SELECT lesson_id AS id, title, content, video_url AS videoUrl
#       FROM lessons
#       WHERE course_id=%s AND lesson_id=%s
#     """, (cid, lid))
#     lesson = cursor.fetchone()
#     if not lesson:
#         return jsonify(success=False, message="Lesson not found"), 404
#     return jsonify(success=True, lesson=lesson)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
