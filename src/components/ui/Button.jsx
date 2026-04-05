import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component acting as a core UI primitive.
 * 
 * @param {Object} props - Component properties
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} [props.variant='primary'] - Visual style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Triggers loading state with a spinner
 * @param {React.ReactNode} [props.leftIcon=null] - Icon displayed before text
 * @param {React.ReactNode} [props.rightIcon=null] - Icon displayed after text
 * @param {boolean} [props.disabled=false] - Disables interaction and dims button
 * @param {string} [props.className=''] - Additional tailwind classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Form button behavior
 * @returns {JSX.Element}
 */
export const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}, ref) => {

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:   'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-300 dark:focus:ring-slate-700 shadow-sm',
    ghost:     'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-200 dark:focus:ring-slate-700',
    danger:    'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-800 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const isDisabledStyles = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed hover:-translate-y-0 hover:shadow-none' 
    : 'hover:-translate-y-0.5 hover:shadow-md active:-translate-y-0 active:shadow-sm';

  const combinedClassName = [
    baseStyles,
    variants[variant],
    sizes[size],
    isDisabledStyles,
    className
  ].join(' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...rest}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
