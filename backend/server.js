// backend.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Path to the job postings file
const jobPostingsFile = path.join(__dirname, 'jobPostings.json');

// Load existing job postings from the file
function loadJobPostings() {
    if (fs.existsSync(jobPostingsFile)) {
        const data = fs.readFileSync(jobPostingsFile);
        return JSON.parse(data);
    }
    return [];
}

// Endpoint to get all job postings
app.get('/api/job-postings', (req, res) => {
    const jobPostings = loadJobPostings();
    res.json(jobPostings);
});

// Endpoint to post a new job
app.post('/api/job-postings', (req, res) => {
    const newJobPosting = req.body;

    // Load existing job postings and add the new one
    const jobPostings = loadJobPostings();
    jobPostings.push(newJobPosting);

    // Save updated job postings to the file
    fs.writeFileSync(jobPostingsFile, JSON.stringify(jobPostings, null, 2));
    res.status(201).json(newJobPosting); // Respond with the created job posting
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
