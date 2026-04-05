import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * KPI Dashboard stat card. Displays a title, large value, trend delta, and optional sub-text.
 *
 * @param {Object}  props
 * @param {string}  props.title        - Metric label
 * @param {string}  props.value        - Formatted primary value
 * @param {string}  [props.delta]      - Delta text, e.g. "+12.4%"
 * @param {'up'|'down'|'neutral'} [props.deltaType='neutral']
 * @param {string}  [props.subtext]    - Secondary line below delta
 * @param {boolean} [props.isLoading=false]
 * @param {string}  [props.accentColor='emerald'] - Currently unused (reserved)
 * @returns {JSX.Element}
 */
export const StatCard = ({
  title,
  value,
  delta,
  deltaType = 'neutral',
  subtext,
  isLoading = false,
}) => {
  const deltaConfig = {
    up:      { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <TrendingUp  className="w-3 h-3" /> },
    down:    { text: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200',    icon: <TrendingDown className="w-3 h-3" /> },
    neutral: { text: 'text-slate-500',   bg: 'bg-slate-100',  border: 'border-slate-200',   icon: <Minus        className="w-3 h-3" /> },
  };

  const cfg = deltaConfig[deltaType] ?? deltaConfig.neutral;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Subtle top emerald line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title */}
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        {title}
      </p>

      {/* Value */}
      {isLoading ? (
        <div className="h-9 w-2/3 rounded-lg bg-slate-200 animate-skeleton-pulse mb-3" />
      ) : (
        <p className="text-[2rem] font-extrabold text-slate-900 leading-none mb-3 tabular-nums tracking-tight">
          {value}
        </p>
      )}

      {/* Delta + subtext */}
      {isLoading ? (
        <div className="h-5 w-2/5 rounded-full bg-slate-200 animate-skeleton-pulse" />
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          {delta && (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
              {cfg.icon}
              {delta}
            </span>
          )}
          {subtext && (
            <span className="text-xs text-slate-400">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
