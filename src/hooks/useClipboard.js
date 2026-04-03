import { useState, useCallback } from 'react';

/**
 * Reusable hook for wrapping the Clipboard API.
 * 
 * @param {number} [timeout=2000] - Duration in ms before copied state resets
 * @returns {{ copied: boolean, copy: Function, error: Error|null }}
 */
export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    if (!navigator.clipboard) {
      setError(new Error('Clipboard API not supported'));
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      setError(err);
      setCopied(false);
      return false;
    }
  }, [timeout]);

  return { copied, copy, error };
};

export default useClipboard;
