<template>
  <div class="upcoming-matches">
      <h2>Upcoming Matches</h2>

      <!-- Matchday Selection -->
      <div class="matchday-selector" v-if="matchdays.length > 0">
          <label for="matchday">Select Matchday:</label>
          <select id="matchday" v-model="matchday">
              <option v-for="day in matchdays" :key="day" :value="day">
                  Matchday {{ day }}
              </option>
          </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading upcoming matches...</div>

      <!-- Error State -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Matches Table -->
      <div v-if="filteredMatches.length > 0" class="matches-table">
          <table>
              <thead>
                  <tr>
                      <th class="date-col">Date</th>
                      <th class="team-col">Team</th>
                      <th class="status-col">Status</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(match, index) in visibleMatches" :key="match.matchId">
                      <td class="match-date">{{ formatDate(match.utcDate) }}</td>
                      <td class="team">
                          <div class="team-container">
                              <img :src="match.homeTeam.crest" :alt="match.homeTeam.name" class="team-logo" />
                              <span class="team-name">{{ match.homeTeam.name }}</span>
                          </div>
                      </td>
                      <td class="team">
                          <div class="team-container">
                              <img :src="match.awayTeam.crest" :alt="match.awayTeam.name" class="team-logo" />
                              <span class="team-name">{{ match.awayTeam.name }}</span>
                          </div>
                      </td>
                      <td class="status">{{ match.status }}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      <!-- Show More / Show Less Buttons -->
      <div class="toggle-buttons" v-if="filteredMatches.length > defaultVisibleMatches">
          <button v-if="visibleMatches.length < filteredMatches.length" @click="showMoreMatches">Show More</button>
          <button v-if="visibleMatches.length > defaultVisibleMatches" @click="showLessMatches">Show Less</button>
      </div>

      <!-- No Matches Found -->
      <div v-if="filteredMatches.length === 0 && !loading" class="no-matches">
          No matches found for the selected matchday.
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
      leagueId: {
          type: String,
          required: true,
      },
  },
  data() {
      return {
          matches: [],
          matchday: null,
          matchdays: [],
          loading: false,
          error: null,
          defaultVisibleMatches: 5, // Number of matches initially displayed
          visibleMatchesCount: 5, // Dynamic count for showing more/less
      };
  },
  computed: {
      filteredMatches() {
          return this.matches.filter((match) => match.matchday === this.matchday);
      },
      visibleMatches() {
          return this.filteredMatches.slice(0, this.visibleMatchesCount);
      },
  },
  methods: {
      async fetchUpcomingMatches() {
          if (!this.leagueId) return;

          this.loading = true;
          this.error = null;
          this.matches = [];
          this.matchdays = [];

          try {
              const response = await axios.get(
                  `${import.meta.env.VITE_API_BASE_URL}/api/football/matches/${this.leagueId}`
              );

              if (response.data.success) {
                  this.matches = response.data.data;

                  // Extract unique matchdays and set the default
                  this.matchdays = [...new Set(this.matches.map((match) => match.matchday))].sort((a, b) => a - b);
                  this.matchday = this.matchdays[0] || null;
              } else {
                  this.error = "Failed to fetch upcoming matches.";
              }
          } catch (error) {
              this.error = error.response?.data?.message || "An error occurred.";
          } finally {
              this.loading = false;
          }
      },
      showMoreMatches() {
          this.visibleMatchesCount += 5; // Load 5 more matches
      },
      showLessMatches() {
          this.visibleMatchesCount = this.defaultVisibleMatches; // Reset to default number of matches
      },
      formatDate(utcDate) {
          const date = new Date(utcDate);
          return date.toDateString() + " " + date.toTimeString().split(" ")[0];
      },
  },
  watch: {
      leagueId: "fetchUpcomingMatches",
  },
  mounted() {
      this.fetchUpcomingMatches();
  },
};
</script>

<style scoped>
.upcoming-matches {
  background: rgba(30, 30, 30, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #00ff88;
  font-family: "Roboto", sans-serif;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #00ff88;
}

.loading,
.error,
.no-matches {
  font-size: 1.2rem;
  margin: 20px 0;
}

.error {
  color: #ff4c4c;
}

.matches-table {
  overflow-x: auto;
}

/* Ensure equal column spacing */
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: #212121;
  color: #00ff88;
  border-radius: 10px;
  overflow: hidden;
}

/* Table Header */
th {
  background-color: #333;
  font-weight: bold;
  color: #00ff88;
  padding: 14px;
  text-align: center;
}

/* Columns Width */
.date-col {
  width: 20%;
}

.team-col {
  width: 30%;
}

.status-col {
  width: 20%;
}

/* Table Body */
td {
  padding: 14px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  vertical-align: middle;
}

/* Match Date */
.match-date {
  font-size: 1rem;
  color: #00ff88;
  font-weight: bold;
  text-align: center;
}

/* Align Team Logos and Names */
.team {
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
}

/* Team Logo */
.team-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* Team Name */
.team-name {
  font-weight: bold;
  color: #00ff88;
  font-size: 1rem;
  text-align: left;
  white-space: nowrap;
}

/* Match Status */
.status {
  font-size: 1rem;
  color: #00ff88;
}

/* Hover Effect */
tr {
  transition: 0.3s ease;
}

tr:hover {
  background: #444;
}

/* Matchday Selector */
.matchday-selector {
  margin-bottom: 15px;
}

.matchday-selector label {
  font-weight: bold;
  color: #00ff88;
}

.matchday-selector select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #00ff88;
  background: #212121;
  color: #00ff88;
}

/* Show More & Show Less Buttons */
.toggle-buttons {
  margin-top: 15px;
}

button {
  background-color: #00ff88;
  color: #121212;
  font-size: 1.2rem;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin: 5px;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #00cc66;
}
</style>
