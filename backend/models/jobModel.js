const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Job = sequelize.define('Job', {
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255], // Ensures job title is not empty and has a reasonable length
    },
  },
  jobDescription: {
    type: DataTypes.TEXT, // Use TEXT for potentially longer job descriptions
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255], // Ensures company name is not empty and has a reasonable length
    },
  },
  companyDescription: {
    type: DataTypes.TEXT, // Use TEXT for potentially longer company descriptions
    allowNull: true, // This can be optional
  },
  entrepreneurId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Foreign key reference to User model
      key: 'id',
    },
    onUpdate: 'CASCADE', // Update the foreign key if User id is updated
    onDelete: 'SET NULL', // Set foreign key to NULL if User is deleted
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = Job;
