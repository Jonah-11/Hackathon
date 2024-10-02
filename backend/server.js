const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Ensure you have mysql2 installed
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
const corsOptions = {
    origin: 'https://workfinder.netlify.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Add other HTTP methods you need
    allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers you want to allow
};

// Apply CORS middleware
app.use(cors(corsOptions));
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

// Initialize database connection
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

let db;

// Start the server and database connection
async function startServer() {
    db = await initDb(); // Await the initialization of the database connection

    // POST /register - Handle user registration
    app.post('/register', async (req, res) => {
        const { user_type, name, email, password } = req.body;

        if (!user_type || !name || !email || !password) {
            return res.status(400).json({ error: "Please fill in all required fields." });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

            const query = 'INSERT INTO users (user_type, name, email, password) VALUES (?, ?, ?, ?)';
            await db.execute(query, [user_type, name, email, hashedPassword]); // Save hashed password

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error('Error registering user:', error.message); // Log the error message
            res.status(500).json({ error: "Failed to register user." });
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
            await db.execute(query, [job_title, company_name, job_description, location]);

            res.status(201).json({ message: "Job listing created successfully." });
        } catch (error) {
            console.error('Error creating job listing:', error.message); // Log the error message
            res.status(500).json({ error: "Failed to create job listing." });
        }
    });

    // GET /jobListings - Fetch job listings
    app.get('/jobListings', async (req, res) => {
        try {
            const query = 'SELECT * FROM job_listings ORDER BY created_at DESC';
            const [rows] = await db.execute(query);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching job listings:', error.message); // Log the error message
            res.status(500).json({ error: "Failed to fetch job listings." });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

// Call the function to start the server
startServer();
