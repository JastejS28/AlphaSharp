/**
 * Validate ticker symbol format
 */
export const isValidTicker = (ticker) => {
  if (!ticker || typeof ticker !== 'string') return false;
  return /^[A-Z]{1,5}$/.test(ticker.toUpperCase());
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate watchlist name
 */
export const isValidWatchlistName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return name.trim().length >= 1 && name.trim().length <= 50;
};

/**
 * Validate number range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Get validation error message
 */
export const getValidationError = (field, value, rules = {}) => {
  if (rules.required && !isRequired(value)) {
    return `${field} is required`;
  }
  
  if (rules.email && !isValidEmail(value)) {
    return `${field} must be a valid email`;
  }
  
  if (rules.ticker && !isValidTicker(value)) {
    return `${field} must be a valid ticker (1-5 uppercase letters)`;
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `${field} must be at least ${rules.minLength} characters`;
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${field} must be at most ${rules.maxLength} characters`;
  }
  
  if (rules.min !== undefined && Number(value) < rules.min) {
    return `${field} must be at least ${rules.min}`;
  }
  
  if (rules.max !== undefined && Number(value) > rules.max) {
    return `${field} must be at most ${rules.max}`;
  }
  
  return null;
};
