const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
const corsOptions = {
    origin: 'https://workfinder.netlify.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Rate Limiting Middleware
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.',
});

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

// ------------------------ User Registration ------------------------
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body;

        // Validate input
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

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error inserting user into the database:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});

// ------------------------ User Login ------------------------
app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const query = 'SELECT * FROM users WHERE email = ?';
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query, [email]);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, user_type: user.user_type }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});

// ------------------------ Job Listings ------------------------
// Fetch all job listings
app.get('/jobListings', async (req, res) => {
    try {
        const query = 'SELECT * FROM job_listings'; // Adjust table name if necessary
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query);
        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ message: 'Failed to fetch job listings' });
    }
});

// Fetch a specific job by ID
app.get('/jobListings/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const query = 'SELECT * FROM job_listings WHERE id = ?'; // Adjust table name if necessary
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query, [jobId]);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ message: 'Failed to fetch job details' });
    }
});

// ------------------------ Post a New Job Listing ------------------------
app.post('/jobListings', async (req, res) => {
    try {
        const { job_title, company_name, location, job_description, contact_email, contact_phone, deadline } = req.body;

        // Validate input
        if (!job_title || !company_name || !location || !job_description || !contact_email || !contact_phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Insert new job listing into the database
        const query = 'INSERT INTO job_listings (job_title, company_name, location, job_description, contact_email, contact_phone, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const connection = await dbPool.getConnection();
        await connection.execute(query, [job_title, company_name, location, job_description, contact_email, contact_phone, deadline]);
        connection.release();

        res.status(201).json({ message: 'Job listing created successfully' });
    } catch (error) {
        console.error('Error creating job listing:', error);
        res.status(500).json({ message: 'Failed to create job listing' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
