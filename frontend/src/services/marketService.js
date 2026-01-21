import api from './api';

export const marketService = {
  // Get current market condition (regime)
  async getMarketCondition() {
    return api.get('/market/condition');
  },

  // Get regime forecast
  async getRegimeForecast(days = 60, simulations = 2000, includePaths = false) {
    return api.get('/market/forecast', {
      params: {
        days,
        simulations,
        include_paths: includePaths,
      },
    });
  },

  // Get short-term prediction
  async getShortTermPrediction(days = 5) {
    return api.get('/market/forecast/short-term', {
      params: { days },
    });
  },

  // Get all regimes info
  async getAllRegimes() {
    return api.get('/market/regimes');
  },

  // Get regime history
  async getRegimeHistory(daysBack = 60) {
    return api.get('/market/history', {
      params: { days: daysBack },
    });
  },

  // Get API status
  async getApiStatus() {
    return api.get('/market/status');
  },

  // Clear market cache
  async clearCache() {
    return api.delete('/market/cache/clear');
  },
};
