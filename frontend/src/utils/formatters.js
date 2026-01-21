import { format, formatDistance, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format number as currency
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format number as percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';
  
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format large numbers (e.g., 1.5M, 2.3B)
 */
export const formatLargeNumber = (value) => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  
  return value.toFixed(2);
};

/**
 * Format number with commas
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format date to readable string
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

/**
 * Format change value with + or - sign
 */
export const formatChange = (value, isPercentage = false, decimals = 2) => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';
  
  const sign = value >= 0 ? '+' : '';
  const formatted = isPercentage 
    ? formatPercentage(value, decimals) 
    : formatNumber(value, decimals);
  
  return `${sign}${formatted}`;
};

/**
 * Get color class based on value (positive = green, negative = red)
 */
export const getChangeColor = (value) => {
  if (value === null || value === undefined || value === 'N/A') return 'text-muted-foreground';
  return value >= 0 ? 'text-success' : 'text-danger';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
