<template>
  <div class="top-scorers">
    <h1>Top Goal Scorers</h1>

    <!-- League Logo -->
    <div v-if="leagueLogos[currentLeague]" class="league-logo-container">
      <div class="league-logo">
        <img :src="leagueLogos[currentLeague]" alt="League Logo" />
      </div>
    </div>

    <!-- League Selection Dropdown (Only Show If No Prop is Passed) -->
    <div v-if="!leagueId" class="league-selector">
      <label for="leagueCode">Select League:</label>
      <select id="leagueCode" v-model="selectedLeague" @change="updateLeague">
        <option value="PL">Premier League</option>
        <option value="SA">Serie A</option>
        <option value="BL1">Bundesliga</option>
        <option value="PD">La Liga</option>
        <option value="FL1">Ligue 1</option>
        <option value="CL">UEFA Champions League</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">Loading top scorers...</div>

    <!-- Error State -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Top Scorers Table -->
    <div v-if="topScorers.length > 0" class="scorers-table">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Matches Played</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="scorer in topScorers" :key="scorer.player">
            <td>{{ scorer.player }}</td>
            <td>{{ scorer.team }}</td>
            <td>{{ scorer.goals }}</td>
            <td>{{ scorer.assists || "0" }}</td>
            <td>{{ scorer.playedMatches }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    leagueId: {
      type: String,
      default: null, // If null, dropdown selection will be used
    },
  },
  data() {
    return {
      selectedLeague: "PL", // Default league for manual selection
      topScorers: [],
      loading: false,
      error: null,
      leagueLogos: {
        PL: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        SA: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/210px-Serie_A_ENILIVE_logo.svg.png",
        BL1: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
        PD: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/360px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png",
        FL1: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Ligue_1_2024.svg/255px-Ligue_1_2024.svg.png",
        CL: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/UEFA_Champions_League.svg/360px-UEFA_Champions_League.svg.png",
      },
    };
  },
  computed: {
    currentLeague() {
      return this.leagueId || this.selectedLeague; // Use prop if available, otherwise use dropdown selection
    },
  },
  methods: {
    async fetchTopScorers() {
      if (!this.currentLeague) return; // Prevent API call if league is missing

      this.loading = true;
      this.error = null;
      this.topScorers = [];

      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/football/top-scorers/${this.currentLeague}`;
        const response = await axios.get(apiUrl);

        if (response.data.success) {
          this.topScorers = response.data.data;
        } else {
          this.error = "Failed to fetch data. Please try again.";
        }
      } catch (error) {
        this.error = error.message || "An error occurred while fetching data.";
      } finally {
        this.loading = false;
      }
    },
    updateLeague() {
      this.fetchTopScorers();
    },
  },
  watch: {
    currentLeague: "fetchTopScorers", // Fetch data when league changes (either from prop or dropdown)
  },
  mounted() {
    this.fetchTopScorers();
  },
};
</script>


<style scoped>
/* Color Scheme: Dark with Green Accents */
.top-scorers {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background-color: #181818;
  color: #00ff88;
  font-family: "Roboto", sans-serif;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.league-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #afafaf; /* Slightly brighter background for the logo container */
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.league-logo img {
  max-width: 150px;
  max-height: 100px;
  object-fit: contain;
}

.league-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.league-selector label {
  margin-right: 10px;
  font-weight: bold;
}

.league-selector select {
  padding: 8px 12px;
  background-color: #2c2c2c;
  color: #00ff88;
  border: 1px solid #00ff88;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
}

.loading,
.error {
  text-align: center;
  font-size: 1.2rem;
  margin: 20px 0;
}

.error {
  color: #ff4c4c;
}

.scorers-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #212121;
  color: #00ff88;
  border-radius: 10px;
  overflow: hidden;
}

table th,
table td {
  padding: 12px;
  text-align: left;
}

table th {
  background-color: #333333;
  font-weight: bold;
}

table tr:nth-child(even) {
  background-color: #2a2a2a;
}

table tr:hover {
  background-color: #3d3d3d;
}

@media (max-width: 600px) {
  .league-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .league-selector label {
    margin-bottom: 5px;
  }

  table th,
  table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>
