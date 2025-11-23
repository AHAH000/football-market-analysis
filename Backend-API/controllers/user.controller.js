const User=require("../models/user.model");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//function to Create a user
const createUser = async (req, res) => {
    try {
        // Check for existing user by username or email
        const existingUser = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username or email already exists. Please choose another.'
            });
        }

        // Create a new user
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//function to get all users 
const getUsers=async (req,res)=>{
    try {
        const user = await User.find({})
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    
    }
}
//function to get a user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Update a User
const updateUser = async (req, res) => {
    try {
        // ✅ Extract Token from Headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract token part
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        // ✅ Ensure the User ID in Token Matches the One Being Updated
        if (decoded.id !== req.params.id) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }

        // ✅ Check if Email or Username Already Exists
        if (req.body.username) {
            const existingUser = await User.findOne({
                username: req.body.username,
                _id: { $ne: req.params.id } // Exclude the current user
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username already exists. Please choose another." });
            }
        }

        // ✅ Encrypt Password if Updated
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // ✅ Handle Image Updates (Check if Base64 Image is Sent)
        if (req.body.profileImage) {
            req.body.profileImage = req.body.profileImage; // Store Base64 image in database
        }

        // ✅ Update the User
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Send Updated User (Without Password)
        const updatedUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
        };

        res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};



// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the user to validate existence and permissions
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Example validation: Allow only admins or the user themselves to delete
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this user' });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports={
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}