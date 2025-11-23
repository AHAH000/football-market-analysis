<template>
    <div class="upcoming-matches">
      <h1>Upcoming Matches</h1>
  
      <div v-if="loading" class="loading">Loading upcoming matches...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <div v-if="matches.length > 0">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Competition</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in matches" :key="match.id">
              <td>{{ formatDate(match.utcDate) }}</td>
              <td>
                <img :src="match.homeTeam.crest" :alt="match.homeTeam.name" class="team-logo" />
                {{ match.homeTeam.name }}
              </td>
              <td>
                <img :src="match.awayTeam.crest" :alt="match.awayTeam.name" class="team-logo" />
                {{ match.awayTeam.name }}
              </td>
              <td>{{ match.competition }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="matches.length === 0 && !loading" class="no-matches">
        No upcoming matches found.
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        matches: [],
        loading: false,
        error: null,
        teamId: null,
      };
    },
    methods: {
      async fetchUpcomingMatches() {
        this.loading = true;
        this.error = null;
        this.matches = [];
  
        console.log("teamId from route params:", this.$route.params.teamId);
  
        this.teamId = this.$route.params.teamId || localStorage.getItem("selectedTeamId");
  
        if (!this.teamId) {
          this.error = "Invalid team ID.";
          this.loading = false;
          return;
        }
  
        console.log("Fetching upcoming matches for team ID:", this.teamId);
  
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/football/upcoming-matches/${this.teamId}`;
          const response = await axios.get(apiUrl);
  
          if (response.data.success) {
            this.matches = response.data.matches;
          } else {
            this.error = "Failed to fetch upcoming matches.";
          }
        } catch (error) {
          this.error = error.response?.data?.error || "An error occurred while fetching upcoming matches.";
        } finally {
          this.loading = false;
        }
      },
      formatDate(utcDate) {
        const date = new Date(utcDate);
        return date.toDateString() + " " + date.toUTCString().split(" ")[4];
      },
    },
    watch: {
      "$route.params.teamId": "fetchUpcomingMatches",
    },
    mounted() {
      this.fetchUpcomingMatches();
    },
  };
  </script>
  
  
  <style scoped>
  .upcoming-matches {
    padding: 20px;
    max-width: 1200px; /* Increased width */
    width: 90%;
    margin: auto;
    background: rgba(24, 24, 24, 0.8);
    backdrop-filter: blur(10px);
    color: #00ff88;
    font-family: "Roboto", sans-serif;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    padding-top: 135px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .loading,
  .error,
  .no-matches {
    text-align: center;
    font-size: 1.2rem;
    margin: 20px 0;
  }
  
  .error {
    color: #ff4c4c;
  }
  
  table {
    width: 100%;
    table-layout: fixed; /* Keeps columns evenly spaced */
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    width: 25%;
    white-space: nowrap; /* Prevents text from wrapping */
  }
  
  th {
    background-color: #333;
    font-weight: bold;
  }
  
  tr {
    transition: 0.3s ease;
  }
  
  tr:hover {
    background: #444;
  }
  
  .team-logo {
    width: 40px; /* Increased size */
    height: 40px;
    vertical-align: middle;
    margin-right: 10px;
  }
  
  @media (max-width: 768px) {
    .upcoming-matches {
      max-width: 95%;
    }
  
    table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
  
    th, td {
      padding: 10px;
      font-size: 14px;
    }
  
    .team-logo {
      width: 30px;
      height: 30px;
    }
  }
  </style>
