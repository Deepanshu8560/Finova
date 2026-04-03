import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../lib/constants';

/**
 * Horizontally scrollable row of rounded pill buttons for predefined queries.
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onSelect - Callback returning the selected question string
 * @returns {JSX.Element}
 */
export const SuggestedQuestions = ({ onSelect }) => {
  const [displayQuestions, setDisplayQuestions] = useState([]);

  // Scramble questions on mount
  useEffect(() => {
    const shuffled = [...SUGGESTED_QUESTIONS].sort(() => 0.5 - Math.random());
    setDisplayQuestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="w-full mb-6 relative">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-600">
        <Sparkles className="w-4 h-4 text-primary-500" />
        <span>Try asking...</span>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {displayQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm hover:text-primary-700 transition-all group"
          >
            {q}
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-500" />
          </button>
        ))}
      </div>
      
      {/* Scroll indicator gradient - specifically tuned for light setup */}
      <div className="absolute right-0 top-7 bottom-2 w-12 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none sm:hidden" />
    </div>
  );
};

export default SuggestedQuestions;
