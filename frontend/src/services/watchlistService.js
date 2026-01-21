import api from './api';

export const watchlistService = {
  // Get all watchlists
  async getWatchlists() {
    return api.get('/watchlists');
  },

  // Create watchlist
  async createWatchlist(name, stocks = [], isDefault = false) {
    return api.post('/watchlists', {
      name,
      stocks,
      isDefault,
    });
  },

  // Get single watchlist
  async getWatchlist(id) {
    return api.get(`/watchlists/${id}`);
  },

  // Update watchlist
  async updateWatchlist(id, data) {
    return api.put(`/watchlists/${id}`, data);
  },

  // Delete watchlist
  async deleteWatchlist(id) {
    return api.delete(`/watchlists/${id}`);
  },

  // Add stock to watchlist
  async addStock(watchlistId, ticker, notes = '') {
    return api.post(`/watchlists/${watchlistId}/stocks`, {
      ticker,
      notes,
    });
  },

  // Remove stock from watchlist
  async removeStock(watchlistId, ticker) {
    return api.delete(`/watchlists/${watchlistId}/stocks/${ticker}`);
  },

  // Get watchlist with stock data
  async getWatchlistWithData(id) {
    return api.get(`/watchlists/${id}/data`);
  },
};
