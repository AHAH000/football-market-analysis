const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log("Login attempt with email:", email);

        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log("Stored password hash for email:", email, user.password);

        // Verify the password provided by the user
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.error("Password mismatch for email:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Ensure profileImage is included in the response
        res.status(200).json({
            token,
            message: 'Login successful',
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                profileImage: user.profileImage || '/default-profile.png' // Include profile image
            },
        });

        console.log("User logged in successfully:", { email: user.email, id: user._id, profileImage: user.profileImage });
    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { loginUser };
