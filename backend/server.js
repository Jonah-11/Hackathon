const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize'); // Import Sequelize here
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Sequelize configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Turn off SQL query logging, or set to true for debugging
});

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Error connecting to the database:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);

// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Export the sequelize instance for use in other modules if necessary
module.exports = sequelize;
