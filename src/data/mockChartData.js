/**
 * Mock time-series chart data shaped for Recharts.
 * Provides revenue, user growth, signups, and acquisition data.
 * @module data/mockChartData
 */

/**
 * Generates revenue time-series data for specified number of days.
 * @param {number} days - Number of data points to generate
 * @returns {Array<{date: string, revenue: number, target: number}>}
 */
function generateRevenueData(days) {
  const data = [];
  const now = new Date();
  const baseRevenue = 1200;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const trendMultiplier = 1 + (days - i) * 0.008;
    const noise = 0.85 + Math.random() * 0.3;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(baseRevenue * weekendMultiplier * trendMultiplier * noise),
      target: Math.round(baseRevenue * trendMultiplier),
    });
  }
  return data;
}

/**
 * Generates user growth time-series data.
 * @param {number} days - Number of data points to generate
 * @returns {Array<{date: string, users: number, newUsers: number}>}
 */
function generateUserData(days) {
  const data = [];
  const now = new Date();
  let totalUsers = 980;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const newUsers = Math.round(5 + Math.random() * 12);
    const churned = Math.round(Math.random() * 3);
    totalUsers += newUsers - churned;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: totalUsers,
      newUsers,
    });
  }
  return data;
}

/**
 * Generates signup source breakdown data.
 * @returns {Array<{source: string, signups: number, conversionRate: number, color: string}>}
 */
function generateAcquisitionData() {
  return [
    { source: 'Organic Search', signups: 523, conversionRate: 14.2, color: '#818cf8' },
    { source: 'Direct', signups: 347, conversionRate: 22.8, color: '#a78bfa' },
    { source: 'Referral', signups: 189, conversionRate: 34.1, color: '#c084fc' },
    { source: 'Paid Social', signups: 142, conversionRate: 8.6, color: '#e879f9' },
    { source: 'Email', signups: 98, conversionRate: 28.4, color: '#f472b6' },
    { source: 'Other', signups: 48, conversionRate: 5.3, color: '#64748b' },
  ];
}

export const mockChartData = {
  '7d': {
    revenue: generateRevenueData(7),
    users: generateUserData(7),
    acquisition: generateAcquisitionData(),
  },
  '30d': {
    revenue: generateRevenueData(30),
    users: generateUserData(30),
    acquisition: generateAcquisitionData(),
  },
  '90d': {
    revenue: generateRevenueData(90),
    users: generateUserData(90),
    acquisition: generateAcquisitionData(),
  },
  all: {
    revenue: generateRevenueData(180),
    users: generateUserData(180),
    acquisition: generateAcquisitionData(),
  },
};
