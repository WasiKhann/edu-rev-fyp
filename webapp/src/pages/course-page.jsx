// src/pages/course-page.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/common/navbar"
import { coursesAPI } from "../services/api"
import { MessageSquare, BookOpen, User, Eye, Star, Calendar, Clock, ClipboardCheck } from "lucide-react"
import { QuizPopup } from "../pages/quiz-popup"

const quizQuestions = [
  { id: "1a", question: "What is meant by an oligopoly?" },
  { id: "1b", question: "What is meant by marginal cost?" },
  { id: "1c", question: "What is meant by excess demand?" },
  { id: "2a", question: "What is meant by Gross Domestic Product (GDP)?" },
  { id: "2b", question: "What is meant by inflation?" }
]

export default function CoursePage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizProgress, setQuizProgress] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await coursesAPI.getCourseDetails(Number(courseId))
        setCourse(res.course)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (courseId) load()
  }, [courseId])

  const handleProgressUpdate = (progress) => {
    setQuizProgress(progress)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="text-red-600 dark:text-red-400">{error || "Course not found"}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-3/4 space-y-6">
            {/* Course Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 space-x-6">
                <div className="flex items-center"><User className="w-4 h-4 mr-1" />{course.instructor}</div>
                <div className="flex items-center"><Eye className="w-4 h-4 mr-1" />{course.views} views</div>
                <div className="flex items-center"><Star className="w-4 h-4 mr-1" />{course.rating} ({course.reviewsCount})</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />Last updated: May 2023</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />Duration: 2h 30m</div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/assistant"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition-colors"
                >
                  <MessageSquare className="w-5 h-5 mr-2" /> AI Assistant
                </Link>
                <Link
                  to="/summarizer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" /> Summarizer
                </Link>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow transition-colors"
                >
                  <ClipboardCheck className="w-5 h-5 mr-2" /> Take Quiz
                  {quizProgress > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold bg-white text-purple-600 rounded-full">
                      {quizProgress}%
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Course Curriculum Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <div className="space-y-6">
                {(course.curriculum || []).map((mod) => (
                  <div key={mod.id} className="space-y-2">
                    <h3 className="font-medium">{mod.title}</h3>
                    <ul className="pl-4 space-y-1">
                      {(mod.lessons || []).map((lesson) => (
                        <li key={lesson.id} className="flex justify-between">
                          <Link
                            to={`/course/${course.id}/lesson/${lesson.id}`}
                            className="text-indigo-600 hover:underline transition-colors"
                          >
                            {lesson.title}
                          </Link>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {lesson.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:w-1/4 space-y-6">
            {/* Course Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="font-medium mb-2">Course Progress</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${course.progress || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {course.progress || 0}% Complete
              </p>
            </div>

            {/* Quiz Progress Section - Only shows if quiz has been started */}
            {quizProgress > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-medium mb-2">Quiz Progress</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${quizProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {Math.round(quizProgress/20)} of {quizQuestions.length} questions correct
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Quiz Popup */}
        {showQuiz && (
          <QuizPopup 
            questions={quizQuestions}
            onClose={() => setShowQuiz(false)}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>
    </div>
  )
}