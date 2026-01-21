import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken, generateRefreshToken } from '../middlewares/auth.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    successResponse(res, {
      user: req.user,
    }, 'User retrieved successfully');
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    errorResponse(res, 'Failed to retrieve user', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse(res, null, 'Logged out successfully');
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.cookies;

    if (!oldRefreshToken) {
      return errorResponse(res, 'No refresh token provided', 401);
    }

    // Verify refresh token
    const decoded = jwt.verify(oldRefreshToken, config.jwtRefreshSecret);

    // Generate new tokens
    const newToken = generateToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    // Set new cookies
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, { token: newToken }, 'Token refreshed successfully');
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    errorResponse(res, 'Invalid refresh token', 401);
  }
};

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return errorResponse(res, 'Please provide email, password, and name', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      authProvider: 'local',
      isEmailVerified: false, // TODO: Implement email verification
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set httpOnly cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    logger.info(`New user registered: ${email}`);

    successResponse(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          authProvider: user.authProvider,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    errorResponse(res, 'Registration failed', 500);
  }
};

// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check if user used OAuth (no password set)
    if (user.authProvider === 'google' && !user.password) {
      return errorResponse(res, 'This account uses Google Sign-In. Please login with Google.', 400);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set httpOnly cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    logger.info(`User logged in: ${email}`);

    successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        authProvider: user.authProvider,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    errorResponse(res, 'Login failed', 500);
  }
};
