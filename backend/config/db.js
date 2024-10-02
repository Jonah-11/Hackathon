const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT, // Add port here
    logging: false, // Set to true for debugging purposes if needed
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Error: ' + err));

module.exports = sequelize;
