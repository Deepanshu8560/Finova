import React from 'react';
import { TimeRangeSelector } from './TimeRangeSelector';

/**
 * Reusable chart container with standardised header, optional time-range selector,
 * and a loading skeleton.
 *
 * @param {Object}   props
 * @param {string}   props.title               — Chart heading
 * @param {string}   [props.subtitle='']       — Secondary description
 * @param {string}   [props.timeRange='']      — Selected time range value
 * @param {Function} [props.onTimeRangeChange] — Passed to TimeRangeSelector
 * @param {boolean}  [props.isLoading=false]   — Shows skeleton while data loads
 * @param {React.ReactNode} props.children     — Recharts markup
 * @returns {JSX.Element}
 */
export const ChartCard = ({
  title,
  subtitle = '',
  timeRange = '',
  onTimeRangeChange,
  isLoading = false,
  children,
}) => {
  const showSelector = Boolean(timeRange && onTimeRangeChange);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 pt-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {showSelector && (
          <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
        )}
      </div>

      {/* Chart area */}
      <div className="flex-1 px-2 pt-4 pb-2 min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-[280px] rounded-xl bg-slate-100 animate-skeleton-pulse mx-4" />
        ) : (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
