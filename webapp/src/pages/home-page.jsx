// src/pages/home-page.jsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import { coursesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Clock,
  Play,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [allCourses, setAll] = useState([]);
  const [enrolled, setEnr] = useState([]);
  const [loading, setLoad] = useState(true);
  const [searchTerm, setSearch] = useState("");
  const [activeCat, setCat] = useState("All");

  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Mobile",
    "Design",
    "Business",
  ];

  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const a = await coursesAPI.getAllCourses();
        setAll(a.courses);
        if (user) {
          const e = await coursesAPI.getEnrolledCourses(user.user_id);
          setEnr(e.courses);
        }
      } catch {
        // ignore
      }
      setLoad(false);
    })();
  }, [user]);

  const recommended = allCourses.filter((c) => {
    const t = c.title?.toLowerCase() ?? "";
    const d = (c.description ?? "").toLowerCase();
    const matchSearch =
      t.includes(searchTerm.toLowerCase()) ||
      d.includes(searchTerm.toLowerCase());
    const matchCat = activeCat === "All" || c.category === activeCat;
    return matchSearch && matchCat;
  });

  const fmtPrice = (p) =>
    `$${(typeof p === "number" ? p : 0).toFixed(2)}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 container mx-auto px-6 flex-grow">
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-8 mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-indigo-100 mt-2">
              Continue your learning journey today.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/assistant"
              className="inline-flex items-center space-x-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white/20 transition"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Ask AI Assistant</span>
            </Link>
            {/* <Link
              to="/summarizer"
              className="inline-flex items-center space-x-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white/20 transition"
            >
              <BookOpen className="w-5 h-5" />
              <span>Summarizer</span>
            </Link> */}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCat === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* My Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Courses
            </h2>
            <Link
              to="/my-learning"
              className="flex items-center text-indigo-500 hover:text-indigo-600"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"
                />
              ))}
            </div>
          ) : enrolled.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {enrolled.map((c) => (
                <Link
                  key={c.course_id}
                  to={`/course/${c.course_id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {fmtPrice(c.price)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Progress: {c.progress ?? 0}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You haven’t enrolled in any courses yet.
              </p>
              <a
                href="#available-courses"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Browse Courses
              </a>
            </div>
          )}
        </section>

        {/* Recommended Courses */}
        <section id="available-courses">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Recommended Courses
          </h2>
          {loading ? (
            <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"
                />
              ))}
            </div>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommended.map((c) => (
                <div
                  key={c.course_id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition"
                >
                  <div className="relative">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={() =>
                        coursesAPI.enrollCourse(user.user_id, c.course_id)
                      }
                      className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {fmtPrice(c.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No courses found.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}