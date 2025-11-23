const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

// Fetch Top Scorers for a Specific League
router.get("/top-scorers/:leagueCode", async (req, res) => {
  const { leagueCode } = req.params;

  try {
    const response = await axios.get(`${BASE_URL}/competitions/${leagueCode}/scorers`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY },
    });

    if (response.status === 200) {
      const topScorers = response.data.scorers.map((scorer) => ({
        player: scorer.player.name,
        team: scorer.team.name,
        goals: scorer.goals,
        assists: scorer.assists || 0,
        playedMatches: scorer.playedMatches,
      }));

      res.json({ success: true, data: topScorers });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch All Matches Played Today
router.get("/matches/today", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/matches`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY },
    });

    if (response.status === 200) {
      res.json({
        success: true,
        filters: response.data.filters,
        resultSet: response.data.resultSet,
        matches: response.data.matches,
      });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch matches" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch Matches for a Specific Competition
router.get("/matches/:competitionCode", async (req, res) => {
  const { competitionCode } = req.params; // Get competition code from URL

  try {
    const response = await axios.get(`${BASE_URL}/competitions/${competitionCode}/matches`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY },
    });

    if (response.status === 200) {
      const matches = response.data.matches.map((match) => ({
        matchId: match.id,
        competition: response.data.competition.name, // Competition Name
        matchday: match.matchday,
        status: match.status,
        stage: match.stage,
        utcDate: match.utcDate,
        homeTeam: {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          crest: match.homeTeam.crest,
        },
        awayTeam: {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          crest: match.awayTeam.crest,
        },
        score: match.score.fullTime, // Full-time score
      }));

      res.json({ success: true, data: matches });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch matches" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Fetch Matches for a Specific Competition and Matchday
router.get("/matches/:competitionCode", async (req, res) => {
  const { competitionCode } = req.params;
  const { matchday } = req.query; // Get matchday from query parameters

  try {
    const response = await axios.get(
      `${BASE_URL}/competitions/${competitionCode}/matches?matchday=${matchday}`,
      {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
      }
    );

    if (response.status === 200) {
      const matches = response.data.matches.map((match) => ({
        matchId: match.id,
        competition: response.data.competition.name, // Competition Name
        matchday: match.matchday,
        status: match.status,
        stage: match.stage,
        utcDate: match.utcDate,
        homeTeam: {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          crest: match.homeTeam.crest,
        },
        awayTeam: {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          crest: match.awayTeam.crest,
        },
        score: match.score.fullTime || { home: null, away: null }, // Ensure score object exists
      }));

      res.json({ success: true, data: matches });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch matches" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
//  Fetch Teams for a Specific Competition**
router.get("/teams/:competitionCode", async (req, res) => {
  const { competitionCode } = req.params;

  try {
    const response = await axios.get(`${BASE_URL}/competitions/${competitionCode}/teams`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY },
    });

    if (response.status === 200) {
      const teams = response.data.teams.map((team) => ({
        id: team.id,
        name: team.name,
        crest: team.crest,
        shortName: team.shortName,
        tla: team.tla,
        founded: team.founded,
        venue: team.venue,
      }));

      res.json({ success: true, data: teams });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch teams" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 🔹 Fetch Players (Squad) for a Specific Team ---To Be Changed to my Players latter 
router.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const response = await axios.get(`${BASE_URL}/teams/${teamId}`, {
      headers: { "X-Auth-Token": FOOTBALL_API_KEY },
    });

    if (response.status === 200) {
      const data = response.data;

      // Construct the full team information object
      const teamInfo = {
        id: data.id,
        name: data.name,
        shortName: data.shortName,
        tla: data.tla,
        crest: data.crest,
        country: data.area.name,
        countryFlag: data.area.flag,
        address: data.address,
        website: data.website,
        founded: data.founded,
        clubColors: data.clubColors,
        venue: data.venue,
        runningCompetitions: data.runningCompetitions.map((competition) => ({
          id: competition.id,
          name: competition.name,
          code: competition.code,
          type: competition.type,
          emblem: competition.emblem,
        })),
        coach: data.coach
          ? {
              id: data.coach.id,
              name: data.coach.name,
              nationality: data.coach.nationality,
              dateOfBirth: data.coach.dateOfBirth,
              contractStart: data.coach.contract?.start || "N/A",
              contractUntil: data.coach.contract?.until || "N/A",
            }
          : null,
        squad: data.squad.map((player) => ({
          id: player.id,
          name: player.name,
          position: player.position,
          nationality: player.nationality,
          dateOfBirth: player.dateOfBirth,
          shirtNumber: player.shirtNumber || "N/A",
        })),
      };

      res.json({ success: true, data: teamInfo });
    } else {
      res.status(response.status).json({ success: false, message: "Failed to fetch team data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;