const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getProblems, getPOTD, markSolved, getSheet } = require('../controllers/problemController');
router.get('/', getProblems);
router.get('/potd', getPOTD);
router.get('/sheet/:sheetName', getSheet);
router.post('/:id/solve', protect, markSolved);
module.exports = router;
