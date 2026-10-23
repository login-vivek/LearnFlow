const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('preferredFormats')
    .optional()
    .isArray().withMessage('preferredFormats must be an array'),

  body('learningGoals')
    .optional()
    .isArray().withMessage('learningGoals must be an array'),
];

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);

module.exports = router;
