// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded payload (e.g., user id, role) to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }
};
