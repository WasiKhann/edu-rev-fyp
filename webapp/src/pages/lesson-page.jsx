// src/pages/lesson-page.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/common/navbar"
import { coursesAPI } from "../services/api"
import { ArrowLeft, MessageSquare, BookOpen } from "lucide-react"

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const [lesson, setLesson]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await coursesAPI.getLessonContent(courseId, lessonId)
        setLesson(res.lesson)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId, lessonId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
    )
  }
  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="text-red-600 dark:text-red-400">{error || "Lesson not found"}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Link to={`/course/${courseId}`} className="inline-flex items-center text-indigo-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Course
          </Link>
          <div className="space-x-4">
            <Link
              to="/assistant"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
            >
              <MessageSquare className="w-5 h-5 mr-2" /> AI Assistant
            </Link>
            <Link
              to="/summarizer"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
            >
              <BookOpen className="w-5 h-5 mr-2" /> Summarizer
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold">{lesson.title}</h1>

        <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
          <video src={lesson.videoUrl} controls className="w-full h-full object-cover" />
        </div>

        <article className="prose dark:prose-dark max-w-none">
          {lesson.content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </article>
      </main>
    </div>
  )
}
