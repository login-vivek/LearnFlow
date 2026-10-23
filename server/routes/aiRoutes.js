const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { askTUFY, getHint, reviewCode, generateNotes, getSuggestions } = require('../controllers/aiController');
router.post('/ask', protect, askTUFY);
router.post('/hint', protect, getHint);
router.post('/review', protect, reviewCode);
router.post('/notes', protect, generateNotes);
router.get('/suggestions', protect, getSuggestions);
module.exports = router;
