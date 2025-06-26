"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "./theme-switcher";
import {
  Menu,
  X,
  Home,
  MessageSquare,
  User,
  BookOpen,
  LogOut,
  ChevronDown,
  Search,
  ShoppingCart,
  Bell,
  Heart,
} from "lucide-react";

const minimalRoutes = ["/login", "/signup"];

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (minimalRoutes.includes(location.pathname)) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-gray-100 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-10 h-10 text-indigo-500" />
            <span className="text-2xl font-bold">EduRev</span>
          </Link>
          <div className="space-x-3">
            <Link
              to="/login"
              className="px-5 py-2 border border-gray-400 rounded hover:bg-gray-700 transition"
              aria-label="Log in to your account"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition"
              aria-label="Create a new account"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const isActive = (path) => location.pathname === path;
  const userInitial = user?.full_name?.charAt(0).toUpperCase() ?? "U";
  const userName = user?.full_name ?? "User";

  const categories = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "Programming Languages",
    "Game Development",
    "Database Design",
    "Software Testing",
    "Software Engineering",
    "Development Tools",
    "No-Code Development",
  ];

  const baseClasses = "fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 h-16";
  const dynamicClasses = scrolled
    ? "shadow-md dark:shadow-lg"
    : "";

  return (
    <nav className={`${baseClasses} ${dynamicClasses}`} aria-label="Main navigation">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full w-full">
          {/* Logo & Categories */}
          <div className="flex items-center flex-1">
            <Link
              to="/home"
              className="flex items-center space-x-3 text-gray-900 dark:text-gray-100"
              aria-label="Go to homepage"
            >
              <BookOpen className="w-10 h-10 text-[#5624d0]" />
              <span className="text-2xl font-bold">EduRev</span>
            </Link>
            <div className="hidden md:block ml-16 relative group">
              <button
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#5624d0] px-4 py-2 rounded-md text-base font-medium"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Browse categories"
              >
                Categories
                <ChevronDown className="ml-1 w-5 h-5" />
              </button>
              <div
                className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                role="menu"
              >
                <div className="py-1 max-h-96 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${cat
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#5624d0]"
                      role="menuitem"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-3xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full" role="search">
              <input
                type="text"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-12 pr-4 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5624d0]"
                aria-label="Search for courses and content"
              />
              <button
                className="absolute inset-y-0 left-0 pl-4 flex items-center"
                aria-label="Submit search"
              >
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-400" />
              </button>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:justify-end flex-1 space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/home"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/home")
                      ? "text-[#5624d0]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                  }`}
                  aria-current={isActive("/home") ? "page" : undefined}
                >
                  <Home className="w-5 h-5 mr-2" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/wishlist"
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/wishlist")
                      ? "text-[#5624d0]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                  }`}
                  aria-label="View your wishlist"
                  aria-current={isActive("/wishlist") ? "page" : undefined}
                >
                  <Heart className="w-5 h-5" />
                </Link>

                <Link
                  to="/cart"
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/cart")
                      ? "text-[#5624d0]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                  }`}
                  aria-label="View your shopping cart"
                  aria-current={isActive("/cart") ? "page" : undefined}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>

                <Link
                  to="/notifications"
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/notifications")
                      ? "text-[#5624d0]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                  }`}
                  aria-label="View notifications"
                  aria-current={isActive("/notifications") ? "page" : undefined}
                >
                  <Bell className="w-5 h-5" />
                </Link>

                <ThemeSwitcher className="ml-1" />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 px-3 py-1 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                    aria-haspopup="true"
                    aria-expanded={showProfileMenu}
                    aria-label="User profile menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#5624d0] flex items-center justify-center text-white text-sm">
                      {userInitial}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
                      role="menu"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                        aria-label="View your profile"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/assistant"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                        aria-label="AI Assistant"
                      >
                        <MessageSquare className="w-4 h-4 mr-3" />
                        AI Assistant
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        role="menuitem"
                        aria-label="Log out of your account"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-[#5624d0] border border-[#5624d0] dark:border-gray-600 dark:text-gray-100 hover:bg-[#f7f5ff] dark:hover:bg-gray-700"
                  aria-label="Log in to your account"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-[#5624d0] hover:bg-[#401b9c]"
                  aria-label="Create a new account"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden space-x-3">
            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
                aria-label="Open search"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#5624d0]"
              aria-label="Main menu"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden py-2">
            <form onSubmit={handleSearch} className="relative" role="search">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5624d0]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for courses and content"
              />
              <button
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
                aria-label="Submit search"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowSearch(false)}
                aria-label="Close search"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg" role="menu">
            <div className="space-y-1 py-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-current={isActive("/home") ? "page" : undefined}
                  >
                    Home
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="View your wishlist"
                    aria-current={isActive("/wishlist") ? "page" : undefined}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="View your shopping cart"
                    aria-current={isActive("/cart") ? "page" : undefined}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="View notifications"
                    aria-current={isActive("/notifications") ? "page" : undefined}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="View your profile"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/assistant"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="AI Assistant"
                  >
                    AI Assistant
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="Log out of your account"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="Log in to your account"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="menuitem"
                    aria-label="Create a new account"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;