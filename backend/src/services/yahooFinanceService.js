import yahooFinance from 'yahoo-finance2';
import logger from '../utils/logger.js';

export const yahooFinanceService = {
  // Get historical stock data
  async getHistoricalData(ticker, period = '3mo', interval = '1d') {
    try {
      const queryOptions = {
        period1: this.getPeriodStartDate(period),
        period2: new Date(),
        interval: interval,
      };

      logger.debug(`Fetching Yahoo Finance data for ${ticker} - period: ${period}, interval: ${interval}`);
      
      const result = await yahooFinance.chart(ticker, queryOptions);
      
      if (!result || !result.quotes || result.quotes.length === 0) {
        return { success: false, error: 'No historical data available' };
      }

      // Transform to our format
      const historicalData = result.quotes.map(quote => ({
        date: quote.date.toISOString().split('T')[0],
        price: quote.close,
        high: quote.high,
        low: quote.low,
        open: quote.open,
        volume: quote.volume,
      }));

      return {
        success: true,
        data: {
          ticker: ticker.toUpperCase(),
          historical_data: historicalData,
          meta: {
            period,
            interval,
            currency: result.meta?.currency,
            symbol: result.meta?.symbol,
            exchangeName: result.meta?.exchangeName,
          },
        },
      };
    } catch (error) {
      logger.error(`Yahoo Finance error for ${ticker}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Convert period string to date
  getPeriodStartDate(period) {
    const now = new Date();
    const periodMap = {
      '1d': 1,
      '5d': 5,
      '1mo': 30,
      '3mo': 90,
      '6mo': 180,
      '1y': 365,
      '2y': 730,
      '5y': 1825,
      '10y': 3650,
      'ytd': this.getDaysSinceYearStart(),
      'max': 36500, // ~100 years
    };

    const days = periodMap[period] || 90; // default to 3 months
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    return startDate;
  },

  getDaysSinceYearStart() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    return Math.floor((now - yearStart) / (1000 * 60 * 60 * 24));
  },

  // Get current quote
  async getQuote(ticker) {
    try {
      const quote = await yahooFinance.quote(ticker);
      
      return {
        success: true,
        data: {
          ticker: ticker.toUpperCase(),
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          volume: quote.regularMarketVolume,
          marketCap: quote.marketCap,
          fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        },
      };
    } catch (error) {
      logger.error(`Yahoo Finance quote error for ${ticker}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default yahooFinanceService;
