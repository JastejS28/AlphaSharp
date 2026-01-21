import express from 'express';
import { protect } from '../middlewares/auth.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const { defaultWatchlist, theme } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (defaultWatchlist) {
      user.preferences.defaultWatchlist = defaultWatchlist;
    }

    if (theme) {
      user.preferences.theme = theme;
    }

    await user.save();

    successResponse(res, { user }, 'Preferences updated successfully');
  } catch (error) {
    errorResponse(res, 'Failed to update preferences', 500);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    errorResponse(res, 'Failed to fetch profile', 500);
  }
});

export default router;
