const express = require('express');
const { createJob, getJobsByCategory } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/jobs', protect, createJob);
router.get('/jobs/:category', getJobsByCategory);

module.exports = router;
