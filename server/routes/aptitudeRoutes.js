const router = require('express').Router();
const { getQuestions, submitAnswers } = require('../controllers/aptitudeController');

router.get('/',          getQuestions);
router.post('/submit',   submitAnswers);

module.exports = router;
