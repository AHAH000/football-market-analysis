const express = require("express");
const router = express.Router();
const searchMiddleware = require("../middleware/searchMiddleware");
const sortingMiddleware = require("../middleware/sortingMiddleware");

// Search and sort route
router.get("/", searchMiddleware, sortingMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Paginate the results
        const startIndex = (page - 1) * limit;
        const paginatedPlayers = req.players.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            total: req.players.length,
            page: parseInt(page),
            limit: parseInt(limit),
            players: paginatedPlayers,
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
