import React, { useState, useRef, useEffect } from 'react';
import { Send, FileWarning, Sparkles } from 'lucide-react';
import { useAIQuery } from '../../hooks/useAIQuery';
import { useQueryHistory } from '../../hooks/useQueryHistory';
import { useAuthContext } from '../../context/AuthContext';
import { AIResponseCard } from './AIResponseCard';

/**
 * Large AI prompt bar for querying mock endpoints.
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.dashboardData - Serialized data provided as context to LLM
 * @param {string} [props.initialQuery=''] - Optional initial text value
 * @param {boolean} [props.compact=false] - Optional compact toggle (used globally)
 * @returns {JSX.Element}
 */
export const AIQueryBar = ({
  dashboardData,
  initialQuery = '',
  compact = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState('');
  const inputRef = useRef(null);
  
  const { user } = useAuthContext();
  const { response, loading, error, latencyMs, execute } = useAIQuery();
  const { saveQuery } = useQueryHistory(user?.uid);
  
  const handleSubmit = async (e, forceQuery = null) => {
    if (e) e.preventDefault();
    
    const textToSubmit = forceQuery || query;
    if (!textToSubmit.trim() || loading) return;

    setLastSubmittedQuery(textToSubmit);
    if (!forceQuery) setQuery('');
    if (inputRef.current) inputRef.current.blur();

    const result = await execute(textToSubmit, dashboardData);
    if (result) {
      saveQuery(textToSubmit, result, latencyMs);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      if (!compact) handleSubmit(null, initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const barClasses = compact 
    ? 'max-w-md shadow-sm border border-slate-200' 
    : 'max-w-3xl shadow-card hover:shadow-card-hover border border-slate-200';

  const inputClasses = compact 
    ? 'text-sm py-2.5 px-3' 
    : 'text-lg py-5 px-6';

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <form 
        onSubmit={handleSubmit}
        className={`relative w-full rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500 transition-all ${barClasses}`}
      >
        <div className="flex items-center w-full">
          {!compact && (
            <div className="pl-6 text-primary-500 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your data... (e.g. 'What is our MRR?')"
            className={`w-full bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 ${inputClasses}`}
            disabled={loading}
          />
          
          <div className="pr-2 flex items-center shrink-0">
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className={`flex items-center justify-center rounded-lg transition-colors ${
                query.trim() 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-slate-100 text-slate-400'
              } ${compact ? 'w-8 h-8' : 'w-12 h-12 mr-2'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className={compact ? 'w-4 h-4' : 'w-5 h-5 ml-0.5'} />
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="w-full max-w-3xl mt-4 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
          <FileWarning className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!compact && (loading || response) && (
        <div className="w-full mt-4">
          {loading ? (
            <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4 w-full">
              <div className="h-4 bg-slate-100 rounded w-1/3 animate-skeleton-pulse" />
              <div className="h-4 bg-slate-100 rounded w-full animate-skeleton-pulse" />
              <div className="h-4 bg-slate-100 rounded w-5/6 animate-skeleton-pulse" />
            </div>
          ) : (
            <AIResponseCard 
              question={lastSubmittedQuery}
              answer={response}
              timestamp={new Date().toISOString()}
              latency={latencyMs}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AIQueryBar;
