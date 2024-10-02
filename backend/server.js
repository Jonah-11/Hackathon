// backend.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Ensure you have mysql2 installed
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Database connection
const dbConfig = {
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'LaWBppidpBKGCFDmRIXeHNtYLIOUJYzz', 
    database: 'railway',
    port: 3306,
};

async function initDb() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

const db = initDb();

// POST /jobListings - Store a new job listing in the database
app.post('/jobListings', async (req, res) => {
    const { job_title, location, company_name, job_description } = req.body;

    if (!job_title || !location || !company_name || !job_description) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
        const query = 'INSERT INTO job_listing (job_title, location, company_name, job_description) VALUES (?, ?, ?, ?)';
        await (await db).execute(query, [job_title, location, company_name, job_description]);

        res.status(201).json({ message: "Job listing posted successfully." });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ error: "Failed to post job." });
    }
});

// GET /jobListings - Fetch all job listings from the database
app.get('/jobListings', async (req, res) => {
    try {
        const query = 'SELECT * FROM job_listing ORDER BY created_at DESC';
        const [rows] = await (await db).execute(query);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: "Failed to fetch job listings." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
