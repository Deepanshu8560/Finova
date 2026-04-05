import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Input component with labels, errors, and optional icons.
 * 
 * @param {Object} props - Component properties
 * @param {string} [props.label=''] - Input label above the field
 * @param {string} [props.error=''] - Error message to display. Also triggers error styling.
 * @param {string} [props.helperText=''] - Secondary text below input
 * @param {React.ReactNode} [props.leftIcon=null] - Icon displayed inside input on left
 * @param {React.ReactNode} [props.rightIcon=null] - Icon displayed inside input on right
 * @param {string} [props.className=''] - Additional class names for wrapper
 * @param {string} [props.id=''] - Input ID. Generated if not supplied.
 * @param {'text' | 'email' | 'password' | 'number' | 'search'} [props.type='text'] - Input type
 * @returns {JSX.Element}
 */
export const Input = React.forwardRef(({
  label = '',
  error = '',
  helperText = '',
  leftIcon = null,
  rightIcon = null,
  className = '',
  id = '',
  type = 'text',
  ...rest
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const hasError = Boolean(error);

  const baseInputStyles = 'w-full rounded-lg bg-white dark:bg-slate-900 border px-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all duration-200 outline-none';
  
  const stateVariants = {
    default: 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-slate-400 dark:hover:border-slate-600',
    error: 'border-rose-300 dark:border-rose-900/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900 dark:text-rose-400',
  };

  const sizeVariants = {
    md: 'py-2',
    lg: 'py-3 text-base',
  };

  const currentVariant = hasError ? stateVariants.error : stateVariants.default;
  // Fallback to md if not explicitly passing lg by using rest props (though in this generic setup we force md size class for standard inputs, lg sizes handled manually via classes if needed)
  const padLeft = leftIcon ? 'pl-9' : '';
  const padRight = (rightIcon || hasError) ? 'pr-9' : '';

  const combinedInputClass = [
    baseInputStyles,
    sizeVariants.md,
    currentVariant,
    padLeft,
    padRight
  ].join(' ');

  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={combinedInputClass}
          {...rest}
        />
        
        {rightIcon && !hasError && (
          <div className="absolute right-3 text-slate-400">
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 text-rose-500 pointer-events-none">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p 
          className={`mt-1.5 text-xs font-medium ${hasError ? 'text-rose-500' : 'text-slate-500'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
