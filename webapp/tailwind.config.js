// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx,html}",
      "./public/index.html"
    ],
    darkMode: 'class',  // Enable dark mode via 'dark' class on root
    theme: {
      extend: {
        // (Optional) extend colors, spacing, etc., if needed
      }
    },
    plugins: [
      // (Optional) require('@tailwindcss/forms') for better input styling
    ]
  };
  