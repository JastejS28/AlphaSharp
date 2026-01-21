import pythonApiService from '../services/pythonApiService.js';
import cacheService from '../services/cacheService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// @desc    Get current market condition (regime)
// @route   GET /api/market/condition
// @access  Public
export const getMarketCondition = async (req, res) => {
  try {
    // Check cache first
    const cached = await cacheService.getMarketRegimeCache();
    
    if (cached.success && cached.cached) {
      return successResponse(res, {
        ...cached.data,
        _cached: true,
        _expiresAt: cached.expiresAt,
      }, 'Market condition retrieved from cache');
    }

    // Fetch from Python API
    const result = await pythonApiService.getMarketCondition();

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    // Log the data structure for debugging
    logger.info('Market condition from Python API:', JSON.stringify(result.data, null, 2));

    // Cache the result
    await cacheService.setMarketRegimeCache(result.data);

    successResponse(res, {
      ...result.data,
      _cached: false,
    }, 'Market condition retrieved successfully');
  } catch (error) {
    logger.error(`Get market condition error: ${error.message}`);
    errorResponse(res, 'Failed to fetch market condition', 500);
  }
};

// @desc    Get regime forecast
// @route   GET /api/market/forecast
// @access  Public
export const getRegimeForecast = async (req, res) => {
  try {
    const { days = 60, simulations = 2000, include_paths = false } = req.query;

    const result = await pythonApiService.getRegimeForecast(
      parseInt(days),
      parseInt(simulations),
      include_paths === 'true'
    );

    if (!result.success) {
      logger.error(`Forecast API error: ${result.error}`);
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, result.data, 'Forecast retrieved successfully');
  } catch (error) {
    logger.error(`Get regime forecast error: ${error.message}`);
    errorResponse(res, 'Failed to fetch forecast', 500);
  }
};

// @desc    Get short-term prediction
// @route   GET /api/market/forecast/short-term
// @access  Public
export const getShortTermPrediction = async (req, res) => {
  try {
    const { days = 5 } = req.query;

    const result = await pythonApiService.getShortTermPrediction(parseInt(days));

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, result.data, 'Short-term prediction retrieved successfully');
  } catch (error) {
    logger.error(`Get short-term prediction error: ${error.message}`);
    errorResponse(res, 'Failed to fetch short-term prediction', 500);
  }
};

// @desc    Get all regimes info
// @route   GET /api/market/regimes
// @access  Public
export const getAllRegimes = async (req, res) => {
  try {
    const result = await pythonApiService.getAllRegimes();

    if (!result.success) {
      logger.error(`All regimes API error: ${result.error}`);
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, result.data, 'All regimes retrieved successfully');
  } catch (error) {
    logger.error(`Get all regimes error: ${error.message}`);
    errorResponse(res, 'Failed to fetch regimes', 500);
  }
};

// @desc    Get Python API status
// @route   GET /api/market/status
// @access  Public
export const getApiStatus = async (req, res) => {
  try {
    const status = pythonApiService.getStatus();
    
    successResponse(res, {
      ...status,
      message: status.isWarm ? 'API is warm and ready' : 'API may be cold - first request may take up to 50 seconds',
    }, 'API status retrieved successfully');
  } catch (error) {
    logger.error(`Get API status error: ${error.message}`);
    errorResponse(res, 'Failed to fetch API status', 500);
  }
};

// @desc    Clear market cache
// @route   DELETE /api/market/cache/clear
// @access  Public
export const clearCache = async (req, res) => {
  try {
    await cacheService.clearMarketRegimeCache();
    logger.info('Market cache cleared successfully');
    successResponse(res, { cleared: true }, 'Market cache cleared successfully');
  } catch (error) {
    logger.error(`Clear cache error: ${error.message}`);
    errorResponse(res, 'Failed to clear cache', 500);
  }
};

// @desc    Get regime history
// @route   GET /api/market/history
// @access  Public
export const getRegimeHistory = async (req, res) => {
  try {
    const { days = 60 } = req.query;
    const daysInt = parseInt(days);

    // Validate days (10-750)
    if (daysInt < 10 || daysInt > 750) {
      return errorResponse(res, 'Days must be between 10 and 750', 400);
    }

    // Fetch from Python API
    const result = await pythonApiService.getRegimeHistory(daysInt);

    if (!result.success) {
      logger.error(`Regime history error: ${result.error}`);
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, result.data, 'Regime history retrieved successfully');
  } catch (error) {
    logger.error(`Get regime history error: ${error.message}`);
    errorResponse(res, 'Failed to fetch regime history', 500);
  }
};
