import React from 'react';
import { Slot } from '@radix-ui/react-slot';

/**
 * Button component
 * Props:
 *  - asChild: render as the child element (e.g. Link) if true
 *  - variant: 'default' | 'outline'
 *  - className: additional Tailwind classes
 */
export default function Button({ asChild = false, variant = 'default', className = '', children, ...props }) {
  const Comp = asChild ? Slot : 'button';
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    default: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  return (
    <Comp
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
