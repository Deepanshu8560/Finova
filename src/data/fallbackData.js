/**
 * Generates 180 days (6 months) of mock startup metrics.
 * Each entry includes date, revenue (MRR), signups, channel, and customer info.
 */
function generateFallbackData() {
  const data = [];
  const channels = ['Direct', 'Social Media', 'Referral', 'Organic Search', 'Paid Search', 'Podcast'];
  const plans = ['Basic', 'Pro', 'Enterprise'];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 179); // Start 179 days ago for a total of 180

  let currentRevenue = 28000;

  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    // Trends: generally upward MRR, random spikes in signups
    const revenueChange = (Math.random() * 200) - 50; 
    currentRevenue += revenueChange;
    
    const baseSignups = 5 + Math.floor(Math.random() * 10);
    const isSpecialDay = i % 14 === 0; // Every 2 weeks a Marketing boost
    const signups = isSpecialDay ? baseSignups + 15 : baseSignups;

    const channel = channels[Math.floor(Math.random() * channels.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    data.push({
      date: dateString,
      revenue: Math.round(currentRevenue),
      signups: signups,
      channel: channel,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      plan: plans[Math.floor(Math.random() * plans.length)],
    });
  }

  return data;
}

export const fallbackData = generateFallbackData();
