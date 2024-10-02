const express = require('express');
const {
  createJob,
  getJobsByCategory,
  getAllJobs,         // Optionally added to retrieve all jobs
  getJobById          // Optionally added to retrieve a job by ID
} = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a new job
router.post('/jobs', protect, createJob);

// Route to get jobs by category
router.get('/jobs/category/:category', getJobsByCategory);

// Optional: Route to get all jobs
router.get('/jobs', getAllJobs);

// Optional: Route to get a job by ID
router.get('/jobs/:id', getJobById);

module.exports = router;
