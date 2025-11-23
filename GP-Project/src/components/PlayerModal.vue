<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content">
        <h3>Select a {{ sub_position }}</h3>

        <!-- Loading Spinner -->
        <div v-if="loading" class="loading-spinner"></div>

        <!-- Filtering & Sorting -->
        <div v-else>
          <div class="filter-section">
            <!-- Name Filter -->
            <input type="text" v-model="nameFilter" placeholder="Search by Name..." class="styled-input" />

            <!-- Age Filter -->
            <input type="number" v-model.number="ageFilter" placeholder="Max Age" class="styled-input" />

            <!-- Market Value Filter -->
            <!-- Market Value Filter -->
            <select v-model="marketValueFilter" class="styled-dropdown">
              <option :value="null">Select Market Value</option> <!-- ✅ Default Value -->
              <option :value="10000000">≥ €10M</option>
              <option :value="30000000">≥ €30M</option>
              <option :value="50000000">≥ €50M</option>
              <option :value="100000000">≥ €100M</option>
              <option :value="200000000">≥ €200M</option>
              <option :value="300000000">≥ €300M</option>
              <option :value="500000000">≥ €500M</option>
              <option :value="1000000000">≥ €1B</option>
            </select>


            <!-- League Filter -->
            <input type="text" v-model="leagueFilter" placeholder="League ID..." class="styled-input" />
          </div>

          <!-- Sorting Options -->
          <div class="sort-section">
            <label>Sort by:</label>
            <select v-model="sortOption" @change="sortPlayers" class="styled-dropdown">
              <option value="age">Age</option>
              <option value="XGBoost_predicted_values">Predicted Value</option>
              <option value="current_club_domestic_competition_id">League</option>
            </select>
          </div>

          <!-- Player List -->
          <div v-if="filteredPlayers.length > 0" class="player-list">
            <div v-for="player in filteredPlayers" :key="player._id" class="player-item" @click="selectPlayer(player)">
              <img :src="player.image_url || defaultPlayerImg" class="player-img" />
              <div class="player-info">
                <span class="player-name">{{ player.Name }}</span>
                <span class="player-details">🌍 {{ player.Nationality }} | 📅 Age: {{ player.age }}</span>
                <span class="player-details">📏 Height: {{ player.height_in_cm }} cm | 🦶 Foot: {{ player.foot }}</span>
                <span class="player-value">📈 Predicted Value: €{{ formatCurrency(player.XGBoost_predicted_values)
                }}</span>
                <span class="player-details">🏆 League: {{ player.current_club_domestic_competition_id }}</span>
              </div>
            </div>
          </div>

          <!-- No Players Available -->
          <p v-if="showNoPlayersMessage" class="no-players">No players available for this position.</p>
        </div>

        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    sub_position: String,
  },
  data() {
    return {
      players: [],
      loading: false,
      showNoPlayersMessage: false,
      sortOption: "age",
      nameFilter: "",
      ageFilter: null,
      marketValueFilter: null,
      leagueFilter: "",
      defaultPlayerImg: "https://via.placeholder.com/150",
    };
  },
  computed: {
    sortedPlayers() {
      return [...this.players].sort((a, b) => {
        if (this.sortOption === "age") return a.age - b.age;
        if (this.sortOption === "XGBoost_predicted_values") return b.XGBoost_predicted_values - a.XGBoost_predicted_values;
        if (this.sortOption === "current_club_domestic_competition_id") return a.current_club_domestic_competition_id.localeCompare(b.current_club_domestic_competition_id);
        return 0;
      });
    },
    filteredPlayers() {
      return this.sortedPlayers.filter(player => {
        return (
          (!this.nameFilter || player.Name.toLowerCase().includes(this.nameFilter.toLowerCase())) &&
          (!this.ageFilter || player.age <= this.ageFilter) &&
          (!this.marketValueFilter || player.XGBoost_predicted_values <= Number(this.marketValueFilter)) &&  
          (!this.leagueFilter || player.current_club_domestic_competition_id.toLowerCase().includes(this.leagueFilter.toLowerCase()))
        );
      });
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchPlayers();
      }
    },
  },
  methods: {
    async fetchPlayers() {
      this.loading = true;
      this.showNoPlayersMessage = false;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/players/filter?sub_position=${this.sub_position}`);
        const data = await response.json();
        this.players = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching players:", error);
        this.players = [];
      } finally {
        setTimeout(() => {
          this.loading = false;
          if (this.players.length === 0) {
            this.showNoPlayersMessage = true;
          }
        }, 1000);
      }
    },
    selectPlayer(player) {
      this.$emit("player-selected", player);
    },
    closeModal() {
      this.$emit("close");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US").format(value);
    },
  },
};
</script>



<style scoped>
/* Modal Background Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Bigger Modal Box */
.modal-content {
  background: #222;
  padding: 25px;
  width: 700px;
  height: 550px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 255, 0, 0.4);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

/* Loading Spinner */
.loading-spinner {
  border: 6px solid rgba(0, 255, 0, 0.2);
  border-top: 6px solid #0f0;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 30px auto;
  animation: spin 1s linear infinite;
}

/* Sorting Section */
.sort-section {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.sort-section label {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.sort-section select {
  background: #444;
  color: white;
  padding: 5px;
  border-radius: 5px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

/* Player List */
.player-list {
  max-height: 380px;
  overflow-y: auto;
  padding: 10px;
}

/* Individual Player Card */
.player-item {
  display: flex;
  align-items: center;
  background: #333;
  padding: 14px;
  margin: 10px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background 0.2s;
}

.player-item:hover {
  background: #444;
  transform: scale(1.05);
}

/* No Players Available */
.no-players {
  color: red;
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0;
}

/* Bigger Player Image */
.player-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

/* Player Info */
.player-info {
  display: flex;
  flex-direction: column;
  color: white;
  text-align: left;
}

.player-name {
  font-size: 20px;
  font-weight: bold;
}

.player-value {
  font-size: 16px;
  color: #0f0;
  font-weight: bold;
}

.player-details {
  font-size: 14px;
  color: #ccc;
  margin-top: 3px;
}

/* Close Button */
.close-btn {
  margin-top: 20px;
  background: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn:hover {
  background: darkred;
}

/* Spinner Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Fade Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Input Fields */
.styled-input,
.styled-dropdown {
  background: #444;
  color: white;
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  outline: none;
  transition: background 0.3s ease-in-out;
  width: 100%;
  margin-bottom: 8px;
}

.styled-dropdown:hover {
  background: #555;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
}
</style>