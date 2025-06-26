import React from "react";
import Navbar from "../components/common/navbar";
import {
  Eye,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";

const EconomicsOlevels = () => {
  // Hard-coded course data for demo
  const course = {
    title: "Economics O Levels",
    description:
      "A comprehensive O Level Economics course covering Microeconomics, Macroeconomics, and International Trade.",
    category: "Economics",
    level: "O Levels",
    views: 12400,
    rating: 4.7,
    reviews: 340,
    duration: "12h 30m",
    lastUpdated: "April 2025",
    price: 39.99,
    oldPrice: 119.99,
    includes: [
      "15 video lectures",
      "Downloadable handouts",
      "Full lifetime access",
      "Certificate of completion",
    ],
    curriculum: [
      {
        module: "Module 1: Basic Concepts",
        videos: [
          { title: "What is Economics?", length: "12:00" },
          { title: "Supply & Demand", length: "18:45" },
          { title: "Market Equilibrium", length: "21:30" },
        ],
      },
      {
        module: "Module 2: Microeconomics",
        videos: [
          { title: "Consumer Behaviour", length: "14:20" },
          { title: "Production & Costs", length: "17:10" },
          { title: "Perfect Competition", length: "19:50" },
        ],
      },
      {
        module: "Module 3: Macroeconomics",
        videos: [
          { title: "GDP & Growth", length: "16:05" },
          { title: "Inflation & Unemployment", length: "20:15" },
          { title: "Fiscal Policy", length: "22:40" },
        ],
      },
      {
        module: "Module 4: International Economics",
        videos: [
          { title: "Trade Theory", length: "15:30" },
          { title: "Exchange Rates", length: "18:25" },
          { title: "Trade Policies", length: "17:55" },
        ],
      },
      {
        module: "Module 5: Revision & Exam Tips",
        videos: [
          { title: "Past Paper Walkthrough", length: "23:10" },
          { title: "Exam Strategies", length: "19:00" },
          { title: "Q&A Session", length: "25:20" },
        ],
      },
      {
        module: "Module 6: Bonus Case Studies",
        videos: [
          { title: "Economic Crisis Case Study", length: "30:00" },
          { title: "Development Economics", length: "28:45" },
          { title: "Sustainability Economics", length: "26:30" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Top banner */}
        <div className="grid grid-cols-2 gap-8 mb-12 bg-indigo-600 text-white rounded-lg p-8">
          <div>
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="px-2 py-1 bg-green-500 rounded text-xs">
                {course.category}
              </span>
              <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-700 rounded text-xs text-indigo-900 dark:text-indigo-100">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="max-w-2xl mb-6 opacity-90">{course.description}</p>
            <div className="flex items-center space-x-6 text-sm opacity-80">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{course.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span>
                  {course.rating} ({course.reviews.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* Price box */}
          <aside className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow">
            <div className="text-2xl font-bold mb-1">${course.price.toFixed(2)}</div>
            <div className="text-sm line-through opacity-60 mb-4">
              ${course.oldPrice.toFixed(2)}
            </div>
            <button className="w-full mb-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
              Enrolled
            </button>
            <button className="w-full py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded transition">
              Add to Wishlist
            </button>
            <div className="mt-6 text-xs opacity-80">
              <p className="font-semibold mb-2">This course includes:</p>
              <ul className="space-y-1">
                {course.includes.map((item) => (
                  <li key={item} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Curriculum */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Course Content
          </h2>
          <div className="space-y-6">
            {course.curriculum.map((mod) => (
              <div
                key={mod.module}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 font-semibold">
                  {mod.module} — {mod.videos.length} videos
                </div>
                <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                  {mod.videos.map((vid) => (
                    <li
                      key={vid.title}
                      className="px-6 py-3 flex justify-between text-gray-800 dark:text-gray-200"
                    >
                      <span>{vid.title}</span>
                      <span className="opacity-75">{vid.length}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EconomicsOlevels;
