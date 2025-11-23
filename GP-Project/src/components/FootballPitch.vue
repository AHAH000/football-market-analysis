<template>
    <div class="squad-builder">
        <!-- Football Pitch Container -->
        <div class="pitch-wrapper">
            <div class="pitch-container">
                <canvas id="pitch"></canvas>

                <div v-for="(position, index) in positions" :key="index" :class="`player-card ${position.class}`"
                    :style="{ top: position.top, left: position.left }"
                    @click="openModal(index, position.sub_position)">
                    <div class="position-card">
                        <div class="player-image-container">
                            <img v-if="selectedPlayersByIndex[index]"
                                :src="selectedPlayersByIndex[index].image_url || defaultPlayerImg" class="player-img"
                                alt="Player Image" />
                        </div>
                        <div class="player-info">
                            <span v-if="selectedPlayersByIndex[index]">
                                {{ selectedPlayersByIndex[index].Name }}
                            </span>
                            <span v-else>
                                {{ position.label }}
                            </span>
                        </div>
                        <button v-if="selectedPlayersByIndex[index]" class="player-profile-btn"
                            @click.stop="goToPlayerProfile(selectedPlayersByIndex[index]._id)">
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="budget-warning" v-if="budgetExceeded">
            ⚠ Budget Exceeded! (€{{ totalValue }}M / €{{ budget }}M)
        </div>

        <PlayerModal :visible="showModal" :sub_position="selectedSubPosition" @close="showModal = false"
            @player-selected="assignPlayer" />

        <div class="total-value">
            <h3>Total Squad Value: €{{ totalValue }}M</h3>
        </div>
    </div>
</template>

<script>
import PlayerModal from "./PlayerModal.vue";
import { useRouter } from "vue-router";

export default {
    props: {
        budget: {
            type: Number,
            required: true
        },
        selectedPlayers: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        PlayerModal
    },
    setup() {
        const router = useRouter();
        const goToPlayerProfile = (playerId) => {
            if (playerId) {
                router.push(`/playerView/${playerId}`);
            }
        };
        return { goToPlayerProfile };
    },
    data() {
        return {
            selectedIndex: null,
            selectedSubPosition: null,
            showModal: false,
            selectedPlayersByIndex: {},
            defaultPlayerImg: "https://via.placeholder.com/150",
            positions: [
                { sub_position: "Goalkeeper", label: "GK", class: "goalkeeper", top: "48%", left: "5%" },
                { sub_position: "Centre-Back", label: "CB", class: "center-back1", top: "35%", left: "22%" },
                { sub_position: "Centre-Back", label: "CB", class: "center-back2", top: "58%", left: "22%" },
                { sub_position: "Central Midfield", label: "CM", class: "midfielder1", top: "25%", left: "50%" },
                { sub_position: "Defensive Midfield", label: "CDM", class: "midfielder2", top: "50%", left: "40%" },
                { sub_position: "Central Midfield", label: "CM", class: "midfielder3", top: "75%", left: "50%" },
                { sub_position: "Right-Back", label: "RB", class: "left-back", top: "80%", left: "30%" },
                { sub_position: "Left-Back", label: "LB", class: "right-back", top: "15%", left: "30%" },
                { sub_position: "Right Winger", label: "RW", class: "left-wing", top: "85%", left: "85%" },
                { sub_position: "Left Winger", label: "LW", class: "right-wing", top: "15%", left: "85%" },
                { sub_position: "Centre-Forward", label: "ST", class: "striker", top: "50%", left: "88%" }
            ]
        };
    },
    computed: {
        totalValue() {
            return Object.values(this.selectedPlayersByIndex).reduce(
                (sum, player) => sum + (player?.XGBoost_predicted_values || 0),
                0
            );
        },
        budgetExceeded() {
            return this.totalValue > this.budget;
        }
    },
    watch: {
        selectedPlayers: {
            handler(newPlayers) {
                this.assignPlayersToPitch(newPlayers);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        openModal(index, subPosition) {
            this.selectedIndex = index;
            this.selectedSubPosition = subPosition;
            this.showModal = true;
        },
        assignPlayer(player) {
            if (this.selectedIndex !== null) {
                this.selectedPlayersByIndex[this.selectedIndex] = {
                    ...player,
                    pitchIndex: this.selectedIndex, // ✅ Save the pitch index
                    position: this.positions[this.selectedIndex].sub_position
                };

                this.showModal = false;

                // ✅ Emit full players object using pitchIndex
                const updatedPlayers = { ...this.selectedPlayersByIndex };
                this.$emit("update-selected-players", updatedPlayers);
            }
        }
        ,
        assignPlayersToPitch(playersMap) {
            Object.entries(playersMap).forEach(([index, player]) => {
                this.selectedPlayersByIndex[index] = player;
            });
        },
        drawPitch() {
            const canvas = document.getElementById("pitch");
            if (!canvas) return;
            canvas.width = 1400;
            canvas.height = 800;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#060";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#FFF";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.strokeRect(0, (canvas.height - 400) / 2, 180, 400);
            ctx.strokeRect(canvas.width - 180, (canvas.height - 400) / 2, 180, 400);
            ctx.strokeRect(0, (canvas.height - 180) / 2, 60, 180);
            ctx.strokeRect(canvas.width - 60, (canvas.height - 180) / 2, 60, 180);
        }
    },
    mounted() {
        this.drawPitch();
    }
};
</script>




<style scoped>
/* Center the Pitch */
.pitch-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.pitch-container {
    position: relative;
    width: 1400px;
    height: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Player Positioning */
.player-card {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Player Slot */
.player-slot {
    background: #181818;
    border-radius: 10px;
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}



/* Position Label */
.position-label {
    color: #0f0;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-top: 5px;
}

.position-card {
    width: 130px;
    height: 180px;
    background: radial-gradient(circle, #222, #111);
    border-radius: 15px;
    box-shadow: 0px 5px 10px rgba(0, 255, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    border: 3px solid rgba(0, 255, 0, 0.9);
}

.position-card:hover {
    transform: scale(1.1);
    box-shadow: 0px 0px 15px rgba(0, 255, 0, 0.9);
}

/* New Budget Warning Styling */
.budget-warning {
    color: red;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
}

/* Total Squad Value Styling */
.total-value {
    background: #222;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 6px rgba(0, 255, 0, 0.3);
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    color: #0f0;
    width: fit-content;
    margin: 20px auto;
    transition: transform 0.2s ease-in-out;
}

/* Hover Effect */
.total-value:hover {
    transform: scale(1.03);
    box-shadow: 0px 3px 10px rgba(0, 255, 0, 0.4);
}

/* Text Styling */
.total-value h3 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
}

/* Fix Button Placement */
.player-profile-container {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    /* Adds space between the name and button */
}

/* Fix Button Placement */
.player-profile-container {
    display: flex;
    justify-content: center;
    margin-top: 2px;
    /* Ensures space but remains close to the player name */
}

/* Increase Image Size */
.player-image-container {
    width: 100%;
    /* Full width */
    height: 110px;
    /* Bigger image area */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 10px 10px 0 0
}

/* Make Player Image Bigger */
.player-img {
    width: 100%;
    /* Adjust width dynamically */
    height: 100%;
    border-radius: 10px 10px 0 0;
    object-fit: cover;
    /* Ensure it fills space properly */
}

/* Player Name Overlay */
.player-info {
    background: rgba(0, 0, 0, 0.7);
    /* Transparent Black */
    color: #0f0;
    /* Green text */
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    padding: 6px;
    width: 100%;
    border-radius: 0 0 10px 10px;
    /* Keep the overlay aligned */
}

/* 🎯 Profile Button Adjustments */
.player-profile-container {
    display: flex;
    justify-content: center;
    margin-top: 5px;
}

/* 🔥 Adjust Profile Button Size */
.player-profile-btn {
    background: rgba(3, 212, 3, 0.9);
    /* Green glow */
    color: black;
    border: none;
    padding: 8px 0;
    /* Adjust padding for height */
    font-size: 14px;
    font-weight: bold;
    border-radius: 0 0 10px 10px;
    /* Matches bottom of the card */
    cursor: pointer;
    transition: background 0.3s ease-in-out, transform 0.2s ease;
    box-shadow: 0px 2px 4px rgba(0, 255, 0, 0.4);
    width: 100%;
    /* Make button take full width */
    text-align: center;
}

/* 🔥 Hover Effect */
.player-profile-btn:hover {
    background: rgb(4, 187, 4);
    transform: scale(1.03);
}
</style>