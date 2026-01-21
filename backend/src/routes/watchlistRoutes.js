import express from 'express';
import {
  getWatchlists,
  createWatchlist,
  getWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addStockToWatchlist,
  removeStockFromWatchlist,
  getWatchlistWithData,
} from '../controllers/watchlistController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All watchlist routes are protected
router.use(protect);

router.route('/')
  .get(getWatchlists)
  .post(createWatchlist);

router.route('/:id')
  .get(getWatchlist)
  .put(updateWatchlist)
  .delete(deleteWatchlist);

router.route('/:id/stocks')
  .post(addStockToWatchlist);

router.delete('/:id/stocks/:ticker', removeStockFromWatchlist);

router.get('/:id/data', getWatchlistWithData);

export default router;
