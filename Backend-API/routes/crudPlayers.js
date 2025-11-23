const express = require('express');
const Player = require('../models/player.model'); // Ensure this path is correct
const router = express.Router();
const requireAdmin=require("../middleware/authRole");
const authenticateToken  = require('../middleware/authenticateToken');
// Create a new player (Admin only)
router.post('/create', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { player_id, ...playerData } = req.body; // Ignore player_id from request
        const newPlayer = new Player(playerData); // Create without player_id
        await newPlayer.save();
        res.status(201).json({ message: "Player created successfully", player: newPlayer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all players (Public access, remove requireAdmin)
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific player by ID (Public access, remove requireAdmin)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const player = await Player.findOne({ player_id: req.params.id });
        if (!player) return res.status(404).json({ message: "Player not found" });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update player details (Admin only)
router.put('/update/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const updatedPlayer = await Player.findOneAndUpdate(
            { player_id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedPlayer) return res.status(404).json({ message: "Player not found" });
        res.status(200).json({ message: "Player updated successfully", player: updatedPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a player (Admin only)
router.delete('/delete/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const deletedPlayer = await Player.findOneAndDelete({ player_id: req.params.id });
        if (!deletedPlayer) return res.status(404).json({ message: "Player not found" });
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
