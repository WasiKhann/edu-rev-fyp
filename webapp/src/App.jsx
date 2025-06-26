import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import LoginPage      from "./pages/login-page"
import SignUpPage     from "./pages/sign-up-page"
import HomePage       from "./pages/home-page"
import CoursePage     from "./pages/course-page"
import LessonPage     from "./pages/lesson-page"
import ProfilePage    from "./pages/profile-page"
import ChatbotPage    from "./pages/chatbot-page"
import SummarizerPage from "./pages/summarizer-page"
import ProtectedRoute from "./components/common/protected-route"

function App() {
  return (
    <Routes>
      {/* redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* public */}
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* after login */}
      <Route path="/home"       element={<HomePage />} />
      <Route path="/profile"    element={<ProfilePage />} />
      {/* <Route path="/course/:id" element={<CoursePage />} />
      <Route path="/lesson/:id" element={<LessonPage />} /> */}
      <Route
            path="/course/:courseId"
            element={<ProtectedRoute><CoursePage /></ProtectedRoute>}
          />
          {/* NEW: lesson detail */}
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={<ProtectedRoute><LessonPage /></ProtectedRoute>}
          />
      <Route path="/assistant"    element={<ChatbotPage />} />
      <Route path="/summarizer" element={<SummarizerPage />} />

      {/* catch-all → login */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
