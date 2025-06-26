// src/components/quiz-popup.jsx
"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Check } from "lucide-react"

export const QuizPopup = ({ questions, onClose, onProgressUpdate }) => {
  const [userAnswers, setUserAnswers] = useState({})
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState({})
  const [progress, setProgress] = useState(0)

  // Calculate progress whenever results change
  useEffect(() => {
    const correctAnswers = questions.filter(q => 
      results[q.id] && !results[q.id].includes("Score: 0")
    ).length
    const newProgress = Math.round((correctAnswers / questions.length) * 100)
    setProgress(newProgress)
    onProgressUpdate(newProgress) // Send progress to parent
  }, [results, questions.length, onProgressUpdate])

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async (questionId) => {
    if (!userAnswers[questionId]?.trim()) return
    
    setIsLoading(prev => ({ ...prev, [questionId]: true }))
    
    try {
      const response = await fetch('https://ceae-34-93-156-129.ngrok-free.app/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          student_answer: userAnswers[questionId]
        }),
      })
      
      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [questionId]: data.result
      }))
    } catch (error) {
      console.error("Evaluation error:", error)
      setResults(prev => ({
        ...prev,
        [questionId]: "Error: Could not evaluate answer"
      }))
    } finally {
      setIsLoading(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const allAnswered = questions.every(q => results[q.id])
  const correctCount = questions.filter(q => 
    results[q.id] && !results[q.id].includes("Score: 0")
  ).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">
                Quiz Progress: {correctCount}/{questions.length} Correct
              </h2>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close quiz"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => {
              const isCorrect = results[question.id] && !results[question.id].includes("Score: 0")
              return (
                <div 
                  key={question.id} 
                  className={`space-y-3 p-4 rounded-lg ${
                    results[question.id] 
                      ? isCorrect 
                        ? "bg-green-50 dark:bg-green-900/20" 
                        : "bg-red-50 dark:bg-red-900/20"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="font-medium text-lg flex items-center">
                    {results[question.id] && (
                      <span className={`mr-2 ${
                        isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                    )}
                    {question.question}
                  </div>
                  
                  <textarea
                    value={userAnswers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      results[question.id]
                        ? isCorrect
                          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/10 focus:ring-green-500"
                          : "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-indigo-500"
                    }`}
                    rows={3}
                    placeholder="Type your answer here..."
                    disabled={!!results[question.id]}
                  />
                  
                  <div className="flex justify-between items-center">
                    {results[question.id] ? (
                      <div className={`p-3 rounded-md flex-1 ${
                        isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <div className="flex items-start">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-300 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 mr-2 text-red-600 dark:text-red-300 flex-shrink-0" />
                          )}
                          <div className="whitespace-pre-wrap">{results[question.id]}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1"></div>
                    )}
                    
                    {!results[question.id] && (
                      <button
                        onClick={() => handleSubmit(question.id)}
                        disabled={!userAnswers[question.id]?.trim() || isLoading[question.id]}
                        className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:bg-indigo-400 flex items-center min-w-[120px] justify-center"
                      >
                        {isLoading[question.id] ? (
                          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {allAnswered ? (
                  <span className="text-green-600 dark:text-green-400">
                    Quiz completed! You got {correctCount} out of {questions.length} correct.
                  </span>
                ) : (
                  `${correctCount} correct answers so far`
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                {allAnswered ? "View Results" : "Close Quiz"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}