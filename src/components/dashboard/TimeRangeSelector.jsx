import React from 'react';
import { TIME_RANGES } from '../../lib/constants';

/**
 * Tab-like selector for time range filtration.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.value - Currently selected time range value
 * @param {Function} props.onChange - Callback fired with new value when clicked
 * @param {string} [props.className=''] - Additional inline classes
 * @returns {JSX.Element}
 */
export const TimeRangeSelector = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 ${className}`}>
      {TIME_RANGES.map((range) => {
        const isActive = value === range.value;
        const stateClass = isActive 
          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
          : 'text-slate-500 hover:text-slate-700 bg-transparent border border-transparent';
          
        return (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${stateClass}`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeSelector;
