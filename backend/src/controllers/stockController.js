import pythonApiService from '../services/pythonApiService.js';
import yahooFinanceService from '../services/yahooFinanceService.js';
import cacheService from '../services/cacheService.js';
import SearchHistory from '../models/SearchHistory.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// @desc    Get stock analysis
// @route   GET /api/stocks/:ticker/analysis
// @access  Public (optionalAuth for search history)
export const getStockAnalysis = async (req, res) => {
  try {
    const { ticker } = req.params;

    // Check cache first
    const cached = await cacheService.getStockCache(ticker, 'analysis');
    
    if (cached.success && cached.cached) {
      // Record search history if user is logged in
      if (req.user) {
        await SearchHistory.recordSearch(req.user._id, ticker, cached.data.company_name);
      }

      return successResponse(res, {
        ...cached.data,
        _cached: true,
        _expiresAt: cached.expiresAt,
      }, 'Stock analysis retrieved from cache');
    }

    // Fetch from Python API
    const result = await pythonApiService.getStockAnalysis(ticker);

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    // Cache the result (historical data fetching is optional and handled separately)
    await cacheService.setStockCache(ticker, 'analysis', result.data);

    // Record search history if user is logged in
    if (req.user) {
      await SearchHistory.recordSearch(req.user._id, ticker, result.data.company_name);
    }

    successResponse(res, {
      ...result.data,
      _cached: false,
    }, 'Stock analysis retrieved successfully');
  } catch (error) {
    logger.error(`Get stock analysis error: ${error.message}`);
    errorResponse(res, 'Failed to fetch stock analysis', 500);
  }
};

// @desc    Get stock news
// @route   GET /api/stocks/:ticker/news
// @access  Public
export const getStockNews = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { max_news = 5 } = req.query;

    // Check cache
    const cached = await cacheService.getStockCache(ticker, 'news');
    
    if (cached.success && cached.cached) {
      return successResponse(res, {
        ...cached.data,
        _cached: true,
        _expiresAt: cached.expiresAt,
      }, 'Stock news retrieved from cache');
    }

    // Fetch from Python API
    const result = await pythonApiService.getStockNews(ticker, parseInt(max_news));

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    // Cache the result
    await cacheService.setStockCache(ticker, 'news', result.data);

    successResponse(res, {
      ...result.data,
      _cached: false,
    }, 'Stock news retrieved successfully');
  } catch (error) {
    logger.error(`Get stock news error: ${error.message}`);
    errorResponse(res, 'Failed to fetch stock news', 500);
  }
};

// @desc    Search ticker
// @route   GET /api/stocks/search
// @access  Public
export const searchTicker = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return errorResponse(res, 'Search query is required', 400);
    }

    const result = await pythonApiService.searchTicker(q);

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, result.data, 'Search results retrieved successfully');
  } catch (error) {
    logger.error(`Search ticker error: ${error.message}`);
    errorResponse(res, 'Failed to search tickers', 500);
  }
};

// @desc    Get user's search history
// @route   GET /api/stocks/history
// @access  Private
export const getSearchHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const history = await SearchHistory.getRecentSearches(req.user._id, parseInt(limit));

    successResponse(res, { history }, 'Search history retrieved successfully');
  } catch (error) {
    logger.error(`Get search history error: ${error.message}`);
    errorResponse(res, 'Failed to fetch search history', 500);
  }
};

// @desc    Get historical stock prices (Yahoo Finance)
// @route   GET /api/stocks/:ticker/history
// @access  Public
export const getHistoricalPrices = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '3mo', interval = '1d' } = req.query;

    // Check cache first
    const cached = await cacheService.getStockCache(ticker, 'history');
    
    if (cached.success && cached.cached) {
      return successResponse(res, {
        ...cached.data,
        _cached: true,
        _expiresAt: cached.expiresAt,
      }, 'Historical prices retrieved from cache');
    }

    // Fetch from Yahoo Finance directly
    const result = await yahooFinanceService.getHistoricalData(ticker, period, interval);

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    // Cache the result (1 hour TTL for historical data)
    await cacheService.setStockCache(ticker, 'history', result.data);

    successResponse(res, {
      ...result.data,
      _cached: false,
    }, 'Historical prices retrieved successfully');
  } catch (error) {
    logger.error(`Get historical prices error: ${error.message}`);
    errorResponse(res, 'Failed to fetch historical prices', 500);
  }
};
