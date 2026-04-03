import React, { useState } from 'react';

/**
 * Reusable Tooltip via pure CSS and React state using Tailwind.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.content - Tooltip text or inner content
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='top'] - Position relative to children
 * @param {string} [props.className=''] - Additional inline classes
 * @param {React.ReactNode} props.children - The wrapping trigger element
 * @returns {JSX.Element}
 */
export const Tooltip = ({
  content,
  position = 'top',
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position lookup
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow styles lookup based on position
  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent border-[6px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent border-[6px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent border-[6px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent border-[6px]',
  };

  const tooltipClasses = [
    'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-md shadow-elevated whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 pointer-events-none',
    positionStyles[position],
    className
  ].join(' ');

  const arrowClasses = [
    'absolute w-0 h-0',
    arrowStyles[position]
  ].join(' ');

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && content && (
        <div className={tooltipClasses}>
          {content}
          <div className={arrowClasses} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
