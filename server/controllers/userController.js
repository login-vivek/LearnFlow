const { validationResult } = require('express-validator');
const User = require('../models/User');

// ---------------------------------------------------------------------------
// @route   GET /api/users/profile
// @desc    Get the authenticated user's profile
// @access  Private
// ---------------------------------------------------------------------------
const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// @route   PUT /api/users/profile
// @desc    Update the authenticated user's profile
// @access  Private
// ---------------------------------------------------------------------------
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, avatar, learningGoals, preferredFormats } = req.body;

    // Build update object with only provided fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (learningGoals !== undefined) updates.learningGoals = learningGoals;
    if (preferredFormats !== undefined)
      updates.preferredFormats = preferredFormats;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
