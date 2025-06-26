// src/pages/summarizer-page.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "../components/common/navbar"
import { summarizerAPI } from "../services/api"
import { Send, BookOpen, User, Search } from "lucide-react"

const chapterListText = `
Choose the chapter you want a summary of:
📚 Available Chapters:
1. The nature of the economic problem
2. The factors of production
3. Opportunity cost
4. Production possibility curve
5. Microeconomics and macroeconomics
6. The role of markets in allocating resources
7. Demand
8. Supply
9. Price determination
10. Price changes
11. Price elasticity of demand
12. Price elasticity of supply
13. Market economic system
14. Market failure
15. Mixed economic system
16. Money and banking
17. Households
18. Workers
19. Trade unions
20. Firms
21. Firms and production
22. Firms’ costs, revenue and objectives
23. Market structure
24. The role of government
25. The macroeconomic aims of government
26. Fiscal policy
27. Monetary policy
28. Supply-side policy
29. Economic growth
30. Employment and unemployment
31. Inflation and deflation
32. Living standards
33. Poverty
34. Population
35. Differences in economic development between countries
36. International specialisation
37. Globalisation, free trade and protection
38. Foreign exchange rates
39. Current account of balance of payments

Enter chapter number:
`.trim()

const SummarizerPage = () => {
  const initialMessage = {
    id: "1",
    text: chapterListText,
    sender: "assistant",
    timestamp: new Date(),
  }

  const [messages, setMessages]     = useState([initialMessage])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading]   = useState(false)
  const messagesEndRef              = useRef(null)

  // mock history list (front-end only)
  const historyList = [
    { id: "h1", title: "Chapter Summaries" },
    { id: "h2", title: "Quick Notes" },
    { id: "h3", title: "Revision Pack" },
  ]

  // auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const chapterNum = inputValue.trim()
    if (!chapterNum) return

    // add user message
    const userMsg = {
      id: Date.now().toString(),
      text: chapterNum,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      // call your summarizer API: expects { success, summary }
      const { summary } = await summarizerAPI.summarize(chapterNum)
      const botMsg = {
        id: (Date.now()+1).toString(),
        text: summary || "No summary returned.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      const errMsg = {
        id: (Date.now()+1).toString(),
        text: err.message || "Sorry, could not generate summary.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          
          {/* Sidebar: History */}
          <aside className="w-1/4 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex flex-col">
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
            <ul className="flex-1 overflow-y-auto px-4 space-y-2">
              {historyList.map(h => (
                <li
                  key={h.id}
                  className="px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                >
                  {h.title}
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat area */}
          <section className="w-3/4 flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              <h1 className="text-xl font-semibold">Summarizer</h1>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender==="user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`
                    max-w-[80%] rounded-lg p-3 whitespace-pre-wrap break-words
                    ${msg.sender==="user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender==="assistant"
                        ? <BookOpen className="w-4 h-4 mr-1"/>
                        : <User     className="w-4 h-4 mr-1"/>
                      }
                      <span className="text-xs opacity-75">
                        {msg.sender==="user" ? "You" : "Summarizer"} •{" "}
                        {msg.timestamp.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
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
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"/>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:"0.2s"}}/>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:"0.4s"}}/>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef}/>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter chapter number..."
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

export default SummarizerPage

