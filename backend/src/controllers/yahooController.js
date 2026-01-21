import YahooFinance from 'yahoo-finance2';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// Instantiate YahooFinance
const yahooFinance = new YahooFinance();

export const getQuote = async (req, res) => {
  try {
    const { ticker } = req.params;

    if (!ticker) {
      return errorResponse(res, 'Ticker symbol is required', 400);
    }

    logger.info(`Fetching quote for ${ticker}`);
    
    // Use basic quote method
    const quote = await yahooFinance.quote(ticker.toUpperCase());

    if (!quote) {
      return errorResponse(res, `No data found for ${ticker}`, 404);
    }

    const result = {
      ticker: quote.symbol || ticker.toUpperCase(),
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      high: quote.regularMarketDayHigh || 0,
      low: quote.regularMarketDayLow || 0,
      open: quote.regularMarketOpen || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      name: quote.shortName || quote.longName || ticker,
    };

    return successResponse(res, result, 'Quote retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching quote for ${req.params?.ticker || 'unknown'}: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    return errorResponse(res, 'Failed to fetch quote - Yahoo Finance API error', 500, error.message);
  }
};

export const getMultipleQuotes = async (req, res) => {
  try {
    const { tickers } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return errorResponse(res, 'Tickers array is required', 400);
    }

    logger.info(`Fetching quotes for ${tickers.length} tickers`);

    // Fetch quotes in parallel with error handling
    const promises = tickers.map(async (ticker) => {
      try {
        const quote = await yahooFinance.quote(ticker.toUpperCase());
        
        if (quote) {
          return {
            ticker: quote.symbol || ticker.toUpperCase(),
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            name: quote.shortName || quote.longName || ticker,
          };
        }
        return null;
      } catch (error) {
        logger.error(`Error fetching quote for ${ticker}: ${error.message}`);
        return null;
      }
    });

    const results = (await Promise.all(promises)).filter(r => r !== null);

    return successResponse(res, results, 'Quotes retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching quotes: ${error.message}`);
    return errorResponse(res, 'Failed to fetch quotes', 500, error.message);
  }
};

export const getHistoricalPrices = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '3mo', interval = '1d' } = req.query;

    if (!ticker) {
      return errorResponse(res, 'Ticker symbol is required', 400);
    }

    logger.info(`Fetching historical prices for ${ticker}, period: ${period}, interval: ${interval}`);

    // Convert period to date range
    const periodMap = {
      '1d': 1,
      '5d': 5,
      '1mo': 30,
      '3mo': 90,
      '6mo': 180,
      '1y': 365,
      '2y': 730,
      '5y': 1825,
      'max': 3650,
    };

    const days = periodMap[period] || 90;
    const period1 = new Date();
    period1.setDate(period1.getDate() - days);

    const queryOptions = {
      period1: period1,
      period2: new Date(),
      interval: interval,
    };

    logger.info(`Query options: ${JSON.stringify({ period1: period1.toISOString(), period2: new Date().toISOString(), interval })}`);

    const result = await yahooFinance.historical(ticker.toUpperCase(), queryOptions);

    logger.info(`Historical data received: ${result?.length || 0} records`);

    if (!result || result.length === 0) {
      return errorResponse(res, `No historical data found for ${ticker}`, 404);
    }

    // Format the data for frontend
    const formattedData = result.map(item => ({
      date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date,
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      volume: item.volume || 0,
      adjClose: item.adjClose || item.close || 0,
    }));

    return successResponse(res, formattedData, 'Historical prices retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching historical prices for ${req.params?.ticker || 'unknown'}: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    return errorResponse(res, 'Failed to fetch historical prices', 500, error.message);
  }
};
  
  
