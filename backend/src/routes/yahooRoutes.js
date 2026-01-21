import express from 'express';
import { getQuote, getMultipleQuotes, getHistoricalPrices } from '../controllers/yahooController.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/quote/:ticker', apiLimiter, getQuote);
router.post('/quotes', apiLimiter, getMultipleQuotes);
router.get('/historical/:ticker', apiLimiter, getHistoricalPrices);

export default router;
