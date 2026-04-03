import { useState, useCallback } from 'react';
import { queryGroq } from '../lib/groq';
import { useDataContext } from '../context/DataContext';

// Session-level simple cache for identical questions
const queryCache = new Map();

/**
 * Hook for querying the AI layer (Groq with mock fallback when no API key is set).
 * Tracks loading, response text, error state, and round-trip latency.
 */
export function useAIQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  
  const { fileContent } = useDataContext();

  const execute = useCallback(async (question, dashboardData) => {
    if (!question || !question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setLatencyMs(null);

    const startTime = performance.now();
    const cacheKey = question.trim().toLowerCase();

    // 1. Session caching
    if (queryCache.has(cacheKey)) {
      const cachedAnswer = queryCache.get(cacheKey);
      setResponse(cachedAnswer);
      setLatencyMs(Math.round(performance.now() - startTime));
      setLoading(false);
      return cachedAnswer;
    }

    try {
      const conciseContext = {
        metrics: dashboardData?.metrics || {},
        revenueData: dashboardData?.revenueData?.slice(-6) || [],
        channelData: dashboardData?.channelData || [],
        topUsersCount: dashboardData?.userData?.length || 0,
        fileContent: fileContent || null,
      };

      let firstChunkReceived = false;

      // 2. Streaming via onChunk callback
      const answer = await queryGroq(question, conciseContext, (chunk, accumulated) => {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setLatencyMs(Math.round(performance.now() - startTime));
          setLoading(false); // Stop main loading indicator once streaming starts
        }
        setResponse(accumulated);
      });

      // Save to session cache
      queryCache.set(cacheKey, answer);

      return answer;
    } catch (err) {
      console.error('AI Query failed:', err);
      setError(err.message || 'Failed to analyze data. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fileContent]);

  return { response, loading, error, latencyMs, execute };
}
