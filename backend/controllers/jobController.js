const Job = require('../models/jobModel');

// Create a new job listing
exports.createJob = async (req, res) => {
  const { jobCategory, position, jobDescription, companyName } = req.body; // Updated to reflect new model fields

  try {
    const newJob = await Job.create({
      jobCategory,
      position,
      jobDescription, // Include job description
      companyName, // Include company name
      entrepreneurId: req.user.id, // Assumes user is authenticated
    });
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// Fetch jobs based on category
exports.getJobsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const jobs = await Job.findAll({ where: { jobCategory: category } });
    if (!jobs.length) {
      return res.status(404).json({ message: 'No jobs found in this category' });
    }
    res.json(jobs);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
