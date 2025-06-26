// src/services/api.js

// <-- the base URL of your Flask server:
const API_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${API_URL}${endpoint}`;
  const opts = { method, headers: {} };

  if (data) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  const res = await fetch(url, opts);
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.message || res.statusText);
  return payload;
}

export const authAPI = {
  signup:    (fullName, email, pw) => apiRequest("/signup", "POST", { fullName, email, password: pw }),
  login:     (email, pw)           => apiRequest("/login",  "POST", { email,    password: pw }),
};

// export const coursesAPI = {
//   getAllCourses:       ()           => apiRequest("/courses",           "GET"),
//   getEnrolledCourses:  (uid)        => apiRequest(`/users/${uid}/courses`, "GET"),
//   getCourseDetails:    (cid)        => apiRequest(`/courses/${cid}`,      "GET"),
//   enrollCourse:        (uid, cid)   => apiRequest(`/courses/${cid}/enroll`, "POST", { userId: uid }),
//   getLessonContent:    (cid, lid)   => apiRequest(`/courses/${cid}/lessons/${lid}`, "GET"),
// };

export const coursesAPI = {
  getAllCourses: () =>
    Promise.resolve({
      success: true,
      courses: [
        { id: 1, title: "Introduction to React",     category: "Web Development", instructor: "Jane Doe",      thumbnail: "/placeholder.svg" },
        { id: 2, title: "Advanced JavaScript",       category: "Web Development", instructor: "John Smith",    thumbnail: "/placeholder.svg" },
        { id: 3, title: "Python for Data Science",   category: "Data Science",   instructor: "Alex Johnson", thumbnail: "/placeholder.svg" },
        { id: 4, title: "Chemistry O Levels",        category: "Science",       instructor: "Emily Turner", thumbnail: "/placeholder.svg" },
      ],
    }),

  getEnrolledCourses: (userId) =>
    Promise.resolve({
      success: true,
      courses: [
        { id: 5, title: "Economics O Levels", instructor: "Michael Brown", progress: 60, thumbnail: "/placeholder.svg" },
        { id: 6, title: "Physics O Levels",      instructor: "Emily Chen",    progress: 30, thumbnail: "/placeholder.svg" },
      ],
    }),

  getCourseDetails: (courseId) =>
    Promise.resolve({
      success: true,
      course: {
        id: courseId,
        title: courseId === 4 ? "Economics O Levels" : "Economics",
        instructor: courseId === 4 ? "Emily Turner" : "Michael Brown",
        views: courseId === 4 ? "2.3k" : "12.3k",
        rating: courseId === 4 ? 4.3 : 4.8,
        reviewsCount: courseId === 4 ? 892 : 21500,
        price: courseId === 4 ? 49.99 : 89.99,
        salePrice: courseId === 4 ? 19.99 : 14.99,
        description:
          courseId === 4
            ? "Master both microeconomic and macroeconomic principles at O-Level. Topics include supply & demand, fiscal policy, international trade, and development economics."
            : "Dive into the core principles of micro- and macroeconomics with our O Level Economics course. You’ll explore how individuals, firms and governments make choices—studying supply and demand, market structures, national income, inflation, trade and development. Through clear explanations, real-world case studies and plenty of practice questions (including diagram work), you’ll build solid exam techniques and confidence. Whether you’re new to economics or aiming to boost your grades, this course will guide you step by step toward mastering the syllabus and acing your O Level exam.",
        videoUrl:
          courseId === 4
            ? "https://www.youtube.com/embed/kIFBaaPJUO0?si=0t9mcFhbBpZuwAxY"
            : "https://www.youtube.com/embed/kIFBaaPJUO0?si=0t9mcFhbBpZuwAxY",
        curriculum: [
          {
            id: 1,
            title: courseId === 4 ? "Module 1: Microeconomics" : "Module 1: Microeconomics",
            lessons: [
              { id: 1, title: courseId === 4 ? "Demand & Supply"          : "Demand & Supply",   duration: "12:30" },
              { id: 2, title: courseId === 4 ? "Elasticities"             : "Elasticities", duration: "15:45" },
              { id: 3, title: courseId === 4 ? "Consumer Theory"          : "Consumer Theory",      duration: "18:20" },
            ],
          },
          {
            id: 2,
            title: courseId === 4 ? "Module 2: Macroeconomics" : "Module 2: Macroeconomics",
            lessons: [
              { id: 4, title: courseId === 4 ? "Fiscal Policy"            : "Fiscal Policy",        duration: "14:50" },
              { id: 5, title: courseId === 4 ? "Inflation & Unemployment" : "Inflation & Unemployment", duration: "16:10" },
              { id: 6, title: courseId === 4 ? "International Trade"      : "International Trade",   duration: "13:05" },
            ],
          },
        ],
      },
    }),

  enrollCourse: (userId, courseId) =>
    Promise.resolve({ success: true, message: "Enrolled!" }),

  // --- LESSON CONTENT ---
  getLessonContent: (courseId, lessonId) =>
    coursesAPI
      .getCourseDetails(Number(courseId))
      .then((res) => {
        const allLessons = res.course.curriculum.flatMap((m) => m.lessons)
        const found = allLessons.find((l) => l.id === Number(lessonId))
        if (!found) throw new Error("Lesson not found")
        return {
          success: true,
          lesson: {
            ...found,
            videoUrl: res.course.videoUrl,
            content: `### ${found.title}\n\nHere is your summary content for **${found.title}**.`,
          },
        }
      }),

}

export const assistantAPI = {
  sendMessage: q => apiRequest("/ask", "POST", { question: q }),
};

export const summarizerAPI = {
  getChapters: ()   => apiRequest("/summarize/chapters", "GET"),
  summarize:   chap => apiRequest("/summarize",            "POST", { chapter: chap }),
};
