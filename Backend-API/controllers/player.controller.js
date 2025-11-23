const Player = require('../models/player.model');
const mongoose = require('mongoose'); 
// Get all players
const getAllPlayers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Get page & limit from query params, default to 1 & 10

        // Convert page & limit to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Validate page and limit values
        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ message: "Page and limit must be positive numbers." });
        }

        const totalPlayers = await Player.countDocuments(); // Get total count of players
        const players = await Player.find()
            .skip((pageNumber - 1) * limitNumber) // Skip players based on page number
            .limit(limitNumber); // Limit results per page

        res.status(200).json({
            totalPlayers,
            totalPages: Math.ceil(totalPlayers / limitNumber),
            currentPage: pageNumber,
            players
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get player by ID

const getPlayerById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ObjectId format' });
        }

        // Fetch the player by _id
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTop5 = async (req, res) => {
    try {
        // Fetch Top 5 Players for Each Competition
        const topPlayers = await Player.aggregate([
            // Sort players by market value in descending order
            { $sort: { XGBoost_predicted_values: -1 } },

            // Group players by competition ID
            {
                $group: {
                    _id: "$current_club_domestic_competition_id", // Group by competition ID
                    topPlayers: { $push: "$$ROOT" } // Push all players into an array
                }
            },

            // Limit each group to top 5 players
            {
                $project: {
                    _id: 1, // Include competition ID
                    topPlayers: { $slice: ["$topPlayers", 5] } // Take only the top 5 players
                }
            }
        ]);

        // Check if any players are found
        if (!topPlayers || topPlayers.length === 0) {
            return res.status(404).json({ message: "No players found or data missing." });
        }

        // Return the grouped and filtered players
        res.status(200).json(topPlayers);
    } catch (error) {
        // Log and return the error
        console.error("Error fetching top players:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Get _id by player_id
const getPlayerIdByPlayerId = async (req, res) => {
    try {
        const player = await Player.findOne({ player_id: req.params.player_id });
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json({ _id: player._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//function to get players by position

const getPlayersBySubPosition = async (req, res) => {
    try {
        let { sub_position } = req.params;
        let subPositionsArray = sub_position.split(","); // Allow multiple sub-positions

        // Fetch players matching any of the given sub-positions
        const players = await Player.find({ sub_position: { $in: subPositionsArray } });

        if (!players.length) {
            return res.status(404).json({ message: "No players found for the given sub-positions." });
        }

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//function to filter players
const getFilteredPlayers = async (req, res) => {
    try {
        console.log("Received Query Params:", req.query);

        const { sub_position, sortBy, sortOrder, Name, age, XGBoost_predicted_values } = req.query;
        let filter = {}; // Initialize empty filter object

        // Filter by sub_position
        if (sub_position) {
            filter.sub_position = sub_position;
        }

        // Search by player name (case-insensitive, partial search)
        if (Name) {
            filter.Name = { $regex: Name, $options: "i" }; // "i" makes it case-insensitive
        }

        // Filter by Age (Players who are the selected age or younger)
        if (age) {
            filter.age = { $lte: parseInt(age) }; // Less than or equal to selected age
        }

        // Filter by XGBoost_predicted_values (Players who are worth the selected value or less)
        if (XGBoost_predicted_values) {
            filter.XGBoost_predicted_values = { $lte: parseFloat(XGBoost_predicted_values) }; // Less than or equal to selected value
        }

        console.log("Filter criteria:", filter); // Debugging log

        // Sorting logic
        let sortCriteria = {};
        if (sortBy) {
            const validSortFields = ["XGBoost_predicted_values", "age", "current_club_domestic_competition_id"];
            if (!validSortFields.includes(sortBy)) {
                return res.status(400).json({ message: "Invalid sort field. Use XGBoost_predicted_values, age, or current_club_domestic_competition_id." });
            }
            sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;
        }

        // Fetch players with filtering, searching & sorting
        const players = await Player.find(filter).sort(sortCriteria);

        if (!players.length) {
            return res.status(404).json({ message: "No players found matching the criteria." });
        }

        res.status(200).json(players);
    } catch (error) {
        console.error("Error filtering players:", error);
        res.status(500).json({ message: error.message });
    }
};





module.exports = { getAllPlayers, getPlayerById ,getTop5,getPlayerIdByPlayerId,getPlayersBySubPosition,getFilteredPlayers};
