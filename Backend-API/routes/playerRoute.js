const express = require('express');
const { 
    getAllPlayers, 
    getPlayerById, 
    getTop5, 
    getPlayerIdByPlayerId, 
    getPlayersBySubPosition, 
    getFilteredPlayers 
} = require('../controllers/player.controller');

const router = express.Router();

// ✅ Move the specific routes above the dynamic `/:id` route

// Route: Get Top 5 players per competition
router.get('/getTop5', getTop5);

// Route: Get players by filters (sub-position, age, etc.)
router.get("/filter", getFilteredPlayers);

// Route: Get player by sub-position
router.get("/sub-position/:sub_position", getPlayersBySubPosition);

// Route: Get all players
router.get('/', getAllPlayers);

// Route: Get player by player_id
router.get('/playerId/:player_id', getPlayerIdByPlayerId);

// ✅ Keep this at the bottom to avoid conflicts
router.get('/:id', getPlayerById);

module.exports = router;
