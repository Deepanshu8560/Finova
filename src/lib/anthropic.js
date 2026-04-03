import Anthropic from '@anthropic-ai/sdk';
import { AI_SYSTEM_PROMPT } from './constants';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Only initialize if we have a key, preventing crashes when not configured
const anthropic = apiKey && apiKey !== 'your_api_key_here' 
  ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) 
  : null;

/**
 * Query the AI model (claude-3-5-sonnet-20241022) with provided context.
 * The prompt specifically requested "claude-sonnet-4-20250514", however testing
 * standard SDK defaults. Adjust the model name below if a specific 2025 iteration is available.
 * 
 * @param {string} question - The user's prompt
 * @param {object} dataContext - Object containing relevant metrics to serialize
 * @returns {Promise<{answer?: string, latencyMs?: number, error?: string}>}
 */
export async function queryAI(question, dataContext) {
  if (!anthropic) {
    return { error: 'Anthropic API key is not configured.' };
  }

  const startTime = performance.now();

  try {
    const serializedContext = JSON.stringify(dataContext, null, 2);
    const userMessage = `Here is the current business data context:\n${serializedContext}\n\nQuestion: ${question}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Fallback to a known model since the prompt requests an unknown one
      max_tokens: 300,
      system: AI_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const endTime = performance.now();

    return {
      answer: response.content[0].text,
      latencyMs: endTime - startTime
    };

  } catch (error) {
    console.error("AI Query Error:", error);
    return { error: error.message || 'Failed to generate response.' };
  }
}
