import React from 'react';

/**
 * Card and subcomponents for consistent card layouts
 */
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>  
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 ${className}`}>  
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>{children}</div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-4 py-2 border-t border-gray-200 dark:border-gray-700 ${className}`}>  
      {children}
    </div>
  );
}
