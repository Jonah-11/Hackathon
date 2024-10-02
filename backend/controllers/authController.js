const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

// Register new user
exports.register = async (req, res) => {
  const { name, email, password, userType } = req.body;
  
  // Optional: Validate userType if necessary
  const validUserTypes = ['admin', 'user']; // Define your valid user types
  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, userId: user.id, userType: user.userType });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Something went wrong during login' });
  }
};
