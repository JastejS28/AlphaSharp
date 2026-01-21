import pythonApiService from '../services/pythonApiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// @desc    Query AI agent
// @route   POST /api/agent/query
// @access  Public (optionalAuth for personalized responses)
export const queryAgent = async (req, res) => {
  try {
    const { query, thread_id = 'default_thread' } = req.body;

    if (!query || query.trim().length === 0) {
      return errorResponse(res, 'Query is required', 400);
    }

    // Create unique thread ID for logged-in users
    let userThreadId = thread_id;
    if (req.user) {
      userThreadId = `user_${req.user._id}_${thread_id}`;
    }

    const result = await pythonApiService.queryAgent(query, userThreadId);

    if (!result.success) {
      return errorResponse(res, result.error, 500);
    }

    successResponse(res, {
      ...result.data,
      thread_id: userThreadId,
    }, 'Agent query processed successfully');
  } catch (error) {
    logger.error(`Query agent error: ${error.message}`);
    errorResponse(res, 'Failed to query AI agent', 500);
  }
};

// @desc    Get agent thread history (placeholder for future implementation)
// @route   GET /api/agent/threads/:threadId
// @access  Private
export const getThreadHistory = async (req, res) => {
  // Placeholder - implement when backend stores conversation history
  successResponse(res, {
    message: 'Thread history feature coming soon',
    threadId: req.params.threadId,
  }, 'Feature not implemented');
};
