import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useDashboardData } from '../hooks/useDashboardData';
import { ChartCard } from '../components/dashboard/ChartCard';
import { StatCard } from '../components/dashboard/StatCard';
import { formatCurrency } from '../lib/utils';

const CHART_COLORS = {
  primary:       '#10b981',
  gradientStart: 'rgba(16, 185, 129, 0.22)',
  gradientEnd:   'rgba(16, 185, 129, 0)',
  grid:          '#e2e8f0',
  axis:          '#94a3b8',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3 text-sm min-w-[140px]">
      <p className="font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-800 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-bold">{formatCurrency(entry.value)}</span>
        </p>
      ))}
    </div>
  );
};

export const RevenuePage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { metrics, revenueData, loading } = useDashboardData(timeRange);

  return (
    <div className="space-y-7 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Deep dive into your financial performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          title="Average Revenue Per User"
          value={loading ? '' : formatCurrency((metrics?.mrr ?? 34200) / (metrics?.dau ?? 1847))}
          delta="+2.1%"
          deltaType="up"
          subtext="vs. last month"
          isLoading={loading}
          accentColor="emerald"
        />
      </div>

      <section>
        <ChartCard
          title="Revenue Growth"
          subtitle="Monthly recurring revenue trend"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={revenueData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CHART_COLORS.primary} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'K'} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS.primary} strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: CHART_COLORS.primary, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
};
