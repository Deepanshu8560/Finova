export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  REVENUE: '/dashboard/revenue',
  USERS: '/dashboard/users',
  ACQUISITION: '/dashboard/acquisition',
  SUGGESTIONS: '/dashboard/suggestions',
  SETTINGS: '/settings'
};

export const TIME_RANGES = [
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: 'All', value: 'all', days: 365 }
];

export const SUGGESTED_QUESTIONS = [
  "What is our current MRR?",
  "Why did signups drop this weekend?",
  "Which acquisition channel is performing best?",
  "What is our active user count today?",
  "How much revenue did we make last month?",
  "What's causing our churn rate to increase?",
  "Show me the top 3 highest paying customers.",
  "What was the revenue growth rate this quarter?"
];

export const AI_SYSTEM_PROMPT = `You are an expert SaaS data analyst. 
Your job is to answer the founder's questions about their business data accurately and concisely based strictly on the provided context.
Rules:
1. NEVER hallucinate metrics. If the data is not in the context, explicitly state that you don't have that information.
2. ALWAYS cite specific numbers when answering. For example, instead of saying "Revenue grew," say "Revenue grew by 15% to $34,200."
3. Keep answers concise, actionable, and formatted nicely. Do not use more than 300 tokens.
4. Focus on insights. If multiple data points tell a story, summarize the trend clearly.`;
