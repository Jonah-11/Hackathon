const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.protect = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the token
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(401).json({ error: 'Not authorized' });
  }
};
