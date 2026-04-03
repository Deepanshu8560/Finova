import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { ChartCard } from '../components/dashboard/ChartCard';
import { StatCard } from '../components/dashboard/StatCard';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../lib/utils';

const PIE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3 text-sm min-w-[140px]">
      <p className="font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">{payload[0].name}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-800 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-bold">{formatNumber(entry.value)}</span>
        </p>
      ))}
    </div>
  );
};

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

export const AcquisitionPage = () => {
  const [timeRange] = useState('30d');
  const { channelData, loading } = useDashboardData(timeRange);

  return (
    <div className="space-y-7 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Acquisition Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Understand where your users are coming from</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Traffic"
          value={loading ? '' : '12,450'}
          delta="+8.2%"
          deltaType="up"
          subtext="vs. previous period"
          isLoading={loading}
          accentColor="emerald"
        />
        <StatCard
          title="Conversion Rate"
          value={loading ? '' : '4.2%'}
          delta="+0.8%"
          deltaType="up"
          subtext="visitor to active user"
          isLoading={loading}
          accentColor="emerald"
        />
        <StatCard
          title="Customer Acquisition Cost (CAC)"
          value={loading ? '' : '$42.50'}
          delta="-5.1%"
          deltaType="up"
          subtext="lower is better ↓"
          isLoading={loading}
          accentColor="emerald"
        />
      </div>

      <section>
        <ChartCard title="Acquisition Channels" subtitle="Where your users come from" isLoading={loading}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="44%"
                    innerRadius={80}
                    outerRadius={130}
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
            </div>
            
            <div className="w-full md:w-1/2 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Channel Breakdown</h3>
              <div className="space-y-4">
                {channelData?.map((channel, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                        {channel.name}
                      </span>
                      <span className="font-bold text-slate-900">{channel.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${channel.value}%`, backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </ChartCard>
      </section>
    </div>
  );
};
