import axios from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

// Create axios instance for Python API
const pythonApiClient = axios.create({
  baseURL: config.pythonApi.url,
  timeout: config.pythonApi.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track API status
let apiStatus = {
  isWarm: false,
  lastChecked: null,
  consecutiveFailures: 0,
};

// Request interceptor
pythonApiClient.interceptors.request.use(
  (config) => {
    logger.debug(`Python API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error(`Python API Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Response interceptor
pythonApiClient.interceptors.response.use(
  (response) => {
    // API responded successfully - mark as warm
    if (!apiStatus.isWarm) {
      logger.info('✅ Python API is now warm');
      apiStatus.isWarm = true;
      apiStatus.consecutiveFailures = 0;
    }
    apiStatus.lastChecked = new Date();
    
    logger.debug(`Python API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    apiStatus.consecutiveFailures++;
    
    if (error.code === 'ECONNABORTED') {
      logger.warn(`Python API Timeout: ${error.config.url}`);
    } else if (error.response) {
      logger.error(`Python API Error: ${error.response.status} ${error.response.data?.detail || ''}`);
    } else {
      logger.error(`Python API Network Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// Service methods
export const pythonApiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await pythonApiClient.get('/');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get stock analysis
  async getStockAnalysis(ticker) {
    try {
      const response = await pythonApiClient.get(`/api/stock/${ticker}/analysis`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get stock news
  async getStockNews(ticker, maxNews = 5) {
    try {
      const response = await pythonApiClient.get(`/api/stock/${ticker}/news`, {
        params: { max_items: maxNews },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get market condition
  async getMarketCondition() {
    try {
      const response = await pythonApiClient.get('/api/market/condition');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get regime forecast
  async getRegimeForecast(days = 60, simulations = 2000, includePaths = false) {
    try {
      const response = await pythonApiClient.get('/api/market/forecast', {
        params: { days, simulations, include_paths: includePaths },
        timeout: 120000, // 2 minutes for Monte Carlo simulation
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get short-term prediction
  async getShortTermPrediction(days = 5) {
    try {
      const response = await pythonApiClient.get('/api/market/forecast/short-term', {
        params: { days },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get all regimes
  async getAllRegimes() {
    try {
      const response = await pythonApiClient.get('/api/market/regimes');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get regime history
  async getRegimeHistory(daysBack = 60) {
    try {
      const response = await pythonApiClient.get('/api/market/history', {
        params: { days: daysBack },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Query AI agent
  async queryAgent(query, threadId = 'default_thread') {
    try {
      const response = await pythonApiClient.post('/api/agent/query', {
        query,
        thread_id: threadId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Search ticker
  async searchTicker(query) {
    try {
      const response = await pythonApiClient.get('/api/search', {
        params: { q: query },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get historical stock prices from Yahoo Finance
  async getHistoricalPrices(ticker, period = '3mo', interval = '1d') {
    try {
      const response = await pythonApiClient.get(`/api/stock/${ticker}/history`, {
        params: { period, interval },
        timeout: 30000,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  // Get API status
  getStatus() {
    return {
      ...apiStatus,
      timeSinceLastCheck: apiStatus.lastChecked 
        ? Date.now() - apiStatus.lastChecked.getTime() 
        : null,
    };
  },
};

export default pythonApiService;
