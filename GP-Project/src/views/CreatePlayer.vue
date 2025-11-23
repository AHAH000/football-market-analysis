<template>
    <div class="container">
        <h2>Manage Players</h2>

        <!-- Navigation Tabs -->
        <div class="tabs">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="{ active: activeTab === tab }">
                {{ tab }}
            </button>
        </div>

        <!-- Create Player Form -->
        <div v-if="activeTab === 'Create Player'">
            <h3>Create a New Player</h3>
            <form @submit.prevent="createPlayer">
                <div class="form-group-grid">
                    <div class="form-group" v-for="(field, key) in playerData" :key="key">
                        <label v-if="key !== 'image_url'" :for="key">{{ formatLabel(key) }}</label>
                        <input v-if="key !== 'image_url'" v-model="playerData[key]" :type="getFieldType(key)" :id="key"
                            :placeholder="'Enter ' + formatLabel(key)" required />
                    </div>
                </div>

                <!-- Image Upload Field -->
                <div class="form-group">
                    <label for="image_url">Player Image URL</label>
                    <input v-model="playerData.image_url" id="image_url" type="text" placeholder="Enter Image URL"
                        @input="updateImagePreview" />
                </div>
                <div class="form-group">
                    <label for="XGBoost_predicted_values">XGBoost Predicted Value</label>
                    <input v-model="playerData.XGBoost_predicted_values" id="XGBoost_predicted_values" type="text"
                        disabled />
                </div>


                <!-- Image Preview -->
                <div v-if="imagePreview" class="image-preview">
                    <p>Image Preview:</p>
                    <img :src="imagePreview" alt="Player Image" />
                </div>

                <!-- Buttons -->
                <button type="button" class="dummy-data-btn" @click="fillDummyData">
                    Fill Dummy Data
                </button>
                <button type="button" class="reset-btn" @click="resetForm">
                    Reset
                </button>
                <button type="submit" :disabled="loading">
                    {{ loading ? "Creating..." : "Create Player" }}
                </button>
            </form>
        </div>

        <!-- Update Player Form -->
        <div v-if="activeTab === 'Update Player'">
            <h3>Update Player</h3>

            <!-- Fetch Player Info -->
            <div class="fetch-player">
                <input v-model="playerId" type="number" placeholder="Enter Player ID" />
                <button @click="fetchPlayerInfo">Fetch Player Info</button>
            </div>

            <form @submit.prevent="updatePlayer">
                <div class="form-group-grid">
                    <div class="form-group" v-for="(field, key) in playerData" :key="key">
                        <label :for="key">{{ formatLabel(key) }}</label>
                        <input v-if="key !== 'image_url'" v-model="playerData[key]" :type="getFieldType(key)" :id="key"
                            :placeholder="'Enter ' + formatLabel(key)" />
                    </div>
                </div>

                <!-- Image Upload Field -->
                <div class="form-group">
                    <label for="image_url">Player Image URL</label>
                    <input v-model="playerData.image_url" id="image_url" type="text" placeholder="Enter Image URL"
                        @input="updateImagePreview" />
                </div>

                <!-- Image Preview -->
                <div v-if="imagePreview" class="image-preview">
                    <p>Image Preview:</p>
                    <img :src="imagePreview" alt="Player Image" />
                </div>

                <button type="submit" :disabled="loading">
                    {{ loading ? "Updating..." : "Update Player" }}
                </button>
            </form>
        </div>

        <!-- Delete Player Form -->
        <div v-if="activeTab === 'Delete Player'">
            <h3>Delete Player</h3>

            <div class="fetch-player">
                <input v-model="playerIdToDelete" type="number" placeholder="Enter Player ID" />
                <button @click="deletePlayer" class="delete-btn">Delete Player</button>
            </div>
        </div>

        <!-- Status Messages -->
        <p v-if="message" :class="{ success: success, error: !success }">
            {{ message }}
        </p>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            activeTab: "Create Player",
            tabs: ["Create Player", "Update Player", "Delete Player"],
            playerId: "",
            playerData: {
                Name: "",
                Nationality: "",
                date_of_birth: "",
                sub_position: "",
                foot: "",
                height_in_cm: "",
                contract_expiration_date: "",
                agent_name: "",
                current_club_domestic_competition_id: "",
                market_value_in_eur: "",
                highest_market_value_in_eur: "",
                age: "",
                image_url: "",
            },
            imagePreview: "",
            loading: false,
            message: "",
            success: false,
        };
    },
    methods: {
        async fetchPlayerInfo() {
            if (!this.playerId) {
                this.message = "Please enter a Player ID.";
                this.success = false;
                return;
            }
            this.loading = true;
            this.message = "";

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/handlePlayer/${this.playerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = response.data;

                this.playerData = {
                    player_id: data.player_id, // Store player_id correctly
                    Name: data.Name,
                    Nationality: data.Nationality,
                    date_of_birth: data.date_of_birth,
                    sub_position: data.sub_position,
                    foot: data.foot === 0 ? "Left" : "Right",
                    height_in_cm: data.height_in_cm,
                    contract_expiration_date: data.contract_expiration_date,
                    agent_name: data.agent_name,
                    current_club_domestic_competition_id: data.current_club_domestic_competition_id,
                    market_value_in_eur: data.market_value_in_eur,
                    highest_market_value_in_eur: data.highest_market_value_in_eur,
                    age: data.age,
                    image_url: data.image_url,
                };

                this.updateImagePreview();
                this.message = "Player data loaded successfully!";
                this.success = true;
            } catch (error) {
                this.message = "Failed to fetch player data.";
                this.success = false;
            }

            this.loading = false;
        },

        async createPlayer() {
            this.loading = true;
            this.message = "";

            try {
                // 🔮 Predict market value first
                const predictedValue = await this.predictMarketValue();
                if (predictedValue !== null) {
                    this.playerData.XGBoost_predicted_values = predictedValue;
                }

                // ✅ Now create player with predicted value
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/handlePlayer/create`,
                    this.playerData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                this.message = "Player created successfully!";
                this.success = true;
                this.resetForm();
            } catch (error) {
                this.message = error.response?.data?.error || "Failed to create player.";
                this.success = false;
            }

            this.loading = false;
        },


        async updatePlayer() {
            if (!this.playerData.player_id) {
                this.message = "Invalid Player ID.";
                this.success = false;
                return;
            }

            this.loading = true;
            this.message = "";

            try {
                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/api/handlePlayer/update/${this.playerData.player_id}`,
                    this.playerData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.message = "Player updated successfully!";
                this.success = true;
            } catch (error) {
                this.message = error.response?.data?.error || "Failed to update player.";
                this.success = false;
            }

            this.loading = false;
        },

        async predictMarketValue() {
            try {
                const payload = {
                    age: this.playerData.age,
                    position: this.mapPosition(this.playerData.sub_position),
                    sub_position: this.playerData.sub_position,
                    foot_encoded: this.playerData.foot.toLowerCase() === "left" ? 0 : 1,
                    height_in_cm: this.playerData.height_in_cm,
                    league: this.playerData.current_club_domestic_competition_id,
                    contract_years_remaining: this.calculateContractYearsRemaining(this.playerData.contract_expiration_date),
                };

                const response = await axios.post("http://127.0.0.1:8001/predict_market_value/", payload);
                return response.data?.value || null;
            } catch (error) {
                console.error("Error predicting market value:", error);
                return null;
            }
        },
        mapPosition(subPosition) {
            const map = {
                "Centre-Back": "Defender",
                "Left-Back": "Defender",
                "Right-Back": "Defender",
                "Central Midfield": "Midfield",
                "Attacking Midfield": "Midfield",
                "Defensive Midfield": "Midfield",
                "Centre-Forward": "Attack",
                "Left Winger": "Attack",
                "Right Winger": "Attack",
                "Second Striker": "Attack",
            };
            return map[subPosition] || "Goalkeeper";
        },

        calculateContractYearsRemaining(expirationDate) {
            if (!expirationDate) return 0;
            const today = new Date();
            const end = new Date(expirationDate);
            const years = end.getFullYear() - today.getFullYear();
            return years < 0 ? 0 : years;
        },

        fillDummyData() {
            this.playerData = {
                Name: "Lionel Messi",
                Nationality: "Argentina",
                date_of_birth: "1987-06-24",
                sub_position: "Right Wing",
                foot: "Left",
                height_in_cm: "170",
                contract_expiration_date: "2025-06-30",
                agent_name: "Jorge Messi",
                current_club_domestic_competition_id: "LIG1",
                market_value_in_eur: "50000000",
                highest_market_value_in_eur: "180000000",
                age: "36",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lionel_Messi_WC2022.jpg",
            };
            this.updateImagePreview();
        },

        resetForm() {
            Object.keys(this.playerData).forEach((key) => {
                this.playerData[key] = "";
            });
            this.imagePreview = "";
        },

        updateImagePreview() {
            this.imagePreview = this.playerData.image_url;
        }, async deletePlayer() {
            if (!this.playerIdToDelete) {
                this.message = "Please enter a Player ID to delete.";
                this.success = false;
                return;
            }

            this.loading = true;
            this.message = "";

            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/api/handlePlayer/delete/${this.playerIdToDelete}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                this.message = "Player deleted successfully!";
                this.success = true;
            } catch (error) {
                this.message = error.response?.data?.error || "Failed to delete player.";
                this.success = false;
            }

            this.loading = false;
        },

        formatLabel(text) {
            return text.replace(/_/g, " ").toUpperCase();
        },

        getFieldType(key) {
            return ["date_of_birth", "contract_expiration_date"].includes(key) ? "date" : "text";
        },
        updateImagePreview() {
            this.imagePreview = this.playerData.image_url;
        },

        resetForm() {
            Object.keys(this.playerData).forEach((key) => {
                this.playerData[key] = "";
            });
            this.imagePreview = "";
        },

    },
};
</script>



<style scoped>
/* Container */
.container {
    max-width: 900px;
    margin: 40px auto;
    background-color: #0a0a0a;
    color: #32cd32;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 6px 12px rgba(50, 205, 50, 0.4);
    margin-top: 100px;
    text-align: center;
}

/* Form Title */
h2 {
    margin-bottom: 20px;
    color: #32cd32;
    font-size: 26px;
    font-weight: bold;
}

/* Tabs for navigation */
.tabs {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    background-color: black;
    border: 2px solid #32cd32;
    color: #32cd32;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.3s;
}

.tabs button.active {
    background-color: #32cd32;
    color: black;
}

.tabs button:hover {
    background-color: #00ff00;
    color: black;
}

/* Form Styling */
.form-group-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    text-align: left;
}

label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #32cd32;
}

input {
    width: 100%;
    padding: 10px;
    border: 2px solid #32cd32;
    border-radius: 5px;
    background-color: black;
    color: white;
    font-size: 16px;
    outline: none;
}

input:focus {
    border-color: #00ff00;
}

/* Image Upload Styling */
.image-inputs {
    margin: 15px 0;
}

.custom-file-upload {
    display: inline-block;
    padding: 12px 20px;
    cursor: pointer;
    background-color: #32cd32;
    color: black;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    transition: 0.3s;
}

.custom-file-upload:hover {
    background-color: #00ff00;
}

input[type="file"] {
    display: none;
}

/* Image Preview */
.image-preview {
    margin-top: 20px;
    text-align: center;
}

.image-preview img {
    max-width: 350px;
    height: auto;
    border-radius: 5px;
    border: 3px solid #32cd32;
    margin-top: 10px;
}

/* Buttons */
button {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.3s;
    border: none;
    margin-top: 10px;
}

button:disabled {
    background-color: #444;
    cursor: not-allowed;
}

/* Submit / Create Button */
button[type="submit"] {
    background-color: #32cd32;
    color: black;
}

button[type="submit"]:hover {
    background-color: #00ff00;
}

/* Update Button */
.update-btn {
    background-color: #32a0ff;
    color: white;
}

.update-btn:hover {
    background-color: #008ae6;
}

/* Delete Button */
.delete-btn {
    background-color: #ff3232;
    color: white;
}

.delete-btn:hover {
    background-color: #cc0000;
}

/* Success & Error Messages */
.success {
    color: #00ff00;
    font-size: 16px;
}

.error {
    color: red;
    font-size: 16px;
}

/* Dummy Data Button */
.dummy-data-btn {
    width: 100%;
    padding: 12px;
    background-color: #ffcc00;
    color: black;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 10px;
}

.dummy-data-btn:hover {
    background-color: #ffaa00;
}
</style>