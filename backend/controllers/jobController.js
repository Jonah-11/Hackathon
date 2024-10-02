const Job = require('../models/jobModel');

// Create a new job listing
exports.createJob = async (req, res) => {
  const { jobCategory, position, jobDescription, companyName } = req.body;

  try {
    const newJob = await Job.create({
      jobCategory,
      position,
      jobDescription,
      companyName,
      entrepreneurId: req.user.id, // Assumes user is authenticated
    });
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error("Error posting job:", error); // Log the error for debugging
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
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by category:", error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Fetch all jobs (optional)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching all jobs:", error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Fetch a job by ID (optional)
exports.getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};
