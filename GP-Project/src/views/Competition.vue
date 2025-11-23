<template>
    <div class="competition-container">
      <h1>Competition Overview</h1>
  
      <!-- League Selection Dropdown -->
      <div class="league-selector">
        <label for="league">Select League:</label>
        <select v-model="selectedLeague">
          <option v-for="league in leagues" :key="league.id" :value="league.id">
            {{ league.name }}
          </option>
        </select>
      </div>
  
      <!-- Flex Container for Standings & Top Goal Scorers -->
      <div class="standings-goals-container" v-if="selectedLeague">
        <!-- League Standings (Left) -->
        <LeagueStandings :league-id="selectedLeague" class="standings" />
  
        <!-- Top Goal Scorers (Right) -->
        <TopGoalScoccer :league-id="selectedLeague" class="goal-scorers" />
      </div>
      <LeagueUpcomingMatches v-if="selectedLeague" :league-id="selectedLeague" class="upcoming-matches" />
  
      <!-- Top 5 Teams Section (Below) -->
      <Top5Section v-if="mappedTop5League" :league-id="mappedTop5League" class="top-5" />
    </div>
  </template>
  
  <script>
  import LeagueStandings from "@/components/LeagueStandings.vue";
  import Top5Section from "@/components/Top5Section.vue";
  import TopGoalScoccer from "@/components/TopGoalScoccer.vue";
  import LeagueUpcomingMatches from "@/components/LeagueUpcomingMatches.vue";
  
  export default {
    components: {
      LeagueStandings,
      Top5Section,
      TopGoalScoccer,
      LeagueUpcomingMatches
    },
    data() {
      return {
        leagues: [
          { id: "PL", name: "Premier League" },
          { id: "SA", name: "Serie A" },
          { id: "BL1", name: "Bundesliga" },
          { id: "PD", name: "La Liga" },
          { id: "FL1", name: "Ligue 1" },
          { id: "CL", name: "UEFA Champions League" },
        ],
        selectedLeague: "PL", // Default selected league
        leagueMapping: {
          PL: "GB1", // Premier League → GB1
          FL1: "FR1", // Ligue 1 → FR1
          PD: "ES1", // La Liga → ES1
          SA: "IT1", // Serie A → IT1
          BL1: "L1", // Bundesliga → L1
        },
      };
    },
    computed: {
      mappedTop5League() {
        return this.leagueMapping[this.selectedLeague] || null;
      },
    },
    watch: {
      selectedLeague(newLeague) {
        console.log("League switched to:", newLeague);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Main Container */
  .competition-container {
    width: 90%;
    max-width: 1400px;
    margin: auto;
    padding: 20px;
    background: rgba(24, 24, 24, 0.9);
    backdrop-filter: blur(10px);
    color: #00ff88;
    font-family: "Roboto", sans-serif;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    padding-top: 75px;
  }
  
  /* Title */
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  /* League Selector */
  .league-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .league-selector label {
    font-size: 1.4rem;
    margin-right: 15px;
    font-weight: bold;
  }
  
  .league-selector select {
    font-size: 1.2rem;
    padding: 10px 15px;
    border-radius: 8px;
    background: #222;
    color: #00ff88;
    border: 2px solid #00ff88;
    cursor: pointer;
    width: 300px;
    text-align: center;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .league-selector select:hover {
    background: #333;
  }
  
  /* Standings & Goal Scorers Side-by-Side */
  .standings-goals-container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    width: 100%;
  }
  
  /* Left - League Standings */
  .standings {
    width: 50%;
    background: rgba(30, 30, 30, 0.95);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  /* Right - Top Goal Scorers */
  .goal-scorers {
    width: 50%;
    background: rgba(30, 30, 30, 0.95);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  /* Top 5 Section - Full Width Below */
  .top-5 {
    width: 100%;
    margin-top: 30px;
    background: rgba(20, 20, 20, 0.95);
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .standings-goals-container {
      flex-direction: column;
      align-items: center;
    }
  
    .standings,
    .goal-scorers {
      width: 100%;
    }
  
    .league-selector select {
      width: 100%;
      max-width: 350px;
    }
  }
  </style>
  