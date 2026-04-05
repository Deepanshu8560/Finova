import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated number counter. Progressively increments a value from 0 on first render.
 * 
 * @param {Object} props
 * @param {number} props.value - The final numeric value
 * @param {number} [props.duration=1000] - Animation duration in ms
 * @param {function} [props.formatter=(v) => v] - Optional value formatter
 */
export const NumberCounter = ({ value, duration = 1000, formatter = (v) => v }) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    const startValue = 0;
    const endValue = parseFloat(value);
    
    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      const currentCount = progress * (endValue - startValue) + startValue;
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, duration]);

  return <span>{formatter(count)}</span>;
};
