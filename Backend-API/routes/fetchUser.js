const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user.model');

const router = express.Router();

// Endpoint to get the current user's details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // The user's ID is available in req.user after authentication
    const userId = req.user.id;

    // Find the user in the database
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
