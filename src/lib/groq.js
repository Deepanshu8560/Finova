/**
 * Groq API client using OpenAI-compatible SDK.
 * Falls back to mock responses when API key is not configured.
 * @module lib/groq
 */
import OpenAI from 'openai';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/** Whether the Groq API is configured with a real key */
export const isGroqConfigured = Boolean(GROQ_API_KEY);

let client = null;

if (isGroqConfigured) {
  client = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    dangerouslyAllowBrowser: true,
  });
}

/**
 * System prompt that defines InsightAI's analyst persona.
 * Enforces concise, data-referenced answers.
 */
const SYSTEM_PROMPT = `You are InsightAI, a concise and expert data analyst for a startup SaaS dashboard. Your role:

1. Answer questions about the user's business data in 2-4 sentences maximum.
2. Always reference specific numbers, percentages, or trends from the provided data context.
3. If the question is unclear, ask exactly one clarifying question.
4. Never say "As an AI" or similar. Respond as a human data analyst would.
5. Use plain language — your audience is a non-technical startup founder.
6. When discussing trends, compare to the previous period when possible.
7. Format numbers with proper separators (e.g., $12,345 not 12345).`;


const SUGGESTION_PROMPT = `You are a Fractional Chief Revenue Officer (CRO) for a SaaS startup.
Your role is to analyze the provided dashboard and CSV data to outline concrete ways to improve the business.
Format your response exactly as 4 distinct sections separated by double newlines. The 4 sections MUST be:
## Business Insights
## Customer Conversion Strategies
## Ad Spend Efficiency
## Cost Reduction

For the content UNDER each heading, you MUST output ONLY 3-4 bullet points. Each bullet point must start with a "-" character. Do NOT output large paragraphs. Do NOT include any greetings or fluff. Heavily reference actual numbers from the provided CSV data.`;

/**
 * Sends a query to the Groq API with dashboard data context, streaming the response.
 * @param {string} question - The user's plain English question
 * @param {object} dataContext - Current dashboard metrics and data
 * @param {function} [onChunk] - Callback for each stream chunk received
 * @returns {Promise<string>} The full AI analyst's response
 */
export async function queryGroq(question, dataContext, onChunk) {
  if (!isGroqConfigured) {
    return getMockResponse(question, dataContext, onChunk);
  }

  try {
    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: dataContext?.fileContent 
            ? `Here is the current dashboard data context:\n${JSON.stringify({ ...dataContext, fileContent: undefined }, null, 2)}\n\nThe user also uploaded custom custom data. YOU MUST PRIORITIZE THIS UPLOADED DATA TO ANSWER THEIR QUESTION:\n\n"""\n${dataContext.fileContent.slice(0, 12000)}\n"""\n\nQuestion: ${question}`
            : `Here is the current dashboard data context:\n${JSON.stringify(dataContext, null, 2)}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        if (onChunk) onChunk(content, fullResponse);
      }
    }
    return fullResponse;
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to get AI response: ${error.message || 'Please check your API key.'}`);
  }
}

/**
 * Returns realistic mock responses with simulated streaming when the Groq API is not configured.
 * @param {string} question - The user's question
 * @param {object} dataContext - Dashboard data for reference
 * @param {function} [onChunk] - Callback to simulate streaming
 * @returns {Promise<string>} Mock analyst response
 */
async function getMockResponse(question, dataContext, onChunk) {
  // Simulate initial network latency before stream starts (Time to First Token)
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

  const metrics = dataContext?.metrics || {};
  const questionLower = question.toLowerCase();
  
  let fullAnswer = '';

  if (dataContext?.fileContent) {
    fullAnswer = `I see you've uploaded a custom data file! While I am currently running in offline mock mode (no Groq API key set), I can confirm I see your file spanning roughly ${dataContext.fileContent.split('\\n').length} lines. To get deep analytical answers directly referencing this CSV data, please add your \`VITE_GROQ_API_KEY\` in the environment variables.`;
  } else if (questionLower.includes('revenue') || questionLower.includes('money') || questionLower.includes('earnings')) {
    fullAnswer = `Your total revenue is currently $${(metrics.totalRevenue || 48250).toLocaleString()}, which is up ${metrics.revenueGrowth || 12.5}% compared to the previous period. The strongest revenue day this month was last Tuesday with $2,847 in transactions. At this growth rate, you're on track to hit $58K by end of quarter.`;
  } else if (questionLower.includes('user') || questionLower.includes('signup') || questionLower.includes('growth')) {
    fullAnswer = `You have ${(metrics.activeUsers || 1247).toLocaleString()} active users, with ${metrics.newSignups || 184} new signups in the current period — that's a ${metrics.userGrowth || 8.3}% increase. Most new users are coming from organic search (42%) and direct referrals (28%). Your 7-day retention rate is holding steady at 67%.`;
  } else if (questionLower.includes('churn') || questionLower.includes('retention') || questionLower.includes('leaving')) {
    fullAnswer = `Your current churn rate is ${metrics.churnRate || 3.2}%, which is ${metrics.churnRate < 5 ? 'below' : 'above'} the SaaS industry average of 5-7%. That means you lost roughly ${Math.round((metrics.activeUsers || 1247) * (metrics.churnRate || 3.2) / 100)} users this period. The primary churn segment appears to be users who haven't engaged with the product in the first 48 hours.`;
  } else if (questionLower.includes('acquisition') || questionLower.includes('channel') || questionLower.includes('source')) {
    fullAnswer = `Your best acquisition channel is organic search, driving 42% of new signups at a cost of $0 per user. Paid social (Instagram/LinkedIn) accounts for 23% but at $4.20 CPA. Direct referrals are your most efficient channel with a 34% conversion rate compared to 12% for paid traffic.`;
  } else if (questionLower.includes('best') || questionLower.includes('top') || questionLower.includes('most')) {
    fullAnswer = `Your top-performing metric this period is new user signups, up ${metrics.userGrowth || 8.3}% week-over-week. Revenue per user increased to $${((metrics.totalRevenue || 48250) / (metrics.activeUsers || 1247)).toFixed(2)}, and your best day for conversions was Thursday with 47 new signups.`;
  } else if (questionLower.includes('trend') || questionLower.includes('direction') || questionLower.includes('going')) {
    fullAnswer = `Overall, your key metrics are trending positively. Revenue is up ${metrics.revenueGrowth || 12.5}%, active users grew ${metrics.userGrowth || 8.3}%, and churn decreased from 4.1% to ${metrics.churnRate || 3.2}%. The one area to watch is your trial-to-paid conversion rate, which dipped slightly from 18% to 16.5% this period.`;
  } else {
    // Default response
    fullAnswer = `Based on your current data, here's what stands out: you have ${(metrics.activeUsers || 1247).toLocaleString()} active users generating $${(metrics.totalRevenue || 48250).toLocaleString()} in revenue, with a healthy growth rate of ${metrics.revenueGrowth || 12.5}%. Your churn rate of ${metrics.churnRate || 3.2}% is well below the industry average. Want me to drill into any specific metric?`;
  }

  if (onChunk) {
    // Break the text into rough chunks and simulate fast token arrival
    const words = fullAnswer.split(/(?<=\s)/); // Split keeping the spaces
    let accumulated = '';
    
    for (const word of words) {
      accumulated += word;
      onChunk(word, accumulated);
      // Faster typing simulation for tokens
      await new Promise(r => setTimeout(r, 10 + Math.random() * 20));
    }
  }

  return fullAnswer;
}

/**
 * Custom query for generating Business Suggestions based on uploaded context.
 * @param {object} dataContext - Current dashboard / CSV data
 * @param {function} [onChunk] - Callback for each stream chunk received
 */
export async function querySuggestions(dataContext, onChunk) {
  if (!isGroqConfigured) {
    // Mock response for testing without API keys
    const mockRes = `**1. Business Insights:** Your current data indicates strong top-of-funnel acquisition, specifically from organic channels, but reveals a critical bottleneck during the user activation phase where MRR growth slows down.
    
**2. Customer Conversion Strategies:** Based on the ${dataContext?.fileContent ? 'uploaded data file' : 'dashboard metrics'}, your friction point is post-signup onboarding. Implementing a progressive profile completion step could boost your MQL conversion by 12% instantly based on standard B2B baselines.
    
**3. Ad Spend Efficiency:** Your CPA on LinkedIn is currently $14.50. Re-allocating 30% of this budget into highly targeted Twitter/X threads could reduce your blended CPA down to $9.20 while maintaining volume.
    
**4. Cost Reduction:** The data suggests heavy AWS usage during off-peak hours. Shifting background data processing to Spot Instances around 2am EST can shave off nearly 18% of your monthly server expenditures with zero user-facing latency.`;
    
    if (onChunk) {
      const words = mockRes.split(' ');
      let accumulated = '';
      for (const word of words) {
        accumulated += word + ' ';
        onChunk(word, accumulated);
        await new Promise(r => setTimeout(r, 10));
      }
    }
    return mockRes;
  }

  try {
    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SUGGESTION_PROMPT },
        {
          role: 'user',
          content: dataContext?.fileContent 
            ? `Here is the current dashboard numbers:\n${JSON.stringify({ ...dataContext, fileContent: undefined }, null, 2)}\n\nThe user also specifically uploaded this raw CSV data. YOU MUST READ THIS AND EXTRACT STRATEGIES FROM IT:\n"""\n${dataContext.fileContent.slice(0, 12000)}\n"""`
            : `Analyze this dashboard data and provide the 4-point improvement strategy:\n${JSON.stringify(dataContext, null, 2)}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        if (onChunk) onChunk(content, fullResponse);
      }
    }
    return fullResponse;
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to generate suggestions: ${error.message || 'Please check your API key.'}`);
  }
}
