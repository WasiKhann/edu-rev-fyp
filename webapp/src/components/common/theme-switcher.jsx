import React, { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

function ThemeSwitcher() {
  // Initialize theme state from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-gray-800 dark:text-gray-100" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-800 dark:text-gray-100" />
      )}
    </button>
  );
}

export default ThemeSwitcher;
