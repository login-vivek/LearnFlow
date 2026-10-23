const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { logProgress, getProgress, getStreak } = require('../controllers/progressController');
router.post('/', protect, logProgress);
router.get('/', protect, getProgress);
router.get('/streak', protect, getStreak);
module.exports = router;
