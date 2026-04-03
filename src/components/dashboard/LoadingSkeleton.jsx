import React from 'react';

/**
 * Generic pulsing skeleton loader to simulate content fetching states.
 * 
 * @param {Object} props - Component properties
 * @param {string|number} [props.width='100%'] - Element width
 * @param {string|number} [props.height='20px'] - Element height
 * @param {string} [props.className=''] - Additional inline classes
 * @returns {JSX.Element}
 */
export const LoadingSkeleton = ({
  width = '100%',
  height = '20px',
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`bg-slate-200 animate-skeleton-pulse rounded-md ${className}`}
      style={{ width, height }}
      {...rest}
    />
  );
};

export default LoadingSkeleton;
