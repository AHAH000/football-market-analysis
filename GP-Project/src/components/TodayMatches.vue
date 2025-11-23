<template>
    <div class="today-matches">
      <h1>Today's Football Matches</h1>
  
      <div v-if="loading" class="loading">Loading matches...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <div v-if="Object.keys(groupedMatches).length > 0">
        <div v-for="(matches, competition) in groupedMatches" :key="competition" class="competition-section">
          <div class="competition-header">
            <img :src="matches[0].competition.emblem" :alt="competition" class="competition-logo" />
            <h2>{{ competition }}</h2>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Status</th>
                <th>Kick-off (UTC)</th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="match in matches" :key="match.id">
                  <!-- Home Team -->
                  <td @click="selectTeam(match.homeTeam.id)" class="clickable">
                    <div class="team-cell">
                      <img :src="match.homeTeam.crest" :alt="match.homeTeam.name" class="team-logo" />
                      <span>{{ match.homeTeam.name }}</span>
                    </div>
                  </td>
              
                  <!-- Away Team -->
                  <td @click="selectTeam(match.awayTeam.id)" class="clickable">
                    <div class="team-cell">
                      <img :src="match.awayTeam.crest" :alt="match.awayTeam.name" class="team-logo" />
                      <span>{{ match.awayTeam.name }}</span>
                    </div>
                  </td>
              
                  <td>{{ match.status }}</td>
                  <td>{{ formatTime(match.utcDate) }}</td>
                </tr>
              </tbody>              
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        matches: [],
        groupedMatches: {},
        loading: false,
        error: null,
      };
    },
    methods: {
      async fetchTodayMatches() {
        this.loading = true;
        this.error = null;
        this.matches = [];
        this.groupedMatches = {};
  
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/football/matches/today`;
          const response = await axios.get(apiUrl);
  
          if (response.data.success) {
            this.matches = response.data.matches;
            this.groupMatchesByCompetition(response.data.matches);
          } else {
            this.error = "Failed to fetch matches. Please try again.";
          }
        } catch (error) {
          this.error = error.message || "An error occurred while fetching matches.";
        } finally {
          this.loading = false;
        }
      },
      groupMatchesByCompetition(matches) {
        const grouped = {};
  
        matches.forEach((match) => {
          const compName = match.competition.name;
          if (!grouped[compName]) {
            grouped[compName] = [];
          }
          grouped[compName].push(match);
        });
  
        this.groupedMatches = grouped;
      },
      formatTime(utcDate) {
        const date = new Date(utcDate);
        return date.toUTCString().split(" ")[4];
      },
      selectTeam(teamId) {
        console.log("Selected team ID:", teamId); // Debugging Log
        localStorage.setItem("selectedTeamId", teamId); // Store teamId in localStorage
        this.$router.push(`/upcoming-matches/${teamId}`); // Navigate to UpcomingMatches.vue
      },
    },
    mounted() {
      this.fetchTodayMatches();
    },
  };
  </script>
  
  
  <style scoped>
  /* Main Container */
/* Main Container */
.today-matches {
    padding: 20px;
    max-width: 1000px;
    margin: auto;
   background: rgba(24, 24, 24, 0.9); /* Glassmorphism */
    backdrop-filter: blur(10px);
    color: #00ff88;
    font-family: "Roboto", sans-serif;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 255, 0, 0.3);
    text-align: center; /* Center all content */
  }
  
  /* Title */
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #00ff88;
    text-shadow: 0 2px 10px rgba(0, 255, 0, 0.6);
    font-size: 2rem;
    font-weight: bold;
  }
  
  /* Loading & Error */
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
  
  /* Competition Section */
  .competition-section {
    margin-bottom: 30px;
    background: rgba(34, 34, 34, 0.95);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 255, 0, 0.3);
  }
  
  /* Competition Header */
  .competition-header {
    display: flex;
    align-items: center;
    justify-content: center; /* Center content */
    gap: 10px;
    background: #2b2b2b;
    padding: 12px;
    border-radius: 8px;
    box-shadow: inset 0px 0px 8px rgba(0, 255, 0, 0.4);
  }
  
  .competition-header h2 {
    color: #00ff88;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
  }
  
  /* Competition Logo */
  .competition-logo {
    width: 50px;
    height: 50px;
  }
  
  /* Matches Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background: rgba(34, 34, 34, 0.95);
    color: #00ff88;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 255, 0, 0.3);
  }
  
  /* Table Header */
  th {
    background-color: #333;
    font-weight: bold;
    padding: 12px;
    text-align: center;
    font-size: 1.1rem;
    color: #00ff88;
  }
  
  /* Table Cells */
  td {
    padding: 12px;
    text-align: center; /* Center text in table cells */
    vertical-align: middle;
    font-size: 1rem;
  }
  
  /* Match Row Hover */
  tr {
    transition: 0.3s ease;
  }
  
  tr:hover {
    background: #444;
  }
  
  /* Team Logos */
  .team-logo {
    width: 35px;
    height: 35px;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  /* Clickable Team Names */
  .clickable {
    cursor: pointer;
    transition: 0.3s;
    font-weight: bold;
  }
  
  .clickable:hover {
    color: #00ff88;
    text-decoration: underline;
  }
  
  /* Responsive Styles */
  @media (max-width: 600px) {
    th {
      padding: 8px;
      font-size: 0.9rem;
    }
  }
  /* Table Cells - Center Content */
td {
    padding: 12px;
  text-align: center;
  vertical-align: middle;
  font-size: 1rem;
  height: 50px; /* Ensures all rows have the same height */
  }
  
  /* Team Name with Logo - Flexbox */
  .team-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8x; /* Space between logo and text */
    font-weight: bold;
  }
  
  /* Team Logos */
  .team-logo {
    width: 35px; /* Adjust logo size */
    height: 35px;
    object-fit: contain; /* Optional: rounded logos */
  }
  
  /* Clickable Team Names */
  .clickable {
    cursor: pointer;
    transition: 0.3s;
    font-weight: bold;
  }
  
  .clickable:hover {
    color: #00ff88;
    text-decoration: underline;
  }
  
  
  </style>
  