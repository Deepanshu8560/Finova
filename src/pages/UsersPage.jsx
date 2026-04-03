import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { DataTable } from '../components/dashboard/DataTable';
import { StatCard } from '../components/dashboard/StatCard';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatNumber } from '../lib/utils';
import { ChartCard } from '../components/dashboard/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const CHART_COLORS = {
  primary: '#10b981',
  grid: '#e2e8f0',
  axis: '#94a3b8',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3 text-sm min-w-[140px]">
      <p className="font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-800 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-bold">{formatNumber(entry.value)}</span>
        </p>
      ))}
    </div>
  );
};

export const UsersPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { metrics, signupData, userData, loading } = useDashboardData(timeRange);

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
      render: (val) => <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(val)}</span>,
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

  return (
    <div className="space-y-7 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Detailed breakdown of your user base</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          value={loading ? '' : `${metrics?.churnRate ?? 3.8}%`}
          delta="-0.4%"
          deltaType="up"
          subtext="lower is better ↓"
          isLoading={loading}
          accentColor="emerald"
        />
        <StatCard
          title="New Signups"
          value={loading ? '' : formatNumber(metrics?.newSignups ?? 284)}
          delta="+14.2%"
          deltaType="up"
          subtext="vs. previous period"
          isLoading={loading}
          accentColor="emerald"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <ChartCard title="Daily Signups" subtitle={`Last ${timeRange === 'all' ? '90' : timeRange.replace('d', '')} days`} timeRange={timeRange} onTimeRangeChange={setTimeRange} isLoading={loading}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={signupData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis dataKey="date" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} minTickGap={40} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
                <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
                <Bar dataKey="signups" name="Signups" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">All Top Users</h2>
              <p className="text-xs text-slate-500 mt-0.5">Highest MRR-contributing accounts</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">{userData?.length ?? 0} accounts</span>
          </div>
          <div className="flex-1">
            <DataTable columns={userColumns} data={userData ?? []} isLoading={loading} emptyMessage="No users found" />
          </div>
        </div>
      </section>
    </div>
  );
};
