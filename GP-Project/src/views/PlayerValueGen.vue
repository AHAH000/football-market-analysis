<template>
  <div class="container">
    <h2>Predict Market Value</h2>
    <form @submit.prevent="validateForm">
      <div class="form-group">
        <label>Age:</label>
        <input type="number" v-model="player.age" @input="validateField('age')" required />
        <p v-if="errors.age" class="error-message">{{ errors.age }}</p>
      </div>

      <!-- Position -->
      <div class="form-group">
        <label>Position:</label>
        <input readonly :value="player.position" @click="showPositionPopup = true" placeholder="Select Position"
          class="popup-input" />
        <p v-if="errors.position" class="error-message">{{ errors.position }}</p>

        <div v-if="showPositionPopup" class="popup-overlay" @click.self="showPositionPopup = false">
          <div class="popup-content">
            <h3>Select Position</h3>
            <div v-for="pos in Object.keys(subPositions)" :key="pos" @click="selectPosition(pos)" class="popup-item">
              {{ pos }}
            </div>
          </div>
        </div>
      </div>

      <!-- Sub-Position -->
      <div class="form-group">
        <label>Sub-Position:</label>
        <input readonly :value="player.sub_position"
          @click="player.position !== 'Goalkeeper' ? (showSubPositionPopup = true) : null"
          placeholder="Select Sub-Position" class="popup-input" :disabled="player.position === 'Goalkeeper'" />
        <p v-if="errors.sub_position" class="error-message">{{ errors.sub_position }}</p>

        <div v-if="showSubPositionPopup" class="popup-overlay" @click.self="showSubPositionPopup = false">
          <div class="popup-content">
            <h3>Select Sub-Position</h3>
            <div v-for="subPos in availableSubPositions" :key="subPos" @click="selectSubPosition(subPos)"
              class="popup-item">
              {{ subPos }}
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Height (cm):</label>
        <input type="number" v-model="player.height_in_cm" @input="validateField('height_in_cm')" required />
        <p v-if="errors.height_in_cm" class="error-message">{{ errors.height_in_cm }}</p>
      </div>

      <!-- League -->
      <div class="form-group">
        <label>League:</label>
        <input readonly :value="leagueDisplayName[player.league]" @click="showLeaguePopup = true"
          placeholder="Select League" class="popup-input" />

        <div v-if="showLeaguePopup" class="popup-overlay" @click.self="showLeaguePopup = false">
          <div class="popup-content">
            <h3>Select League</h3>
            <div v-for="(leagueName, leagueCode) in leagueDisplayName" :key="leagueCode"
              @click="selectLeague(leagueCode)" class="popup-item">
              <img :src="leagueIcons[leagueCode]" alt="" class="league-icon" />
              {{ leagueName }}
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Contract Years Remaining:</label>
        <input type="number" v-model="player.contract_years_remaining"
          @input="validateField('contract_years_remaining')" required />
        <p v-if="errors.contract_years_remaining" class="error-message">{{ errors.contract_years_remaining }}</p>
      </div>

      <div class="button-container">
        <button type="submit" class="btn">Predict Value</button>
      </div>

    </form>

    <div v-if="prediction">
      <h3 class="predicted-value">
        Predicted Market Value: €{{ prediction["Predicted Market Value (€)"].toLocaleString() }}
      </h3>


      <div v-if="prediction['Similar Players'].length">
        <h3>Similar Players</h3>
        <div class="similar-players">
          <div v-for="player in top3SimilarPlayers" :key="player['Player ID']" class="player-card"
            @click="goToPlayerView(player['Player ID'])">

            <!-- Player Image -->
            <img v-if="player.image_url" :src="player.image_url" :alt="player['Most Similar Player']"
              class="player-image" />

            <p class="player-name"><strong>{{ player["Most Similar Player"] }}</strong> ({{ player.Club }})</p>
            <p class="player-value">Market Value: €{{ player["Market Value (€)"].toLocaleString() }}</p>
            <p class="similarity-score">Similarity: {{ player["Similarity Score (%)"] }}%</p>
          </div>
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
      player: {
        age: "",
        position: "Defender",
        sub_position: "",
        foot_encoded: 1,
        height_in_cm: "",
        league: "GB1",
        contract_years_remaining: "",
      },
      prediction: null,
      errors: {},
      subPositions: {
        Defender: ["Centre-Back", "Left-Back", "Right-Back"],
        Midfield: [
          "Central Midfield",
          "Attacking Midfield",
          "Defensive Midfield",
        ],
        Attack: [
          "Centre-Forward",
          "Left Winger",
          "Right Winger",
          "Second Striker",
        ],
        Goalkeeper: [],
      },
      availableSubPositions: ["Centre-Back", "Left-Back", "Right-Back"], // Default for 'Defender'

      // NEW ADDED
      showPositionPopup: false,
      showSubPositionPopup: false,
      showLeaguePopup: false,

      leagueDisplayName: {
        GB1: "Premier League",
        ES1: "La Liga",
        IT1: "Serie A",
        FR1: "Ligue 1",
        L1: "Bundesliga"
      },
      leagueIcons: {
        GB1: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        ES1: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/500px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png",
        IT1: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/210px-Serie_A_ENILIVE_logo.svg.png",
        FR1: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Ligue_1_2024.svg/285px-Ligue_1_2024.svg.png",
        L1: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg"
      }
    };
  },
  methods: {
    validateField(field) {
      if (field === "age" && (this.player.age < 16 || this.player.age > 45)) {
        this.errors.age = "Age must be between 16 and 50.";
      } else if (field === "height_in_cm" && (this.player.height_in_cm < 140 || this.player.height_in_cm > 210)) {
        this.errors.height_in_cm = "Height must be between 140cm and 210cm.";
      } else if (field === "contract_years_remaining" && this.player.contract_years_remaining < 0) {
        this.errors.contract_years_remaining = "Contract years remaining must be 0 or higher.";
      } else {
        this.errors[field] = "";
      }
    },
    validateForm() {
      this.errors = {};

      if (!this.player.age) this.errors.age = "Age is required.";
      if (!this.player.position) this.errors.position = "Position is required.";
      if (this.player.position !== "Goalkeeper" && !this.player.sub_position) {
        this.errors.sub_position = "Sub-Position is required.";
      }
      if (!this.player.height_in_cm) this.errors.height_in_cm = "Height is required.";
      if (!this.player.contract_years_remaining && this.player.contract_years_remaining !== 0) {
        this.errors.contract_years_remaining = "Contract years remaining is required.";
      }

      if (Object.keys(this.errors).length === 0) {
        this.predictMarketValue();
      }
    },
    async predictMarketValue() {
      try {
        const response = await axios.post("http://127.0.0.1:8001/predict_market_value/", this.player);
        this.prediction = response.data;
      } catch (error) {
        console.error("Error predicting market value:", error);
      }
    },
    updateSubPositions() {
      this.player.sub_position = "";
      this.availableSubPositions = this.subPositions[this.player.position] || [];
    },
    async goToPlayerView(playerId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/players/playerId/${playerId}`);
        const playerSlug = response.data._id; // Get the _id for redirection

        if (playerSlug) {
          this.$router.push(`/playerView/${playerSlug}`); // Navigate to playerView page
        }
      } catch (error) {
        console.error("Error fetching player slug:", error);
      }
    },

    // NEW ADDED
    selectPosition(pos) {
      this.player.position = pos;
      this.updateSubPositions();
      this.showPositionPopup = false;
    },
    selectSubPosition(subPos) {
      this.player.sub_position = subPos;
      this.showSubPositionPopup = false;
    },
    selectLeague(leagueCode) {
      this.player.league = leagueCode;
      this.showLeaguePopup = false;
    },
  },
  computed: {
    top3SimilarPlayers() {
      return this.prediction ? this.prediction["Similar Players"].slice(0, 3) : [];
    }
  },
};
</script>

<style scoped>
/* General Styling */
.container {
  color: #00ff00;
  padding: 30px;
  border-radius: 10px;
  width: 50%;
  margin: auto;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  margin-top: 140px;
}

/* Form Styling */
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Input Fields */
input,
select {
  padding: 10px;
  width: 90%;
  border-radius: 6px;
  border: 2px solid #00ff00;
  background-color: #1a1a1a;
  color: #00ff00;
  outline: none;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

/* Error Messages */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

/* Buttons */
button {
  padding: 12px;
  background-color: #00ff00;
  color: #0d0d0d;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  width: 90%;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background-color: #009900;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
}

/* --- RESULTS DISPLAY --- */

/* Predicted Market Value Box */
.result-box {
  background-color: #111;
  padding: 20px;
  margin-top: 30px;
  border-radius: 8px;
  border: 2px solid #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
}

.result-box h3 {
  font-size: 22px;
  font-weight: bold;
  color: #00ff00;
}

/* Similar Players Section */
.similar-players {
  display: flex;
  /* Use flexbox */
  flex-wrap: wrap;
  /* Wrap if not enough space */
  justify-content: center;
  /* Center-align items */
  gap: 15px;
  /* Space between cards */
  margin-top: 20px;
}

/* Style for player cards */
.player-card {
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  transition: transform 0.3s ease-in-out;
  text-align: center;
  flex: 1;
  /* Make cards flexible */
  min-width: 250px;
  /* Minimum width for each card */
  max-width: 300px;
  /* Max width to keep consistency */
  height: 100%;
  /* Ensure all cards have equal height */
  display: flex;
  flex-direction: column;
  /* Align content vertically */
  justify-content: space-between;
  /* Distribute content evenly */
}

.player-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

.player-card p {
  margin: 5px 0;
  font-size: 16px;
}

.player-name {
  font-weight: bold;
  font-size: 18px;
  color: #00ff00;
}

.player-value {
  font-weight: bold;
  color: #ffcc00;
}

.similarity-score {
  color: #ff6600;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    width: 80%;
  }

  input,
  select,
  button {
    width: 100%;
  }
}

/* Button Container (Centers the Button) */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

/* Button Styling */
button {
  padding: 12px 20px;
  background-color: #00ff00;
  color: #0d0d0d;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  /* Adjust the width as needed */
  transition: all 0.3s ease-in-out;
}

button:hover {
  background-color: #009900;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
}

/* Responsive: Ensure the button looks good on mobile */
@media (max-width: 768px) {
  .button-container {
    width: 100%;
  }

  button {
    width: 80%;
    /* Adjust for smaller screens */
  }
}

.predicted-value {
  font-size: 26px;
  /* Slightly bigger */
  font-weight: bold;
  color: #33ff33;
  /* Slightly softer green */
  text-shadow: 0 0 12px #00ff00, 0 0 24px #2b582b;
  /* More natural neon */
  padding: 12px 18px;
  border-radius: 10px;
  display: inline-block;
  text-transform: uppercase;
}

/* Player Image */
.player-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 10px auto;
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

/* Hover Effect */
.player-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .similar-players {
    flex-direction: column;
    /* Stack items vertically on smaller screens */
    align-items: center;
  }

  .player-card {
    width: 90%;
    /* Make cards take full width on small screens */
  }
}
/* Popup Input */
.popup-input {
  background-color: #1a1a1a;
  color: #00ff00;
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 12px;
  font-size: 17px;
  cursor: pointer;
  width: 90%;
  transition: all 0.3s ease;
}

.popup-input:hover {
  background-color: #222;
  border-color: #00cc00;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease;
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Popup Content */
.popup-content {
  background: #111;
  padding: 25px;
  border-radius: 15px;
  border: 2px solid #00ff00;
  width: 320px;
  max-height: 450px;
  overflow-y: auto;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  animation: slideDown 0.5s ease;
}

/* Slide Down Animation */
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Popup Items */
.popup-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #00ff00;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #00ff00;
  font-weight: bold;
  font-size: 16px;
}

.popup-item:hover {
  background: #00ff00;
  color: #0d0d0d;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 10px rgba(0,255,0,0.6);
}

/* League Icon */
.league-icon {
  width: 40px; /* Increased size */
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover Effect for League Icon */
.popup-item:hover .league-icon {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
}

</style>
