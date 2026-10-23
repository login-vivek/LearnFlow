const router  = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getExperiences, getExperience, createExperience, likeExperience,
} = require('../controllers/experienceController');

router.get('/',           getExperiences);
router.get('/:id',        getExperience);
router.post('/',          protect, createExperience);
router.post('/:id/like',  protect, likeExperience);

module.exports = router;
