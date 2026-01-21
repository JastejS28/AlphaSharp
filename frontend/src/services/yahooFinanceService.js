import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class YahooFinanceService {
  async getQuote(ticker) {
    try {
      const response = await axios.get(`${API_BASE_URL}/yahoo/quote/${ticker}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get quote for ${ticker}:`, error);
      throw error;
    }
  }

  async getQuotes(tickers) {
    try {
      const promises = tickers.map(ticker => this.getQuote(ticker));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => ({
        ticker: tickers[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    } catch (error) {
      console.error('Failed to get quotes:', error);
      throw error;
    }
  }
}

export default new YahooFinanceService();
