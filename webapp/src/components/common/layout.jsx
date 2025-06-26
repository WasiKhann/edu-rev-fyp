import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from './navbar';

function Layout() {
  const location = useLocation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Animate page transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />  {/* renders the current page content */}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Footer (optional) */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} EduRev. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;
