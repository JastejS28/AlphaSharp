import express from 'express';
import {
  queryAgent,
  getThreadHistory,
} from '../controllers/agentController.js';
import { protect, optionalAuth } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public route with optional auth (for personalized threads)
router.post('/query', optionalAuth, apiLimiter, queryAgent);

// Protected route
router.get('/threads/:threadId', protect, getThreadHistory);

export default router;
