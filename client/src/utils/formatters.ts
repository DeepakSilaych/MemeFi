/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value Number to format (0.1 = 10%)
 * @param minimumFractionDigits Minimum number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, minimumFractionDigits: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: 2,
    signDisplay: 'always'
  }).format(value);
};

/**
 * Format a number with appropriate decimal places
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a timestamp as a readable date/time string
 * @param timestamp ISO timestamp string or Date object
 * @returns Formatted date/time string
 */
export const formatDateTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

/**
 * Format a large number in a human-readable format (K, M, B)
 * @param value Number to format
 * @returns Formatted string with appropriate suffix
 */
export const formatCompactNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  });
  return formatter.format(value);
};
