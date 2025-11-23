<template>
  <div class="player-stats-wrapper">
    <!-- Player Container -->
    <div class="player-container">
      <div v-if="player" class="player-content">
        <div class="player-header">
          <div class="player-image-wrapper">
            <img :src="player.image_url" alt="Player Image" class="player-image" />
          </div>
          <div class="player-basic-info">
            <h1 class="player-name">{{ player.Name }}</h1>

            <!-- Player Jersey Number -->
            <div class="jersey-number" v-if="playerJerseyNumber">
              #{{ playerJerseyNumber }}
            </div>
            <!-- Club Info Section -->


            <div v-if="playerClubProfile && playerClubProfile.name" class="club-info">
              <!-- Club Logo -->
              <div class="club-logo-container" v-if="playerClubProfile.url">
                <img :src="playerClubProfile.url" alt="Club Logo" class="club-logo" />
              </div>
              <strong>Club: </strong> {{ playerClubProfile.name }}



              <!-- Stadium Name -->
              <p class="club-stadium">
                <strong>Stadium: </strong>
                {{ playerClubProfile.stadiumName !== "Unknown Stadium" ? playerClubProfile.stadiumName : "Not Available"
                }}
              </p>
            </div>


            <div class="flag-container">
              <CountryFlag v-if="getCountryCode(player.country_of_citizenship)"
                :country="getCountryCode(player.country_of_citizenship)" class="country-flag" />
              <span class="country-name">{{ player.country_of_citizenship }}</span>
            </div>
            <p class="player-info">
              <span class="player-age">Age: {{ player.age }}</span>
            </p>
            <p class="player-position">
              <i :class="getPositionIcon(player.sub_position)"></i>
              {{ player.sub_position }}
            </p>
          </div>
        </div>

        <div class="divider"></div>

        <div class="main-content">
          <div class="details-market-container">
            <div class="player-details">
              <h2 class="section-title">Player Details</h2>
              <ul>
                <li><strong>Height:</strong> {{ player.height_in_cm }} cm</li>
                <li><strong>Preferred Foot:</strong> {{ player.foot }}</li>
                <li><strong>Current Club:</strong> {{ player.current_club_name }}</li>
                <li><strong>Contract Expiry:</strong> {{ player.contract_expiration_date }}</li>
                <li><strong>Agent:</strong> {{ player.agent_name }}</li>
              </ul>
              <PlayerExtras :playerId="player.player_id" />

            </div>

            <div class="market-value">
              <h2 class="section-title">Market Value</h2>
              <p class="market-value-text" :class="currentValueClass" @click="showMarketDetails">
                <span v-if="isValueUp">▲</span>
                <span v-else>▼</span>
                €{{ formatCurrency(player.XGBoost_predicted_values ?? player.market_value_in_eur) }}
              </p>
              <p class="highest-market-value">
                Highest Value: €{{ formatCurrency(player.highest_market_value_in_eur) }}
              </p>
            </div>
          </div>
        </div>
      
      </div>
      <div v-else class="loading">
        <p>Loading player data...</p>
      </div>
    </div>
    <ReturnOnInvestment
    v-if="player && player.player_id && latestTransferFee !== null && currentMarketValue !== null"
    :playerId="player.player_id" :currentMarketValue="player.XGBoost_predicted_values"
    :latestTransferFee="latestTransferFee" />
    <!-- Player Stats Card -->
    <div class="player-stats-container">
      <h2 class="section-title">Player Stats</h2>
      <select v-model="selectedSeason" @change="filterStatsBySeason" class="season-dropdown">
        <option v-for="season in availableSeasons" :key="season" :value="season">
          {{ season }}
        </option>
      </select>

      <div v-if="groupedStats[selectedSeason]">
        <div v-for="(stat, index) in groupedStats[selectedSeason]" :key="index" class="stat-table-container">
          <h3 class="competition-name">{{ stat.competitionName }}</h3>
          <table class="stats-table">
            <thead>
              <tr>
                <th>Appearances</th>
                <th>Goals</th>
                <th>Assists</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ stat.appearances || 0 }}</td>
                <td>{{ stat.goals || 0 }}</td>
                <td>{{ stat.assists || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-else>No stats available for this season.</p>
    </div>
  </div>
  <!--Player Transfer History Here-->
  <div class="player-transfers-container" v-if="playerTransferHistory.length">
    <h2 class="section-title">🔄 Transfer History</h2>
    <div class="transfer-list">
      <div v-for="(transfer, index) in playerTransferHistory" :key="index" class="transfer-item">
        <div class="transfer-header">
          <span class="transfer-date">{{ transfer.date }}</span>
          <span class="transfer-season">Season: {{ transfer.season }}</span>
        </div>
        <div class="transfer-clubs">
          <span class="club-name from-club">{{ transfer.clubFrom.name }}</span>
          <span class="transfer-arrow">➡</span>
          <span class="club-name to-club">{{ transfer.clubTo.name }}</span>
        </div>
        <div class="transfer-details">
          <p v-if="transfer.marketValue"><strong>Market Value:</strong> €{{ transfer.marketValue.toLocaleString() }}</p>
          <p v-if="transfer.fee"><strong>Transfer Fee:</strong> €{{ transfer.fee.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
  <MarketValueOverTime v-if="player?.player_id" :playerId="player.player_id" />

  <!-- Container for Injuries & Achievements -->
  <div class="injury-achievement-container">
    <!-- Player Injuries Card -->
    <div class="player-injuries-container" v-if="playerInjuries.length">
      <h2 class="section-title">🚑 Injury History</h2>
      <table class="injuries-table">
        <thead>
          <tr>
            <th>Season</th>
            <th>Injury</th>
            <th>From</th>
            <th>Until</th>
            <th>Days Out</th>
            <th>Games Missed</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(injury, index) in playerInjuries" :key="index">
            <td>{{ injury.season }}</td>
            <td>{{ injury.injury }}</td>
            <td>{{ injury.fromDate }}</td>
            <td>{{ injury.untilDate }}</td>
            <td>{{ injury.days }}</td>
            <td>{{ injury.gamesMissed }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Player Achievements Card -->
    <div class="player-achievements-container" v-if="playerAchievements.length">
      <h2 class="section-title">🏆 Achievements</h2>
      <ul class="achievements-list">
        <li v-for="(achievement, index) in playerAchievements" :key="index" class="achievement-item">
          <strong>{{ achievement.title }}</strong> ({{ achievement.count }})
          <ul class="achievement-details">
            <li v-for="(detail, dIndex) in achievement.details" :key="dIndex">
              <span v-if="detail.club">⚽ {{ detail.club.name }} - </span>
              <span v-if="detail.competition">🏆 {{ detail.competition.name }} - </span>
              <span class="achievement-season">{{ detail.season.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <MarketValuePopup :isOpen="isMarketPopupOpen" :marketValue="player?.market_value_in_eur"
    :xgboostPrediction="player?.XGBoost_predicted_values" :rftPrediction="player?.RFT_predicted_values"
    @close="closeMarketDetails" />
  
<SimilarPlayers v-if="player?.player_id" :playerId="player.player_id" />



</template>



<script>
import { useRoute } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import CountryFlag from "vue-country-flag-next";
import iso31661 from "iso-3166-1";
import MarketValuePopup from "@/components/MarketValuePopup.vue";
import { nextTick } from "vue"; // Import nextTick
import ReturnOnInvestment from "@/components/ReturnOnInvestment.vue";
import PlayerExtras from "@/components/PlayerExtras.vue";
import MarketValueOverTime from "@/components/MarketValueOverTime.vue";
import SimilarPlayers from "@/components/SimilarPlayers.vue";
export default {
  components: {
    CountryFlag,
    MarketValuePopup,
    ReturnOnInvestment,
    PlayerExtras,
    MarketValueOverTime,
    SimilarPlayers
  },
  setup() {
    const route = useRoute();
    const player = ref(null);
    const playerStats = ref([]);
    const playerInjuries = ref([]);
    const playerJerseyNumber = ref(null);
    const playerAchievements = ref([]);
    const playerTransferHistory = ref([]);
    const playerId = ref(null);
    const playerLastClubId = ref(0); // Ensure playerLastClubId is properly initialized
    const isMarketPopupOpen = ref(false);
    // New States for Season Filtering
    const selectedSeason = ref("");
    const groupedStats = ref({});


    // Fetch player's club Info
    const playerClubProfile = ref({
      name: "",
      url: "",
      stadiumName: "",
    });

    const fetchPlayerClubProfile = async () => {
      if (!playerLastClubId.value || playerLastClubId.value === 0) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/clubs/${playerLastClubId.value}/profile`;
        const response = await axios.get(apiUrl);

        // Extract name, image, and stadium name from the API response
        playerClubProfile.value = {
          name: response.data?.name || "Unknown Club",
          url: response.data?.image || "", // Extracts club logo
          stadiumName: response.data?.stadiumName?.trim() || "Not Available",
        };
      } catch (error) {
        console.error("Error fetching player club profile:", error);
      }
    };



    watch(playerLastClubId, async (newClubId) => {
      if (newClubId) {
        await fetchPlayerClubProfile();
      }
    });

    // Fetch player data using slug, then extract player ID
    const fetchPlayer = async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/players/${route.params.id}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    // 🛠️ Normalize field names so the UI binds properly
    data.country_of_citizenship = data.Nationality || "Unknown";
    data.current_club_name = data.current_club_domestic_competition_id || "Unknown";

    player.value = data;
    playerId.value = data.player_id;
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
};


    // Fetch player stats using player ID
    const fetchPlayerStats = async () => {
      if (!playerId.value || playerId.value <= 100) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${playerId.value}/stats`;
        const response = await axios.get(apiUrl);
        playerStats.value = response.data.stats;
        groupStatsBySeason();
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };

    // Fetch player injuries using player ID
    const fetchPlayerInjuries = async () => {
      if (!playerId.value || playerId.value <= 100) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${playerId.value}/injuries?page_number=1`;
        const response = await axios.get(apiUrl);
        playerInjuries.value = response.data.injuries || [];
      } catch (error) {
        console.error("Error fetching player injuries:", error);
      }
    };

    // Fetch player's jersey number for the latest season
    const fetchPlayerJerseyNumber = async () => {
      if (!playerId.value || playerId.value <= 100) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${playerId.value}/jersey_numbers`;
        const response = await axios.get(apiUrl);

        // Get the latest season's jersey number
        const latestSeason = response.data.jerseyNumbers?.[0]?.season;
        const latestJersey = response.data.jerseyNumbers.find(
          (jersey) => jersey.season === latestSeason
        );

        if (latestJersey) {
          playerJerseyNumber.value = latestJersey.jerseyNumber;
          playerLastClubId.value = Number(latestJersey.club); // Update club ID
        } else {
          playerJerseyNumber.value = "N/A";
          playerLastClubId.value = 0;
        }
      } catch (error) {
        console.error("Error fetching player jersey number:", error);
      }
    };

    // Fetch player achievements
    const fetchPlayerAchievements = async () => {
      if (!playerId.value || playerId.value <= 100) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${playerId.value}/achievements`;
        const response = await axios.get(apiUrl);
        playerAchievements.value = response.data.achievements || [];
      } catch (error) {
        console.error("Error fetching player achievements:", error);
      }
    };
    // Fetch player Transfer History
    const fetchTransferHistory = async () => {
      if (!playerId.value || playerId.value <= 100) return;
      try {
        const apiUrl = `${import.meta.env.VITE_TransferMarkt_Api_URL}/players/${playerId.value}/transfers`;
        const response = await axios.get(apiUrl);

        // Make sure to correctly assign the "transfers" array
        playerTransferHistory.value = response.data.transfers || [];
      } catch (error) {
        console.error("Error fetching player transfer history:", error);
      }
    };


    // Grouping Stats by Season
    const groupStatsBySeason = () => {
      const grouped = {};
      playerStats.value.forEach((stat) => {
        if (!grouped[stat.seasonId]) {
          grouped[stat.seasonId] = [];
        }
        grouped[stat.seasonId].push(stat);
      });
      groupedStats.value = grouped;
      selectedSeason.value = Object.keys(grouped)[0];
    };

    // Get Unique Seasons for Dropdown
    const availableSeasons = computed(() => {
      return Object.keys(groupedStats.value);
    });

    // Watch for changes in player ID and fetch additional data
    watch(playerId, async (newId) => {
      if (newId) {
        await fetchPlayerStats();
        await fetchPlayerInjuries();
        await fetchPlayerJerseyNumber();
        await fetchPlayerAchievements();
        await fetchTransferHistory();
      }
    });

    onMounted(() => {
      fetchPlayer();
    });

    // Convert nationality to ISO Alpha-2 code
    const getCountryCode = (country_of_citizenship) => {
      const country = iso31661.whereCountry(country_of_citizenship);
      return country?.alpha2?.toLowerCase() || null;
    };

    const formatCurrency = (value) => (value ? value.toLocaleString() : "N/A");

    // Compute class for dynamic coloring of market value
    const currentValueClass = computed(() => {
      if (!player.value) return "";
      const predicted = player.value.XGBoost_predicted_values;
      const actual = player.value.market_value_in_eur;

      if (predicted == null || actual == null) return "";

      return predicted >= actual ? "market-value-up" : "market-value-down";
    });


    const isValueUp = computed(() => {
      if (!player.value) return false;
      return (
        player.value.XGBoost_predicted_values >= player.value.highest_market_value_in_eur
      );
    });

    const showMarketDetails = async () => {
      console.log("Before update, isMarketPopupOpen:", isMarketPopupOpen.value);
      isMarketPopupOpen.value = true;
      await nextTick(); // Ensure UI updates
      console.log("After update, isMarketPopupOpen:", isMarketPopupOpen.value);
    };

    const closeMarketDetails = () => {
      console.log("Closing MarketValuePopup");
      isMarketPopupOpen.value = false;
    };

    const latestTransferFee = computed(() => {
      if (!playerTransferHistory.value || playerTransferHistory.value.length === 0) return null;

      const latestTransfer = playerTransferHistory.value
        .filter(t => t.fee !== undefined && t.fee !== null) // Ensure fee exists
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Get the latest transfer

      return latestTransfer ? latestTransfer.fee : null;
    });



    const getPositionIcon = (position) => {
      const positionIcons = {
        "Attacking Midfield": "fas fa-star",
        "Central Midfield": "fas fa-cogs",
        "Centre-Back": "fas fa-shield-alt",
        "Centre-Forward": "fas fa-bullseye",
        "Defensive Midfield": "fas fa-user-shield",
        Goalkeeper: "fas fa-hand-paper",
        "Left Midfield": "fas fa-arrow-left",
        "Left Winger": "fas fa-arrow-left",
        "Left-Back": "fas fa-angle-double-left",
        "Right Midfield": "fas fa-arrow-right",
        "Right Winger": "fas fa-arrow-right",
        "Right-Back": "fas fa-angle-double-right",
        "Second Striker": "fas fa-crosshairs",
      };
      return positionIcons[position] || "fas fa-question";
    };

    return {
      player,
      playerStats,
      playerInjuries,
      playerId,
      playerJerseyNumber,
      playerAchievements,
      playerClubProfile,
      playerTransferHistory, // Ensure it's returned
      getCountryCode,
      formatCurrency,
      getPositionIcon,
      currentValueClass,
      isValueUp,
      selectedSeason,
      groupedStats,
      availableSeasons,
      showMarketDetails,
      closeMarketDetails,
      isMarketPopupOpen,
      latestTransferFee
    };
  },
};
</script>





<style scoped>
/* Global Styling */
.player-stats-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0a0a0a;
  color: #00ff55;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  margin-top: 150px;
}

/* Player Container */
.player-container {
  background: #121212;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 85, 0.5);
  max-width: 900px;
  width: 100%;
  transition: transform 0.3s ease-in-out;
}

.player-container:hover {
  transform: scale(1.02);
}

/* Player Header */
.player-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Increased Player Image Size */
.player-image-wrapper {
  flex-shrink: 0;
  overflow: hidden;
  width: 150px;
  height: 150px;
  border: 4px solid #00ff55;
}

.player-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Player Basic Info */
.player-basic-info {
  flex-grow: 1;
}

.player-name {
  font-size: 2rem;
  font-weight: bold;
  color: #00ff55;
  margin-bottom: 5px;
}

.jersey-number {
  font-size: 1.4rem;
  font-weight: bold;
  color: #00cc44;
  background: rgba(0, 204, 68, 0.2);
  padding: 6px 12px;
  border-radius: 5px;
}

.flag-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.country-flag {
  width: 60px;
  height: 40px;
}

.country-name {
  font-size: 1rem;
  color: #00ff99;
}

.player-info,
.player-position {
  margin-top: 5px;
  font-size: 1rem;
  color: #bbb;
}

/* Divider */
.divider {
  height: 2px;
  background: #00ff55;
  margin: 15px 0;
  opacity: 0.6;
}

/* Player Details & Market Value */
.details-market-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.player-details,
.market-value {
  flex: 1;
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 255, 85, 0.3);
}

.section-title {
  font-size: 1.4rem;
  color: #00ff55;
  border-bottom: 2px solid #00ff55;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
  font-size: 1rem;
}

.market-value-text {
  font-size: 1.6rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}



.market-value-text span {
  font-size: 1.8rem;
  margin-right: 4px;
}

.highest-market-value {
  font-size: 1rem;
  color: #00ff99;
}

/* Player Stats */
.player-stats-container {
  background: #121212;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 85, 0.5);
  max-width: 900px;
  width: 100%;
  margin-top: 20px;
}

.season-dropdown {
  background: #1a1a1a;
  color: #00ff55;
  border: 2px solid #00ff55;
  padding: 8px;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 10px;
}

.stat-table-container {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 204, 68, 0.3);
  margin-bottom: 10px;
}

.competition-name {
  font-size: 1.2rem;
  color: #00ff99;
  margin-bottom: 5px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 10px;
  border: 1px solid #00ff55;
  text-align: center;
}

.stats-table th {
  background: #00ff99;
  color: #000;
}

.stats-table td {
  background: #222;
}

/* Player Injuries */
/* Container for Injuries & Achievements */
/* Ensure Full Width Usage */
.injury-achievement-container {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  margin-top: 20px;
  align-items: stretch;
  /* Makes both cards the same height */
}

/* Make Both Sections Take Equal Space */
.player-injuries-container,
.player-achievements-container {
  flex: 1;
  /* Makes sure both take up 50% equally */
  background: #121212;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 85, 0.5);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Forces full width */
  max-width: 100%;
  color: white;
}

.player-injuries-container:hover,
.player-achievements-container:hover {
  transform: scale(1.01);
  box-shadow: 0 0 20px rgba(0, 255, 85, 0.7);
}

/* Ensure Achievements and Injuries Stretch to Fill */
.injuries-table,
.achievements-list {
  width: 100%;
}

/* Section Title */
.section-title {
  font-size: 1.4rem;
  color: #00ff55;
  border-bottom: 2px solid #00ff55;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

/* Injuries Table */
.injuries-table {
  width: 100%;
  border-collapse: collapse;
}

.injuries-table th,
.injuries-table td {
  padding: 10px;
  border: 1px solid #00ff55;
  text-align: center;
}

.injuries-table th {
  background: #00ff99;
  color: #000;
}

.injuries-table td {
  background: #222;
}

/* Achievements List */
.achievements-list {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
  /* Ensures achievements list fills available space */
}

.achievement-item {
  font-size: 1rem;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 0 5px rgba(0, 255, 85, 0.3);
  width: 100%;
}

.achievement-item strong {
  color: #00ff99;
}

.achievement-details {
  list-style-type: none;
  padding-left: 10px;
  font-size: 0.9rem;
  color: #bbb;
}

.achievement-season {
  font-weight: bold;
  color: #00ff55;
}

/* Club Information Styling */
.club-info {
  background: #101010;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 255, 85, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.club-info strong {
  color: #00ff55;
  font-size: 1.1rem;
}

.club-logo-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 85, 0.1);
  padding: 5px;
}

.club-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Stadium Name Styling */
.club-stadium {
  font-size: 0.9rem;
  color: #bbb;
  margin-top: 5px;
  padding-left: 5px;
}

/* Responsive Fix for Smaller Screens */
@media (max-width: 768px) {
  .club-info {
    flex-direction: column;
    text-align: center;
  }

  .club-logo-container {
    width: 50px;
    height: 50px;
  }
}

/* Fix Small Screen Issue - Stack on Mobile */
@media (max-width: 768px) {
  .injury-achievement-container {
    flex-direction: column;
  }

  .player-injuries-container,
  .player-achievements-container {
    flex: 1;
    width: 100%;
  }
}




/* Transfer History Container */
/* Transfer History Container - Full Width */
.player-transfers-container {
  background: #121212;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 255, 85, 0.5);
  width: 100vw;
  /* 100% of viewport width */
  margin: 20px 0;
  /* Space above and below */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Transfer List - Full Width */
.transfer-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* More spacing for readability */
  width: 90vw;
  /* Uses 90% of the viewport width */
  max-width: 100%;
}

/* Individual Transfer Item */
.transfer-item {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 255, 85, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Transfer Header */
.transfer-header {
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  /* Larger font */
  font-weight: bold;
  color: #bbb;
  margin-bottom: 10px;
  width: 100%;
  padding: 0 20px;
}

/* Club Names and Transfer Arrow */
.transfer-clubs {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  /* Larger club names */
  font-weight: bold;
  color: #00ff55;
  width: 100%;
}

/* Transfer Arrow */
.transfer-arrow {
  margin: 0 15px;
  font-size: 1.8rem;
  /* Bigger arrow */
  color: #00ff99;
}

/* Club Name Styling */
.club-name {
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1.2rem;
  /* Bigger club names */
  font-weight: bold;
}

/* From Club - Departure */
.from-club {
  background: rgba(255, 0, 0, 0.3);
  color: #ff4444;
}

/* To Club - Arrival */
.to-club {
  background: rgba(0, 255, 85, 0.3);
  color: #00ff55;
}

/* Transfer Details */
.transfer-details {
  margin-top: 10px;
  font-size: 1.1rem;
  /* Bigger font for Market Value & Fee */
  font-weight: bold;
  color: #bbb;
  width: 100%;
  text-align: center;
}

/* Transfer Details Text */
.transfer-details p {
  margin: 5px 0;
  color: #00ff99;
}

/* Season Text */
.transfer-header span {
  font-size: 1.4rem;
  /* Bigger Season Font */
  font-weight: bold;
  color: #00cc99;
}

/* Responsive Fixes */
@media (max-width: 768px) {
  .player-transfers-container {
    padding: 15px;
    width: 100vw;
  }

  .transfer-list {
    width: 95vw;
  }

  .transfer-header {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .transfer-clubs {
    flex-direction: column;
    font-size: 1.2rem;
    /* Reduce club size for mobile */
  }

  .transfer-arrow {
    font-size: 1.5rem;
    /* Reduce arrow size for mobile */
  }

  .transfer-details {
    font-size: 1.1rem;
    /* Reduce market value & fee size for mobile */
  }
}
</style>