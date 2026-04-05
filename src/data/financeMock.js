/**
 * Finance Mock Data Generator
 * Produces 180+ transactions for 6 months across 7 categories.
 */

const CATEGORIES = {
  INCOME:  ['Salary', 'Dividend', 'Freelance'],
  EXPENSE: ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health']
};

const MERCHANTS = {
  'Housing':       ['Apartment Rent', 'Mortgage Payment'],
  'Food':          ['Whole Foods', 'Corner Cafe', 'Uber Eats', 'Blue Bottle Coffee', 'Local Bistro'],
  'Transport':     ['Shell Gas', 'Uber', 'Metrolink', 'Tesla Supercharger'],
  'Entertainment': ['Netflix', 'Spotify', 'AMC Theatres', 'Steam Games', 'City Zoo'],
  'Shopping':      ['Amazon', 'Target', 'Apple Store', 'Zara', 'Best Buy'],
  'Utilities':     ['Cloud Water Co', 'Electric Grid', 'City Waste', 'Verizon Wireless'],
  'Health':        ['Pharmacy', 'City Hospital', 'Yoga Studio', 'Dental Care'],
  'Salary':        ['Finova Corp', 'Client Payment'],
  'Dividend':      ['Vanguard Funds'],
  'Freelance':     ['Fiverr Payout', 'Upwork Inc']
};

export const generateFinanceMock = () => {
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 185; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 1. Monthly Salary (fixed days)
    if (date.getDate() === 1 || date.getDate() === 15) {
      transactions.push({
        id: `m_${i}_sal`,
        date: dateStr,
        merchant: 'Finova Corp',
        category: 'Salary',
        type: 'income',
        amount: 2500
      });
    }

    // 2. Random Daily Expenses
    const numExpenses = Math.floor(Math.random() * 3) + 1; // 1 to 3 expenses per day
    for (let j = 0; j < numExpenses; j++) {
      const category = CATEGORIES.EXPENSE[Math.floor(Math.random() * CATEGORIES.EXPENSE.length)];
      const merchants = MERCHANTS[category];
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      
      // Weighting logic for amounts
      let amount = 0;
      if (category === 'Housing' && (date.getDate() === 1)) {
        amount = 1200 + Math.random() * 200;
      } else if (category === 'Housing') {
         continue; // Only once a month
      } else if (category === 'Utilities' && (date.getDate() === 10)) {
        amount = 50 + Math.random() * 80;
      } else if (category === 'Utilities') {
        continue; // Only once a month
      } else {
        amount = 5 + Math.random() * 80; // General small expenses
      }

      if (amount > 0) {
        transactions.push({
          id: `e_${i}_${j}`,
          date: dateStr,
          merchant,
          category,
          type: 'expense',
          amount: parseFloat(amount.toFixed(2))
        });
      }
    }

    // 3. Occasional Freelance / Dividends
    if (Math.random() > 0.95) {
      const cat = Math.random() > 0.5 ? 'Freelance' : 'Dividend';
      const m = MERCHANTS[cat][0];
      transactions.push({
        id: `i_${i}_misc`,
        date: dateStr,
        merchant: m,
        category: cat,
        type: 'income',
        amount: Math.random() > 0.5 ? 450 : 120
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const financeMockData = generateFinanceMock();
