const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
const corsOptions = {
    origin: 'https://workfinder.netlify.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Database connection configuration
const dbConfig = {
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'LaWBppidpBKGCFDmRIXeHNtYLIOUJYzz',
    database: 'railway',
    port: 3306,
};

// Initialize database connection pool
const dbPool = mysql.createPool(dbConfig);

// Registration handler function
app.post('/register', async (req, res) => {
    try {
        console.log(req.body); // Debugging: Log the incoming request body

        const { name, email, password, user_type } = req.body;

        // Check if all required fields are present
        if (!name || !email || !password || !user_type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const query = 'INSERT INTO users (user_type, name, email, password) VALUES (?, ?, ?, ?)';
        const connection = await dbPool.getConnection();
        await connection.execute(query, [user_type, name, email, hashedPassword]);
        connection.release(); // Release the connection back to the pool

        console.log('New user created:', { user_type, name, email });
        
        // Return success response to the frontend
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error inserting user into the database:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});

// POST /jobListings - Create a job listing
app.post('/jobListings', async (req, res) => {
    const { job_title, company_name, location, job_description } = req.body;

    // Validate input
    if (!job_title || !company_name || !location || !job_description) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
        const query = 'INSERT INTO job_listings (job_title, company_name, job_description, location, created_at) VALUES (?, ?, ?, ?, NOW())';
        const connection = await dbPool.getConnection();
        await connection.execute(query, [job_title, company_name, job_description, location]);
        connection.release();

        res.status(201).json({ message: "Job listing created successfully." });
    } catch (error) {
        console.error('Error creating job listing:', error);
        res.status(500).json({ error: "Failed to create job listing." });
    }
});

// GET /jobListings - Fetch job listings
app.get('/jobListings', async (req, res) => {
    try {
        const query = 'SELECT * FROM job_listings ORDER BY created_at DESC';
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query);
        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: "Failed to fetch job listings." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
