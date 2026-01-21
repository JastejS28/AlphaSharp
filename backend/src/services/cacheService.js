import StockCache from '../models/StockCache.js';
import MarketRegime from '../models/MarketRegime.js';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

export const cacheService = {
  // Get cached stock data
  async getStockCache(ticker, endpoint) {
    try {
      const cached = await StockCache.findValidCache(ticker, endpoint);
      
      if (cached) {
        logger.debug(`Cache HIT: ${ticker} - ${endpoint}`);
        return {
          success: true,
          data: cached.data,
          cached: true,
          expiresAt: cached.expiresAt,
        };
      }
      
      logger.debug(`Cache MISS: ${ticker} - ${endpoint}`);
      return { success: false, cached: false };
    } catch (error) {
      logger.error(`Cache retrieval error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Set stock cache
  async setStockCache(ticker, endpoint, data) {
    try {
      let ttl;
      
      switch (endpoint) {
        case 'analysis':
          ttl = config.cache.stockAnalysisTtl;
          break;
        case 'news':
          ttl = config.cache.marketNewsTtl;
          break;
        default:
          ttl = 300; // 5 minutes default
      }
      
      const cached = await StockCache.setCache(ticker, endpoint, data, ttl);
      logger.debug(`Cache SET: ${ticker} - ${endpoint} (TTL: ${ttl}s)`);
      
      return {
        success: true,
        expiresAt: cached.expiresAt,
      };
    } catch (error) {
      logger.error(`Cache storage error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Get cached market regime
  async getMarketRegimeCache() {
    try {
      const cached = await MarketRegime.findLatestRegime();
      
      if (cached) {
        logger.debug('Market regime cache HIT');
        return {
          success: true,
          data: cached.toObject(),
          cached: true,
          expiresAt: cached.expiresAt,
        };
      }
      
      logger.debug('Market regime cache MISS');
      return { success: false, cached: false };
    } catch (error) {
      logger.error(`Market regime cache error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Set market regime cache
  async setMarketRegimeCache(regimeData) {
    try {
      const ttl = config.cache.marketRegimeTtl;
      const cached = await MarketRegime.setCurrentRegime(regimeData, ttl);
      logger.debug(`Market regime cache SET (TTL: ${ttl}s)`);
      
      return {
        success: true,
        expiresAt: cached.expiresAt,
      };
    } catch (error) {
      logger.error(`Market regime cache storage error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Clear cache for a specific ticker
  async clearStockCache(ticker) {
    try {
      await StockCache.deleteMany({ ticker: ticker.toUpperCase() });
      logger.info(`Cache cleared for ticker: ${ticker}`);
      return { success: true };
    } catch (error) {
      logger.error(`Cache clear error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Clear all expired cache (manual cleanup)
  async clearExpiredCache() {
    try {
      const now = new Date();
      const stockResult = await StockCache.deleteMany({ expiresAt: { $lt: now } });
      const regimeResult = await MarketRegime.deleteMany({ expiresAt: { $lt: now } });
      
      logger.info(`Expired cache cleared: ${stockResult.deletedCount + regimeResult.deletedCount} documents`);
      return {
        success: true,
        deleted: stockResult.deletedCount + regimeResult.deletedCount,
      };
    } catch (error) {
      logger.error(`Expired cache cleanup error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // Clear market regime cache
  async clearMarketRegimeCache() {
    try {
      const result = await MarketRegime.deleteMany({});
      logger.info(`Market regime cache cleared: ${result.deletedCount} documents`);
      return { success: true, deleted: result.deletedCount };
    } catch (error) {
      logger.error(`Market regime cache clear error: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
};

export default cacheService;
