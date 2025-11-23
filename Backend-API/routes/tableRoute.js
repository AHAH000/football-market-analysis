const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

// API Endpoint to Fetch League Standings Table
router.get('/:leagueCode', async (req, res) => {
    const { leagueCode } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/competitions/${leagueCode}/standings`, {
            headers: { "X-Auth-Token": FOOTBALL_API_KEY }
        });

        if (response.status === 200) {
            // Extract standings data
            const standings = response.data.standings[0].table.map(team => ({
                position: team.position,
                team: {
                    id: team.team.id,
                    name: team.team.name,
                    shortName: team.team.shortName,
                    tla: team.team.tla,
                    crest: team.team.crest
                },
                playedGames: team.playedGames,
                won: team.won,
                draw: team.draw,
                lost: team.lost,
                points: team.points,
                goalsFor: team.goalsFor,
                goalsAgainst: team.goalsAgainst,
                goalDifference: team.goalDifference,
            }));

            res.json({ success: true, data: standings });
        } else {
            res.status(response.status).json({ success: false, message: "Failed to fetch data" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;