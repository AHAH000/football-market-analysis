<template>
  <div class="league-standings">
    <h1>League Standings</h1>

    <!-- League Logo -->
    <div v-if="leagueLogos[currentLeague]" class="league-logo-container">
      <img :src="leagueLogos[currentLeague]" alt="League Logo" />
    </div>

    <!-- League Selection Dropdown -->
    <div v-if="!leagueId" class="league-selector">
      <label for="leagueCode">Select League:</label>
      <select id="leagueCode" v-model="selectedLeague" @change="updateLeague">
        <option v-for="(logo, code) in leagueLogos" :key="code" :value="code">
          {{ leagueNames[code] || code }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">Loading league standings...</div>

    <!-- Error State -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- League Standings Table -->
    <div v-if="standings.length > 0" class="standings-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in visibleStandings" :key="team.team.id">
            <td :class="{ relegated: isRelegated(index) }">{{ team.position }}</td>
            <td class="team-info">
              <img :src="team.team.crest" :alt="team.team.name" class="team-logo" />
              <router-link :to="'/TeamProfile/' + team.team.id" class="team-link">
                {{ team.team.shortName }}
              </router-link>
            </td>
            <td>{{ team.playedGames }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.draw }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.points }}</td>
          </tr>
        </tbody>
      </table>

      <!-- See More / Show Less Button -->
      <button v-if="standings.length > 10" @click="showAll = !showAll" class="see-more">
        {{ showAll ? "Show Less" : "See More" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    leagueId: {
      type: String,
      default: null, // If null, use dropdown selection
    },
  },
  data() {
    return {
      selectedLeague: "PL", // Default league selection
      standings: [],
      loading: false,
      error: null,
      showAll: false,
      leagueLogos: {
        PL: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        SA: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/210px-Serie_A_ENILIVE_logo.svg.png",
        BL1: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
        PD: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/360px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png",
        FL1: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Ligue_1_2024.svg/255px-Ligue_1_2024.svg.png",
        CL: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/UEFA_Champions_League.svg/360px-UEFA_Champions_League.svg.png",
      },
      leagueNames: {
        PL: "Premier League",
        SA: "Serie A",
        BL1: "Bundesliga",
        PD: "La Liga",
        FL1: "Ligue 1",
        CL: "UEFA Champions League",
      },
    };
  },
  computed: {
    currentLeague() {
      return this.leagueId || this.selectedLeague;
    },
    visibleStandings() {
      return this.showAll ? this.standings : this.standings.slice(0, 10);
    },
  },
  methods: {
    async fetchStandings() {
      if (!this.currentLeague) return;

      this.loading = true;
      this.error = null;
      this.standings = [];
      this.showAll = false;

      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/table/${this.currentLeague}`;
        const response = await axios.get(apiUrl);

        if (response.data.success) {
          this.standings = response.data.data;
        } else {
          this.error = "Failed to fetch standings. Please try again.";
        }
      } catch (error) {
        this.error = error.message || "An error occurred while fetching data.";
      } finally {
        this.loading = false;
      }
    },
    updateLeague() {
      this.fetchStandings();
    },
    isRelegated(index) {
      return this.showAll && index >= this.standings.length - 3;
    },
  },
  watch: {
    currentLeague: "fetchStandings",
  },
  mounted() {
    this.fetchStandings();
  },
};
</script>

---

## **🔹 Updated CSS for Better Hyperlinks & Styling**
```vue
<style scoped>
/* Main Container */
.league-standings {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background-color: #181818;
  color: #00ff88;
  font-family: "Roboto", sans-serif;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* League Title */
h1 {
  text-align: center;
  margin-bottom: 15px;
}

/* League Logo */
.league-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d5d0d0;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.league-logo-container img {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
}

/* Team Info */
.team-info {
  display: flex;
  align-items: center;
}

.team-logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

/* Hyperlink for Team */
.team-link {
  text-decoration: none;
  color: #00ff88;
  font-weight: bold;
  transition: color 0.3s ease-in-out;
}

.team-link:hover {
  color: #00cc66;
  text-decoration: underline;
}

/* Standings Table */
.standings-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #212121;
  color: #00ff88;
  border-radius: 10px;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  font-size: 0.9rem;
}

table th {
  background-color: #333333;
  font-weight: bold;
}

table tr:nth-child(even) {
  background-color: #2a2a2a;
}

table td.relegated {
  background-color: #8b0000;
  color: #fff;
  font-weight: bold;
}

table tr:hover {
  background-color: #3d3d3d;
}

/* See More Button */
.see-more {
  display: block;
  margin: 15px auto;
  padding: 8px 15px;
  background-color: #2c2c2c;
  color: #00ff88;
  border: 1px solid #00ff88;
  border-radius: 5px;
  cursor: pointer;
}

.see-more:hover {
  background-color: #00ff88;
  color: #181818;
}
/* League Selector */
.league-selector {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #00ff88;
  font-weight: bold;
}

/* Label Styling */
.league-selector label {
  margin-right: 10px;
  font-weight: bold;
  color: #00ff88;
}

/* Dropdown Styling */
.league-selector select {
  padding: 8px 12px;
  background-color: #212121;  /* Match table background */
  color: #00ff88;
  border: 2px solid #00ff88;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

/* Hover and Focus Effect */
.league-selector select:hover,
.league-selector select:focus {
  border-color: #00cc66;
  background-color: #2a2a2a;
}

/* Ensure dropdown aligns properly */
@media (max-width: 768px) {
  .league-selector {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .league-selector select {
    width: 100%;
    max-width: 250px;
  }
}

</style>
