import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/alphasharp',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Python API
  pythonApi: {
    url: process.env.PYTHON_API_URL || 'https://finance-v1-kyu7.onrender.com',
    timeout: parseInt(process.env.PYTHON_API_TIMEOUT) || 60000,
  },
  
  // Cache TTL (in seconds)
  cache: {
    stockAnalysisTtl: parseInt(process.env.CACHE_STOCK_ANALYSIS_TTL) || 300,
    marketNewsTtl: parseInt(process.env.CACHE_MARKET_NEWS_TTL) || 600,
    marketRegimeTtl: parseInt(process.env.CACHE_MARKET_REGIME_TTL) || 3600,
    forecastTtl: parseInt(process.env.CACHE_FORECAST_TTL) || 3600,
  },
  
  // Keep-Alive
  keepAlive: {
    enabled: process.env.ENABLE_KEEP_ALIVE === 'true',
    intervalMinutes: parseInt(process.env.KEEP_ALIVE_INTERVAL) || 13,
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  },
};
