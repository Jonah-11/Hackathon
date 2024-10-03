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
        console.log('Register request body:', req.body); // Debugging: Log the incoming request body

        const { name, email, password, user_type } = req.body;

        // Check if all required fields are present
        if (!name) return res.status(400).json({ message: 'Name is required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        if (!user_type) return res.status(400).json({ message: 'User type is required' });

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

// ------------------------ User Login ------------------------
app.post('/login', loginLimiter, async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Debugging: Log the incoming request body

        const { email, password } = req.body;

        // Check if all required fields are present
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });

        // Query the database to find the user by email
        const query = 'SELECT * FROM users WHERE email = ?';
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query, [email]);
        connection.release();

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare the hashed password with the provided password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ------------------------ Job Posting ------------------------
app.post('/jobListings', async (req, res) => {
    const { job_title, company_name, location, job_description } = req.body;

    // Validate input
    if (!job_title) return res.status(400).json({ message: "Job title is required." });
    if (!company_name) return res.status(400).json({ message: "Company name is required." });
    if (!location) return res.status(400).json({ message: "Location is required." });
    if (!job_description) return res.status(400).json({ message: "Job description is required." });

    try {
        const query = 'INSERT INTO job_listings (job_title, company_name, job_description, location) VALUES (?, ?, ?, ?)';
        const connection = await dbPool.getConnection();
        await connection.execute(query, [job_title, company_name, job_description, location]);
        connection.release();

        res.status(201).json({ message: "Job listing created successfully." });
    } catch (error) {
        console.error('Error creating job listing:', error);
        res.status(500).json({ error: "Failed to create job listing." });
    }
});

// ------------------------ Fetch Job Listings ------------------------
app.get('/jobListings', async (req, res) => {
    try {
        const query = 'SELECT * FROM job_listings'; 
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(query);
        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: "Failed to fetch job listings." });
    }
});

// ------------------------ Search Job Listings ------------------------
app.get('/jobListings/search', async (req, res) => {
    try {
        const { query } = req.query; // Retrieve the search query from the request
        let sqlQuery = 'SELECT * FROM job_listings WHERE job_title LIKE ? OR company_name LIKE ?'; 
        const connection = await dbPool.getConnection();
        const [rows] = await connection.execute(sqlQuery, [`%${query}%`, `%${query}%`]);
        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: "Failed to fetch search results." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
