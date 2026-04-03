import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { Sparkles, Zap, TrendingUp, TrendingDown } from 'lucide-react';

import { useDashboardData } from '../hooks/useDashboardData';
import { useAIQuery } from '../hooks/useAIQuery';
import { useAuthContext } from '../context/AuthContext';
import { useQueryHistory } from '../hooks/useQueryHistory';
import { useDashboardContext } from '../components/layout/DashboardLayout';

import { StatCard } from '../components/dashboard/StatCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { DataTable } from '../components/dashboard/DataTable';
import { SuggestedQuestions } from '../components/dashboard/SuggestedQuestions';
import { AIResponseCard } from '../components/dashboard/AIResponseCard';
import { Badge } from '../components/ui/Badge';

import { formatCurrency, formatNumber } from '../lib/utils';

/* ─────────────────────────────────────────────────
   Chart colour tokens
───────────────────────────────────────────────── */
const CHART_COLORS = {
  primary:       '#10b981',
  primaryMid:    '#34d399',
  gradientStart: 'rgba(16, 185, 129, 0.22)',
  gradientEnd:   'rgba(16, 185, 129, 0)',
  grid:          '#e2e8f0',
  axis:          '#94a3b8',
};

const PIE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

/* ─────────────────────────────────────────────────
   Shared Recharts custom tooltip
───────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-elevated px-4 py-3 text-sm min-w-[140px]">
      <p className="font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-800 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-bold">
            {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue')
              ? formatCurrency(entry.value)
              : formatNumber(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Pie chart custom legend
───────────────────────────────────────────────── */
const CustomPieLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
        <span>{entry.value}</span>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────
   Inline skeleton shimmer
───────────────────────────────────────────────── */
const Shimmer = ({ className = '' }) => (
  <div className={`animate-skeleton-pulse bg-slate-200 rounded-md ${className}`} />
);

/**
 * Main Dashboard page showing KPIs, charts, data tables, and the AI query interface.
 * @returns {JSX.Element}
 */
export const DashboardPage = () => {
  const [timeRange, setTimeRange]         = useState('30d');
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const { user }                           = useAuthContext();
  const { metrics, revenueData, signupData, channelData, userData, loading }
                                           = useDashboardData(timeRange);
  const { response, loading: aiLoading, error: aiError, latencyMs, execute }
                                           = useAIQuery();
  const { saveQuery }                      = useQueryHistory(user?.uid);
  const { setIsAILoading }                 = useDashboardContext();

  // Keep the header progress bar in sync
  useEffect(() => { setIsAILoading(aiLoading); }, [aiLoading, setIsAILoading]);

  const handleAISubmit = async (question) => {
    const q = question?.trim();
    if (!q) return;
    setSelectedQuestion(q);
    const dashCtx = { metrics, revenueData, channelData, userData };
    const answer  = await execute(q, dashCtx);
    if (answer) saveQuery(q, answer, latencyMs);
  };

  /* ── User table column config ── */
  const statusVariants = { Active: 'success', Churned: 'error', Trial: 'info' };

  const userColumns = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900 text-sm">{val}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'plan', label: 'Plan', sortable: true,
      render: (val) => (
        <Badge variant={val === 'Enterprise' ? 'purple' : val === 'Pro' ? 'info' : 'neutral'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'mrr', label: 'MRR', sortable: true,
      render: (val) => (
        <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'joinDate', label: 'Join Date', sortable: true,
      render: (val) => (
        <span className="text-slate-500 text-sm">
          {new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: false,
      render: (val) => <Badge variant={statusVariants[val] || 'neutral'}>{val}</Badge>,
    },
  ];

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  return (
    <div className="space-y-7 pb-16">

      {/* ═══ ROW 1 — KPI stat cards ═══ */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <StatCard
            title="Monthly Recurring Revenue"
            value={loading ? '' : formatCurrency(metrics?.mrr ?? 34200)}
            delta="+12.4%"
            deltaType="up"
            subtext="vs. last month"
            isLoading={loading}
            accentColor="emerald"
          />
          <StatCard
            title="Annual Recurring Revenue"
            value={loading ? '' : formatCurrency(metrics?.arr ?? 410400)}
            delta="+12.4%"
            deltaType="up"
            subtext="annualised MRR"
            isLoading={loading}
            accentColor="emerald"
          />
          <StatCard
            title="Daily Active Users"
            value={loading ? '' : formatNumber(metrics?.dau ?? 1847)}
            delta="+5.2%"
            deltaType="up"
            subtext="vs. yesterday"
            isLoading={loading}
            accentColor="emerald"
          />
          <StatCard
            title="Churn Rate"
            value={loading ? '' : `${(metrics?.churnRate ?? 3.8)}%`}
            delta="-0.4%"
            deltaType="up"
            subtext="lower is better ↓"
            isLoading={loading}
            accentColor="emerald"
          />

        </div>
      </section>

      {/* ═══ ROW 2 — AI Query section ═══ */}
      <section
        className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16,185,129,0.07), transparent)',
        }}
      >
        {/* Subtle emerald top glow bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-60" />

        <div className="p-6 sm:p-8">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">Ask Your Data</h2>
              <p className="text-xs text-slate-400 mt-0.5">Powered by InsightAI · natural language queries</p>
            </div>
          </div>

          {/* Query input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleAISubmit(selectedQuestion); }}
            className={`
              relative group w-full rounded-xl border transition-all duration-200 mb-4
              ${aiLoading
                ? 'border-primary-300 bg-primary-50/30 shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:bg-white shadow-sm focus-within:shadow-md'}
            `}
          >
            <div className="flex items-center w-full gap-2 pr-2">
              <div className="pl-4 shrink-0 text-primary-400">
                <Sparkles className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                placeholder="Ask anything about your data…  e.g. What drove churn last month?"
                className="flex-1 bg-transparent border-none text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 py-4 pr-2"
                disabled={aiLoading}
              />

              <button
                type="submit"
                disabled={!selectedQuestion.trim() || aiLoading}
                className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  selectedQuestion.trim() && !aiLoading
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {aiLoading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Zap className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Animated bottom border when loading */}
            {aiLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden rounded-b-xl">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ animation: 'progress-bar 1.5s ease-in-out infinite', width: '60%' }}
                />
              </div>
            )}
          </form>

          {!aiLoading && !response && !aiError && (
            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-6 tracking-tight">
                What would you like to know about your data?
              </h3>
              <SuggestedQuestions onSelect={handleAISubmit} />
            </div>
          )}

          {/* AI response / error / loading skeleton */}
          {(aiLoading || response || aiError) && (
            <div className="mt-5">
              {aiLoading ? (
                <div className="border border-slate-200 rounded-xl p-5 bg-white/70 flex flex-col gap-3 shadow-sm">
                  <Shimmer className="h-3.5 w-1/4" />
                  <Shimmer className="h-3.5 w-full" />
                  <Shimmer className="h-3.5 w-4/5" />
                  <Shimmer className="h-3.5 w-3/5" />
                </div>
              ) : (
                <AIResponseCard
                  question={selectedQuestion}
                  answer={response}
                  error={aiError}
                  timestamp={new Date()}
                  latency={latencyMs}
                  isTyping={aiLoading}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══ ROW 3 — Revenue + Signups charts ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Revenue Area Chart */}
        <ChartCard
          title="Revenue Growth"
          subtitle="Monthly recurring revenue trend"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CHART_COLORS.primary} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="month"
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: CHART_COLORS.primary, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Signups Bar Chart */}
        <ChartCard
          title="Daily Signups"
          subtitle={`Last ${timeRange === 'all' ? '90' : timeRange.replace('d', '')} days`}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={signupData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
              <Bar
                dataKey="signups"
                name="Signups"
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </section>

      {/* ═══ ROW 4 — Acquisition pie + Top users table ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Acquisition channels donut */}
        <ChartCard
          title="Acquisition Channels"
          subtitle="Where your users come from"
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="44%"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {channelData?.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend content={<CustomPieLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top users */}
        <div className="flex flex-col min-h-0">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Users</h2>
              <p className="text-xs text-slate-500 mt-0.5">Highest MRR-contributing accounts</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {userData?.length ?? 0} accounts
            </span>
          </div>
          <div className="flex-1">
            <DataTable
              columns={userColumns}
              data={userData ?? []}
              isLoading={loading}
              emptyMessage="No users found"
            />
          </div>
        </div>

      </section>

    </div>
  );
};

export default DashboardPage;
