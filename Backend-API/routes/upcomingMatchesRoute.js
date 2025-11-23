const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

// Route to fetch upcoming matches for a team using its ID
router.get('/upcoming-matches/:teamId', async (req, res) => {
    const { teamId } = req.params;

    console.log(`Received request for upcoming matches with teamId: ${teamId}`); // ✅ Debugging log

    if (!teamId || isNaN(teamId)) {
        return res.status(400).json({ success: false, message: "Invalid team ID provided" });
    }

    try {
        const response = await axios.get(`${BASE_URL}/teams/${teamId}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": FOOTBALL_API_KEY }
        });

        console.log("API Response:", response.data); // ✅ Debugging log

        if (!response.data.matches || response.data.matches.length === 0) {
            return res.json({ success: false, message: "No upcoming matches found for this team." });
        }

        // ✅ Extract and format match details
        const formattedMatches = response.data.matches.map(match => ({
            matchId: match.id,
            competition: match.competition.name,
            matchday: match.matchday,
            status: match.status,
            stage: match.stage,
            utcDate: match.utcDate,
            homeTeam: {
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                crest: match.homeTeam.crest
            },
            awayTeam: {
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                crest: match.awayTeam.crest
            }
        }));

        return res.json({
            success: true,
            teamId: teamId,
            matches: formattedMatches
        });

    } catch (error) {
        console.error("Error fetching upcoming matches:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: "Server error fetching matches" });
    }
});

module.exports = router;
