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

// POST /register - Handle user registration
app.post('/register', async (req, res) => {
    const { user_type, name, email, password } = req.body;

    if (!user_type || !name || !email || !password) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
        const query = 'INSERT INTO users (user_type, name, email, password) VALUES (?, ?, ?, ?)';
        await (await db).execute(query, [user_type, name, email, password]);

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: "Failed to register user." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
