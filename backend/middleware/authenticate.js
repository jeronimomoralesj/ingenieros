const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Debug log for tracing

  // Check if Authorization header is missing or invalid
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or invalid:', authHeader);
    return res.status(401).json({
      message: 'Authorization header is missing or invalid. Please log in.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    // Fetch the user using decoded token's id
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('No user found for the given token.');
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user data to the request object
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.',
      error: error.message,
    });
  }
};

module.exports = authenticate;
