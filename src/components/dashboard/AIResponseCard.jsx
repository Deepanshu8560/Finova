import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { useClipboard } from '../../hooks/useClipboard';
import { formatRelativeTime } from '../../lib/utils';
import { Bot, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';

/**
 * AI Response presentation with typewriter effect and emerald accent border.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.question - The query the user asked
 * @param {string} props.answer - The LLM's response
 * @param {Date|number} props.timestamp - When it was generated
 * @param {number} [props.latency] - Number of milliseconds it took
 * @returns {JSX.Element}
 */
export const AIResponseCard = ({
  question,
  answer,
  error,
  timestamp,
  latency,
  isTyping = false, // Added prop to control final state buttons rendering
}) => {
  const { copied, copy } = useClipboard();
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null
  
  // Use a stable fallback timestamp if none is explicitly provided contextually
  const [fallbackTime] = useState(() => Date.now());
  const finalTimestamp = timestamp || fallbackTime;

  const feedbackActionVars = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    null: 'text-slate-400 hover:text-slate-600 hover:bg-slate-50',
  };

  return (
    <Card className="border-l-4 border-l-primary-500 shadow-sm bg-white relative overflow-hidden">
      
      <div className="flex items-start gap-4 mb-5 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-1">
          <span className="text-sm font-semibold text-slate-700">YOU</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-slate-900">{question}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{formatRelativeTime(finalTimestamp)}</span>
            {latency !== null && latency !== undefined && (
              <>
                <span>•</span>
                <span className="text-slate-400">Answered in {Math.round(latency)}ms</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-200 text-primary-600 mt-1">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          {!error ? (
            <>
              <div className={`text-slate-700 leading-relaxed ${isTyping ? 'animate-pulse' : ''}`}>
                {answer}
                {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-slate-300 animate-pulse" />}
              </div>

              {!isTyping && (
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 animate-in fade-in">
                  <div className="flex gap-2">
                    <Tooltip content={feedback === 'up' ? "Feedback sent" : "Helpful"}>
                      <button 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${feedback === 'up' ? feedbackActionVars.up : feedbackActionVars.null}`}
                        onClick={() => setFeedback('up')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content={feedback === 'down' ? "Feedback sent" : "Not helpful"}>
                      <button 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${feedback === 'down' ? feedbackActionVars.down : feedbackActionVars.null}`}
                        onClick={() => setFeedback('down')}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>

                  <Tooltip content={copied ? "Copied!" : "Copy to clipboard"}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      onClick={() => copy(answer)}
                      className={copied ? "text-primary-600" : ""}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </Tooltip>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">Couldn't reach the AI right now. Try again?</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AIResponseCard;
