// src/pages/chatbot-page.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "../components/common/navbar"
import { assistantAPI } from "../services/api"
import { Send, Bot, User, Search } from "lucide-react"

const ChatbotPage = () => {
  const initialMessage = {
    id: "1",
    text: "Hello! I'm your AI learning assistant. How can I help you today?",
    sender: "assistant",
    timestamp: new Date(),
  }

  const [messages, setMessages]     = useState([initialMessage])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading]   = useState(false)
  const messagesEndRef              = useRef(null)

  // mock history list (front-end only)
  const historyList = [
    { id: "h1", title: "Chat Session 1" },
    { id: "h2", title: "Economics Q&A" },
    { id: "h3", title: "React Help" },
  ]

  // auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const text = inputValue.trim()
    if (!text) return

    // add user message
    const userMsg = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await assistantAPI.sendMessage(text)
      const answerText = response.answer ?? response.message ?? "No answer returned."

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: answerText,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      const errMsg = {
        id: (Date.now() + 1).toString(),
        text: err.message || "Sorry, something went wrong.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          
          {/* Sidebar: Chat history */}
          <aside className="w-1/5 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* Search bar */}
            <div className="p-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search history"
                  className="flex-grow px-2 py-1 bg-transparent focus:outline-none text-gray-700 dark:text-gray-300"
                />
                <Search className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            {/* History list */}
            <ul className="flex-1 overflow-y-auto px-4 space-y-2">
              {historyList.map((h) => (
                <li
                  key={h.id}
                  className="px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                >
                  {h.title}
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat window */}
          <section className="w-4/5 flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center">
              <Bot className="w-6 h-6 mr-2" />
              <h1 className="text-xl font-semibold">AI Learning Assistant</h1>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap break-words
                      ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                      }
                    `}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender === "assistant" ? (
                        <Bot className="w-4 h-4 mr-1" />
                      ) : (
                        <User className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-xs opacity-75">
                        {msg.sender === "user" ? "You" : "AI Assistant"} •{" "}
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ChatbotPage
