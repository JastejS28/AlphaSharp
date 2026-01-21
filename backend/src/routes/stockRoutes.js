import express from 'express';
import {
  getStockAnalysis,
  getStockNews,
  searchTicker,
  getSearchHistory,
  getHistoricalPrices,
} from '../controllers/stockController.js';
import { protect, optionalAuth } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes with optional auth (for search history tracking)
router.get('/search', apiLimiter, searchTicker);
router.get('/:ticker/analysis', optionalAuth, apiLimiter, getStockAnalysis);
router.get('/:ticker/news', apiLimiter, getStockNews);
router.get('/:ticker/history', apiLimiter, getHistoricalPrices);

// Protected routes
router.get('/history', protect, getSearchHistory);

export default router;
