/**
 * Mock dashboard metrics for each time range.
 * Used by useDashboardData hook when real data sources aren't connected.
 * @module data/mockMetrics
 */

export const mockMetrics = {
  '7d': {
    totalRevenue: 12480,
    revenueGrowth: 8.2,
    activeUsers: 1247,
    userGrowth: 4.1,
    newSignups: 84,
    signupGrowth: 12.7,
    churnRate: 2.8,
    churnDelta: -0.4,
    mrr: 42500,
    mrrGrowth: 6.3,
    avgSessionDuration: '4m 32s',
    conversionRate: 18.2,
  },
  '30d': {
    totalRevenue: 48250,
    revenueGrowth: 12.5,
    activeUsers: 1247,
    userGrowth: 8.3,
    newSignups: 184,
    signupGrowth: 15.2,
    churnRate: 3.2,
    churnDelta: -0.9,
    mrr: 42500,
    mrrGrowth: 9.1,
    avgSessionDuration: '4m 18s',
    conversionRate: 16.5,
  },
  '90d': {
    totalRevenue: 138700,
    revenueGrowth: 22.1,
    activeUsers: 1247,
    userGrowth: 18.6,
    newSignups: 492,
    signupGrowth: 24.3,
    churnRate: 3.8,
    churnDelta: -1.2,
    mrr: 42500,
    mrrGrowth: 15.7,
    avgSessionDuration: '3m 56s',
    conversionRate: 17.8,
  },
  all: {
    totalRevenue: 284500,
    revenueGrowth: 34.8,
    activeUsers: 1247,
    userGrowth: 42.3,
    newSignups: 1247,
    signupGrowth: 38.6,
    churnRate: 4.1,
    churnDelta: -2.3,
    mrr: 42500,
    mrrGrowth: 28.4,
    avgSessionDuration: '3m 42s',
    conversionRate: 19.1,
  },
};

/** Recent transactions / events for the data table */
export const mockTableData = [
  { id: 1, event: 'New subscription', user: 'sarah.chen@startup.io', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 12) },
  { id: 2, event: 'Upgrade', user: 'mike.johnson@acme.co', plan: 'Enterprise', amount: 199, date: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 3, event: 'New subscription', user: 'anna.petrov@venture.vc', plan: 'Starter', amount: 19, date: new Date(Date.now() - 1000 * 60 * 90) },
  { id: 4, event: 'Cancellation', user: 'tom.baker@legacy.com', plan: 'Pro', amount: -49, date: new Date(Date.now() - 1000 * 60 * 180) },
  { id: 5, event: 'New subscription', user: 'lisa.wang@growth.io', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 240) },
  { id: 6, event: 'Upgrade', user: 'ravi.patel@fintech.dev', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 360) },
  { id: 7, event: 'New subscription', user: 'emma.davis@creative.co', plan: 'Starter', amount: 19, date: new Date(Date.now() - 1000 * 60 * 480) },
  { id: 8, event: 'Upgrade', user: 'james.lee@data.ai', plan: 'Enterprise', amount: 199, date: new Date(Date.now() - 1000 * 60 * 600) },
  { id: 9, event: 'New subscription', user: 'sofia.garcia@ecom.shop', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 720) },
  { id: 10, event: 'Cancellation', user: 'john.smith@old.co', plan: 'Starter', amount: -19, date: new Date(Date.now() - 1000 * 60 * 840) },
  { id: 11, event: 'New subscription', user: 'priya.sharma@cloud.dev', plan: 'Enterprise', amount: 199, date: new Date(Date.now() - 1000 * 60 * 960) },
  { id: 12, event: 'Upgrade', user: 'alex.turner@scale.up', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 1080) },
  { id: 13, event: 'New subscription', user: 'nina.kowalski@market.ly', plan: 'Starter', amount: 19, date: new Date(Date.now() - 1000 * 60 * 1200) },
  { id: 14, event: 'Upgrade', user: 'david.brown@saas.tools', plan: 'Enterprise', amount: 199, date: new Date(Date.now() - 1000 * 60 * 1320) },
  { id: 15, event: 'New subscription', user: 'claire.martin@ops.run', plan: 'Pro', amount: 49, date: new Date(Date.now() - 1000 * 60 * 1440) },
];
