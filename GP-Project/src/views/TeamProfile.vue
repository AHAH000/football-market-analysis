<template>
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
      <p>Fetching Team Data...</p>
    </div>

    <div v-else class="team-profile">
      <div class="team-container">
        <!-- Team Info Section (Left) -->
        <div class="team-cards-container">
          <!-- Team Info Card -->
          <div class="team-info-card">
            <img v-if="team.crest" :src="team.crest" :alt="team.name" class="team-logo" />
            <h2>{{ team.name }}</h2>
            <p><strong>Country:</strong> <img v-if="team.countryFlag" :src="team.countryFlag" class="flag-icon" /> {{ team.country }}</p>
            <p><strong>Founded:</strong> {{ team.founded }}</p>
            <p><strong>Club Colors:</strong> {{ team.clubColors }}</p>
            <p><strong>Venue:</strong> {{ team.venue }}</p>

            <!-- Competitions -->
            <div v-if="team.runningCompetitions.length > 0" class="competitions">
              <h3>Competitions</h3>
              <ul>
                <li v-for="comp in team.runningCompetitions" :key="comp.id">
                  <img v-if="comp.emblem" :src="comp.emblem" class="competition-icon" /> {{ comp.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Coach Info Card -->
          <div v-if="team.coach" class="coach-info-card">
            <h3>Manager</h3>
            <p><strong>Name:</strong> {{ team.coach.name }}</p>
            <p><strong>Nationality:</strong> {{ team.coach.nationality }}</p>
            <p><strong>Contract:</strong> {{ team.coach.contractStart }} - {{ team.coach.contractUntil }}</p>
          </div>
        </div>

        <!-- Players Table (Right) -->
        <div class="players-table-container">
          <h2>Squad</h2>

          <!-- Error State -->
          <div v-if="error" class="error">{{ error }}</div>

          <table v-if="players.length > 0" class="players-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in players" :key="player.id">
                <td>{{ player.name }}</td>
                <td>{{ player.position }}</td>
                <td>{{ player.nationality }}</td>
              </tr>
            </tbody>
          </table>

          <!-- No Players Found -->
          <div v-if="players.length === 0 && !loading" class="no-players">
            No players found for this team.
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      players: [],
      team: {
        name: "Loading...",
        crest: "",
        country: "",
        countryFlag: "",
        founded: "",
        clubColors: "",
        venue: "",
        runningCompetitions: [],
        coach: null,
      },
      teamId: null,
      loading: true, // Show loading screen initially
      error: null,
    };
  },
  methods: {
    async fetchTeamInfo() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/football/team/${this.teamId}`);
        if (response.data.success) {
          this.team = response.data.data;
          this.players = response.data.data.squad;
        }
      } catch (error) {
        console.error("Failed to fetch team info", error);
        this.error = "Failed to fetch team details.";
      } finally {
        this.loading = false; // Hide loading screen when done
      }
    },
  },
  mounted() {
    this.teamId = this.$route.params.teamId;
    console.log("Team ID from route:", this.teamId);
    this.fetchTeamInfo();
  },
};
</script>

<style scoped>
/* 🔹 Full Page Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 18, 18, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: #00ff88;
  font-size: 1.5rem;
}

/* 🔹 Spinner Animation */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid transparent;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.team-profile {
  background: rgba(30, 30, 30, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #00ff88;
  font-family: "Roboto", sans-serif;
  max-width: 1200px;
  width: 90%;
  margin: auto;
  margin-top: 150px;
}

.team-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* Container for Team Info and Coach */
.team-cards-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Team Info Card */
.team-info-card {
  background: #212121;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  box-shadow: 0 5px 10px rgba(0, 255, 136, 0.5);
}

.team-logo {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.flag-icon {
  width: 30px;
  height: 20px;
  margin-right: 5px;
}

/* Competitions */
.competitions {
  margin-top: 15px;
}

.competitions ul {
  list-style: none;
  padding: 0;
}

.competitions li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.competition-icon {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #ffffff;
  padding: 5px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2);
  display: inline-block;
  margin-bottom: 10px;
}

/* Coach Info Card */
.coach-info-card {
  background: #333;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  box-shadow: 0 5px 10px rgba(255, 255, 255, 0.3);
}

.coach-info-card h3 {
  color: #00ff88;
  margin-bottom: 10px;
}

/* Players Table */
.players-table-container {
  flex-grow: 1;
}

.players-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #212121;
  color: #00ff88;
  border-radius: 10px;
}

.players-table th, .players-table td {
  padding: 12px;
  border-bottom: 1px solid #00ff88;
  text-align: center;
}

.players-table th {
  background-color: #333;
  font-weight: bold;
}

.players-table tr:hover {
  background: #444;
}
</style>
