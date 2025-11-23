const Player = require("../models/player.model");

const searchMiddleware = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            // If no search query is provided, just pass control to the next middleware
            req.players = await Player.find();
        } else {
            // Perform a search based on the query
            req.players = await Player.find({
                Name: { $regex: query, $options: "i" }, // Case-insensitive partial matching
            });
        }

        next(); // Pass control to the next middleware or route
    } catch (error) {
        res.status(500).json({ error: "Search error", details: error.message });
    }
};

module.exports = searchMiddleware;
