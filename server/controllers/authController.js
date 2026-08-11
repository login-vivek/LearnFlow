const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ---------------------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ---------------------------------------------------------------------------
const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists',
      });
    }

    // Create user — password is hashed by the pre-save hook in the model
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT
// @access  Public
// ---------------------------------------------------------------------------
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and explicitly select password field (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Return the currently authenticated user
// @access  Private (requires JWT)
// ---------------------------------------------------------------------------
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    return res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// @route   POST /api/auth/logout
// @desc    Logout (client-side token removal; server acknowledges)
// @access  Private
// ---------------------------------------------------------------------------
const logout = async (req, res, next) => {
  try {
    // JWT is stateless — actual invalidation happens on the client side
    // Future phase: maintain a token blacklist / use refresh tokens
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout };
