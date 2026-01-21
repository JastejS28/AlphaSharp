export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AlphaSharp';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ENABLE_ANIMATIONS = import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false';
export const ENABLE_KEEP_ALIVE_PING = import.meta.env.VITE_ENABLE_KEEP_ALIVE_PING !== 'false';

// Cache durations (in milliseconds)
export const CACHE_TIMES = {
  STOCK_ANALYSIS: 5 * 60 * 1000, // 5 minutes
  MARKET_NEWS: 10 * 60 * 1000, // 10 minutes
  MARKET_REGIME: 60 * 60 * 1000, // 1 hour
  FORECAST: 60 * 60 * 1000, // 1 hour
  SEARCH_RESULTS: 5 * 60 * 1000, // 5 minutes
};

// API timeouts
export const API_TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  COLD_START: 60000, // 60 seconds (for first request when API is cold)
};

// Cold start detection
export const COLD_START_THRESHOLD = 50000; // 50 seconds

// Regime colors mapping
export const REGIME_COLORS = {
  0: { bg: '#10b981', text: '#ffffff', name: 'Strong Bull' },
  1: { bg: '#34d399', text: '#ffffff', name: 'Bull Market' },
  2: { bg: '#6ee7b7', text: '#000000', name: 'Mild Bull' },
  3: { bg: '#60a5fa', text: '#ffffff', name: 'Recovery' },
  4: { bg: '#94a3b8', text: '#ffffff', name: 'Sideways' },
  5: { bg: '#fb923c', text: '#ffffff', name: 'High Volatility' },
  6: { bg: '#f59e0b', text: '#ffffff', name: 'Correction' },
  7: { bg: '#ef4444', text: '#ffffff', name: 'Bear Market' },
  8: { bg: '#dc2626', text: '#ffffff', name: 'Crisis' },
};

// Chart.js default configuration
export const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: ENABLE_ANIMATIONS ? { duration: 300 } : false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// Toast configuration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
};

// Watchlist limits
export const MAX_WATCHLIST_NAME_LENGTH = 50;
export const MAX_STOCKS_PER_WATCHLIST = 50;
export const MAX_STOCK_NOTES_LENGTH = 200;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 1;
export const MAX_SEARCH_RESULTS = 10;

// Forecast parameters
export const FORECAST_DEFAULTS = {
  DAYS: 60,
  SIMULATIONS: 2000,
  INCLUDE_PATHS: false,
};

export const SHORT_TERM_FORECAST_DEFAULTS = {
  DAYS: 5,
};

// Keep-alive ping interval (in milliseconds)
export const KEEP_ALIVE_INTERVAL = 13 * 60 * 1000; // 13 minutes

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LAST_VISITED_TICKER: 'last_visited_ticker',
  RECENT_SEARCHES: 'recent_searches',
};
