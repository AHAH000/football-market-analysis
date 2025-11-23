<template>
    <div class="squad-builder">
        <h1>Squad Builder</h1>

        <!-- Budget Selection -->
        <div class="budget-section">
            
            <label for="budget">Enter Your Budget (€M):</label>
            <select v-model="budget" class="budget-dropdown">
                <option value="50000000">€50 Million</option>
                <option value="100000000">€100 Million</option>
                <option value="200000000">€200 Million</option>
                <option value="300000000">€300 Million</option>
                <option value="500000000">€500 Million</option>
                <option value="1000000000">€1 Billion</option>
            </select>
            <p class="budget-warning" v-if="totalValue > budget">
                ⚠ Budget Exceeded! (€{{ totalValue }}M)
            </p>
        </div>
        <button class="my-squads-btn" @click="goToMySquads">
            📂 View My Squads
        </button>
        <!-- Pass Budget & Players to FootballPitch -->
        <FootballPitch 
            :budget="Number(budget)" 
            :selectedPlayers="selectedPlayers"
            @update-selected-players="updateSelectedPlayers"
        />
        <SaveSquad :squad="selectedPlayers" :budget="totalValue" />
     
    </div>
</template>

<script>
import FootballPitch from "@/components/FootballPitch.vue";
import SaveSquad from "@/components/SaveSquad.vue";

export default {
    components: {
        FootballPitch,
        SaveSquad,
    },
    data() {
        return {
            budget: 50000000, // Default budget
            selectedPlayers: {}, // Players assigned to positions
        };
    },
    computed: {
        totalValue() {
            return Object.values(this.selectedPlayers).reduce(
                (sum, player) => sum + (player?.XGBoost_predicted_values || 0),
                0
            );
        },
    },
    methods: {
        updateSelectedPlayers(updatedPlayers) {
            this.selectedPlayers = updatedPlayers;
            console.log("⚽ Players Updated in SquadBuilderView:", this.selectedPlayers);
        },
        goToMySquads() {
            this.$router.push("/MySquads");
        }
    },
  mounted() {
  const squadData = this.$route.query.squad;
  if (squadData) {
    try {
      const parsedSquad = JSON.parse(squadData);
      console.log("🔄 Loading Squad:", parsedSquad);

      // ✅ Assign using pitchIndex instead of position name
      this.selectedPlayers = parsedSquad.players.reduce((acc, player) => {
        if (player.pitchIndex !== undefined) {
          acc[player.pitchIndex] = player;
        }
        return acc;
      }, {});

      this.budget = parsedSquad.totalValue || 100;
      console.log("✅ Players Loaded by pitchIndex:", this.selectedPlayers);
    } catch (error) {
      console.error("❌ Error loading squad:", error);
    }
  }
}

};
</script>



<style scoped>
/* General Squad Builder Styling */
.squad-builder {
    text-align: center;
    background: linear-gradient(135deg, #121212, #1a1a1a);
    color: white;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Title Styling */
.squad-builder h1 {
    font-size: 36px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(to right, #0f0, #00ffcc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
}

/* Budget Section */
.budget-section {
    background: #222;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 255, 0, 0.4);
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    transition: transform 0.3s ease-in-out;
    margin-top: 40px;
}

.budget-section:hover {
    transform: scale(1.05);
}

/* Budget Input */
.budget-section input {
    width: 80%;
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    border: 2px solid #0f0;
    background: #333;
    color: white;
    text-align: center;
    margin-top: 10px;
    transition: border 0.3s ease-in-out;
}

.budget-section input:focus {
    border: 2px solid #00ffcc;
    outline: none;
}

/* Budget Warning */
.budget-warning {
    color: red;
    font-weight: bold;
    font-size: 14px;
    margin-top: 10px;
    animation: pulse 1.2s infinite alternate;
}

/* Budget Exceeded Animation */
@keyframes pulse {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.5;
    }
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
    .squad-builder h1 {
        font-size: 28px;
    }

    .budget-section {
        width: 90%;
    }
}

/* New Budget Dropdown Styling */
.budget-dropdown {
    width: 80%;
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    border: 2px solid #0f0;
    background: #333;
    color: white;
    text-align: center;
    margin-top: 10px;
    transition: border 0.3s ease-in-out;
    cursor: pointer;
}

.budget-dropdown:hover {
    border-color: #00ffcc;
}

.budget-dropdown:focus {
    outline: none;
    border-color: #00ffcc;
}
.my-squads-btn {
    background-color: #137e16; /* green tone */
    color: white;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  
  .my-squads-btn:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .my-squads-btn:active {
    background-color: #3e8e41;
    transform: scale(0.98);
  }
  
</style>
