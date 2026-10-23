const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { createPlan, getActivePlan, completeTask, reschedule } = require('../controllers/planController');
router.post('/', protect, createPlan);
router.get('/active', protect, getActivePlan);
router.patch('/task/:taskId/complete', protect, completeTask);
router.post('/reschedule', protect, reschedule);
module.exports = router;
