import Watchlist from '../models/Watchlist.js';
import pythonApiService from '../services/pythonApiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// @desc    Get all watchlists for user
// @route   GET /api/watchlists
// @access  Private
export const getWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 });

    successResponse(res, { watchlists }, 'Watchlists retrieved successfully');
  } catch (error) {
    logger.error(`Get watchlists error: ${error.message}`);
    errorResponse(res, 'Failed to fetch watchlists', 500);
  }
};

// @desc    Create new watchlist
// @route   POST /api/watchlists
// @access  Private
export const createWatchlist = async (req, res) => {
  try {
    const { name, stocks = [], isDefault = false } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Watchlist.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const watchlist = await Watchlist.create({
      user: req.user._id,
      name,
      stocks: stocks.map((s) => ({
        ticker: s.ticker.toUpperCase(),
        notes: s.notes || '',
      })),
      isDefault,
    });

    successResponse(res, { watchlist }, 'Watchlist created successfully', 201);
  } catch (error) {
    logger.error(`Create watchlist error: ${error.message}`);
    
    if (error.code === 11000) {
      return errorResponse(res, 'Watchlist with this name already exists', 400);
    }
    
    errorResponse(res, 'Failed to create watchlist', 500);
  }
};

// @desc    Get single watchlist
// @route   GET /api/watchlists/:id
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    successResponse(res, { watchlist }, 'Watchlist retrieved successfully');
  } catch (error) {
    logger.error(`Get watchlist error: ${error.message}`);
    errorResponse(res, 'Failed to fetch watchlist', 500);
  }
};

// @desc    Update watchlist
// @route   PUT /api/watchlists/:id
// @access  Private
export const updateWatchlist = async (req, res) => {
  try {
    const { name, isDefault } = req.body;

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    // If setting as default, unset other defaults
    if (isDefault && !watchlist.isDefault) {
      await Watchlist.updateMany(
        { user: req.user._id, _id: { $ne: watchlist._id } },
        { $set: { isDefault: false } }
      );
    }

    if (name) watchlist.name = name;
    if (isDefault !== undefined) watchlist.isDefault = isDefault;

    await watchlist.save();

    successResponse(res, { watchlist }, 'Watchlist updated successfully');
  } catch (error) {
    logger.error(`Update watchlist error: ${error.message}`);
    errorResponse(res, 'Failed to update watchlist', 500);
  }
};

// @desc    Delete watchlist
// @route   DELETE /api/watchlists/:id
// @access  Private
export const deleteWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    successResponse(res, null, 'Watchlist deleted successfully');
  } catch (error) {
    logger.error(`Delete watchlist error: ${error.message}`);
    errorResponse(res, 'Failed to delete watchlist', 500);
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlists/:id/stocks
// @access  Private
export const addStockToWatchlist = async (req, res) => {
  try {
    const { ticker, notes = '' } = req.body;

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    await watchlist.addStock(ticker, notes);

    successResponse(res, { watchlist }, 'Stock added to watchlist successfully');
  } catch (error) {
    logger.error(`Add stock to watchlist error: ${error.message}`);
    errorResponse(res, 'Failed to add stock to watchlist', 500);
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlists/:id/stocks/:ticker
// @access  Private
export const removeStockFromWatchlist = async (req, res) => {
  try {
    const { ticker } = req.params;

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    await watchlist.removeStock(ticker);

    successResponse(res, { watchlist }, 'Stock removed from watchlist successfully');
  } catch (error) {
    logger.error(`Remove stock from watchlist error: ${error.message}`);
    errorResponse(res, 'Failed to remove stock from watchlist', 500);
  }
};

// @desc    Get watchlist with stock data
// @route   GET /api/watchlists/:id/data
// @access  Private
export const getWatchlistWithData = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlist) {
      return errorResponse(res, 'Watchlist not found', 404);
    }

    // Fetch stock data for each ticker (from cache or API)
    const stockDataPromises = watchlist.stocks.map(async (stock) => {
      const result = await pythonApiService.getStockAnalysis(stock.ticker);
      return {
        ticker: stock.ticker,
        notes: stock.notes,
        addedAt: stock.addedAt,
        data: result.success ? result.data : null,
        error: result.success ? null : result.error,
      };
    });

    const stocksWithData = await Promise.all(stockDataPromises);

    successResponse(res, {
      watchlist: {
        ...watchlist.toObject(),
        stocks: stocksWithData,
      },
    }, 'Watchlist with data retrieved successfully');
  } catch (error) {
    logger.error(`Get watchlist with data error: ${error.message}`);
    errorResponse(res, 'Failed to fetch watchlist data', 500);
  }
};
