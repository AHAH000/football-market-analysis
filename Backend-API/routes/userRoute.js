const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const {loginUser}=require("../controllers/loginUser")
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Public routes
router.post('/login', loginUser); // Public route for login
router.post('/', createUser); // Public route for registration
router.get('/', getUsers);
// Protected routes
// Add /protected route before the dynamic :id route
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Access granted to protected route',
        user: req.user, // Data from token
    });
});

// Dynamic :id route must come last
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
