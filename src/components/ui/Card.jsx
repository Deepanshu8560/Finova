import React from 'react';

/**
 * Reusable Card component serving as a container for grouped content.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} [props.header=null] - Header slot rendered at the top with border
 * @param {React.ReactNode} [props.footer=null] - Footer slot rendered at the bottom with border
 * @param {boolean} [props.hover=false] - Enables hover float animation and shadow
 * @param {string} [props.className=''] - Additional wrapper classes
 * @param {string} [props.bodyClassName=''] - Additional body/content classes
 * @param {React.ReactNode} props.children - Main card content
 * @returns {JSX.Element}
 */
export const Card = ({
  header = null,
  footer = null,
  hover = false,
  className = '',
  bodyClassName = '',
  children,
  ...rest
}) => {
  const baseCardStyles = 'rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-sm transition-colors duration-200';
  const hoverStyles = 'transition-all duration-300 hover:shadow-card-hover dark:hover:shadow-indigo-500/10 hover:-translate-y-0.5';

  const combinedClass = [
    baseCardStyles,
    hover ? hoverStyles : '',
    className
  ].join(' ').trim();

  return (
    <div className={combinedClass} {...rest}>
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-none bg-slate-50/50 dark:bg-slate-800/50">
          {header}
        </div>
      )}
      
      <div className={`p-5 flex-1 flex flex-col ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex-none bg-slate-50/50 dark:bg-slate-800/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
