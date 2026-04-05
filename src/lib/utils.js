/**
 * Utility functions for formatting and class name merging.
 * @module lib/utils
 */

/**
 * Merges class names, filtering out falsy values.
 * @param {...(string|boolean|undefined|null)} classes - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number as USD currency.
 * @param {number} num - The number to format
 * @returns {string} Formatted currency string (e.g., "$12,345")
 */
export function formatCurrency(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Formats a number as a percentage with sign.
 * @param {number} num - The percentage value
 * @returns {string} Formatted percentage string (e.g., "+12.5%")
 */
export function formatPercent(num) {
  if (num === null || num === undefined) return '0%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

/**
 * Formats a large number with abbreviations.
 * @param {number} num - The number to format
 * @returns {string} Formatted number string (e.g., "2.4K")
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString('en-US');
}

/**
 * Formats a date as a relative time string.
 * @param {Date|string|number} date - The date to format
 * @returns {string} Relative time string (e.g., "2 min ago")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats a date as a short timestamp.
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted timestamp (e.g., "Mar 15, 2:30 PM")
 */
export function formatTimestamp(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Generates initials from a name.
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
