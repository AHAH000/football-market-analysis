<template>
    <div class="teams-container">
      <h2>Teams in {{ selectedLeagueName }}</h2>
  
      <!-- League Selection Dropdown -->
      <div class="league-selector">
        <label for="league">Select League:</label>
        <select v-model="selectedLeague" @change="fetchTeams">
          <option v-for="league in leagues" :key="league.id" :value="league.id">
            {{ league.name }}
          </option>
        </select>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading teams...</div>
  
      <!-- Error State -->
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Teams List -->
      <div v-if="teams.length > 0" class="teams-list">
        <div v-for="team in teams" :key="team.id" class="team-card" @click="viewTeamProfile(team.id)">
          <div class="team-content">
            <!-- Front Side -->
            <div class="team-front">
              <img :src="team.crest" :alt="team.name" class="team-logo" />
              <h3>{{ team.name }}</h3>
            </div>
  
            <!-- Back Side -->
            <div class="team-back">
              <h3>{{ team.name }}</h3>
              <p><strong>Founded:</strong> {{ team.founded }}</p>
              <p><strong>Venue:</strong> {{ team.venue }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No Teams Found -->
      <div v-if="teams.length === 0 && !loading" class="no-teams">
        No teams found for the selected competition.
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        teams: [],
        selectedLeague: "PL", // Default selected league
        loading: false,
        error: null,
        leagues: [
          { id: "PL", name: "Premier League" },
          { id: "SA", name: "Serie A" },
          { id: "BL1", name: "Bundesliga" },
          { id: "PD", name: "La Liga" },
          { id: "FL1", name: "Ligue 1" },
          { id: "CL", name: "UEFA Champions League" },
        ],
      };
    },
    computed: {
      selectedLeagueName() {
        const league = this.leagues.find((l) => l.id === this.selectedLeague);
        return league ? league.name : "Selected League";
      },
    },
    methods: {
      async fetchTeams() {
        this.loading = true;
        this.error = null;
        this.teams = [];
  
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/football/teams/${this.selectedLeague}`
          );
  
          if (response.data.success) {
            this.teams = response.data.data;
          } else {
            this.error = "Failed to fetch teams.";
          }
        } catch (error) {
          this.error = error.response?.data?.message || "An error occurred.";
        } finally {
          this.loading = false;
        }
      },
  
      // 🔹 Navigate to TeamProfile.vue with teamId
      viewTeamProfile(teamId) {
        this.$router.push({ name: "TeamProfile", params: { teamId } });
      },
    },
    mounted() {
      this.fetchTeams();
    },
  };
  </script>
  
  <style scoped>
  /* Container */
  .teams-container {
    background: rgba(20, 20, 20, 0.95);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
    color: #00ff88;
    font-family: "Roboto", sans-serif;
    text-align: center;
    max-width: 1100px;
    width: 90%;
    margin: auto;
    transition: 0.3s;
    margin-top: 120px;
  }
  
  h2 {
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: #00ff88;
  }
  
  /* League Selector */
  .league-selector {
    margin-bottom: 20px;
  }
  
  .league-selector label {
    font-weight: bold;
    color: #00ff88;
  }
  
  .league-selector select {
    margin-left: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #00ff88;
    background: #121212;
    color: #00ff88;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .league-selector select:hover {
    background: #00ff88;
    color: #121212;
  }
  
  /* Teams List */
  .teams-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }
  
  /* Team Card */
  .team-card {
    background: #212121;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    perspective: 1000px;
  }
  
  .team-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 18px rgba(0, 255, 136, 0.5);
  }
  
  /* Flip Card Effect */
  .team-content {
    width: 100%;
    height: 220px;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    position: relative;
  }
  
  .team-card:hover .team-content {
    transform: rotateY(180deg);
  }
  
  /* Front and Back */
  .team-front, .team-back {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  /* Front Side */
  .team-front {
    background: #282828;
    text-align: center;
  }
  
  .team-logo {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  h3 {
    font-size: 1.3rem;
    color: #00ff88;
  }
  
  /* Back Side */
  .team-back {
    background: #1a1a1a;
    transform: rotateY(180deg);
    text-align: center;
    border-radius: 10px;
  }
  
  .team-back h3 {
    color: #00ff88;
    margin-bottom: 10px;
  }
  
  .team-back p {
    font-size: 1rem;
    color: #ccc;
  }
  
  /* Loading & Error Messages */
  .loading,
  .error,
  .no-teams {
    font-size: 1.2rem;
    margin: 20px 0;
  }
  
  .error {
    color: #ff4c4c;
  }
  </style>
  