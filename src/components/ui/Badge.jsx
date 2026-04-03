import React from 'react';

/**
 * Reusable Badge component for displaying small tags, labels, or statuses.
 * 
 * @param {Object} props - Component properties
 * @param {'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple'} [props.variant='neutral'] - Badge color variation
 * @param {string} [props.className=''] - Additional tailwind classes
 * @param {React.ReactNode} [props.icon=null] - Optional leading icon
 * @param {React.ReactNode} props.children - Badge label content
 * @returns {JSX.Element}
 */
export const Badge = ({
  variant = 'neutral',
  className = '',
  icon = null,
  children,
  ...rest
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border';

  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const combinedClass = [
    baseStyles,
    variants[variant],
    className
  ].join(' ');

  return (
    <span className={combinedClass} {...rest}>
      {icon && <span className="opacity-70 shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
