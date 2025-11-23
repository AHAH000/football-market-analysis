// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 

// Middleware to verify admin role
const requireAdmin = async (req, res, next) => {
  try {
    // Check if the request has a valid authorization token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    // Attach the user to the request object
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = requireAdmin;