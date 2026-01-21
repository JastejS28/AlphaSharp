import api from './api';

export const stockService = {
  // Get stock analysis
  async getStockAnalysis(ticker) {
    return api.get(`/stocks/${ticker}/analysis`);
  },

  // Get stock news
  async getStockNews(ticker, maxNews = 5) {
    return api.get(`/stocks/${ticker}/news`, {
      params: { max_news: maxNews },
    });
  },

  // Get historical prices
  async getHistoricalPrices(ticker, period = '3mo') {
    return api.get(`/yahoo/historical/${ticker}`, {
      params: { period },
    });
  },

  // Search ticker
  async searchTicker(query) {
    return api.get('/stocks/search', {
      params: { q: query },
    });
  },

  // Alias for searchTicker
  async searchStock(query) {
    return this.searchTicker(query);
  },

  // Get search history (requires auth)
  async getSearchHistory(limit = 10) {
    return api.get('/stocks/history', {
      params: { limit },
    });
  },
};
