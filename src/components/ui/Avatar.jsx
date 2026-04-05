import React, { useState } from 'react';
import { User } from 'lucide-react';

/**
 * Helper to extract initials from a string.
 * @param {string} name 
 * @returns {string} One or two character initials
 */
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Reusable Avatar component gracefully handling images, initials, or fallback icons.
 * 
 * @param {Object} props - Component properties
 * @param {string} [props.src=''] - URL to image
 * @param {string} [props.alt='User avatar'] - Alt text for image
 * @param {string} [props.name=''] - Full name used to generate initials if image fails
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - Avatar sizing
 * @param {string} [props.className=''] - Additional inline classes
 * @returns {JSX.Element}
 */
export const Avatar = ({
  src = '',
  alt = 'User avatar',
  name = '',
  size = 'md',
  className = '',
  ...rest
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const baseStyles = 'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 font-semibold';
  
  const combinedClass = [
    baseStyles,
    sizes[size],
    className
  ].join(' ');

  const showImage = src && !imageError;
  const showInitials = !showImage && name;

  return (
    <div className={combinedClass} {...rest}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : showInitials ? (
        getInitials(name)
      ) : (
        <User className={iconSizes[size]} />
      )}
    </div>
  );
};

export default Avatar;
