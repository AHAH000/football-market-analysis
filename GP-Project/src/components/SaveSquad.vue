<template>
    <div class="save-squad">
      <div class="form-row">
        <input
          type="text"
          v-model="squadName"
          placeholder="Enter Squad Name"
          class="squad-name-input"
        />
        <button @click="handleSaveSquad">💾 Save Squad</button>
      </div>
  
      <transition name="fade">
        <div v-if="message" :class="['message-box', isSuccess ? 'success' : 'error']">
          {{ message }}
        </div>
      </transition>
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      squad: Object,
      budget: Number
    },
    data() {
      return {
        squadName: "",
        message: '',
        isSuccess: false
      };
    },
    methods: {
      async handleSaveSquad() {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
  
        if (!user || !token) {
          this.message = "🔒 Please login to save your squad!";
          this.isSuccess = false;
          return;
        }
  
        if (!this.squadName.trim()) {
          this.message = "📝 Please enter a name for your squad!";
          this.isSuccess = false;
          return;
        }
  
        const playersArray = Object.entries(this.squad)
          .filter(([_, player]) => player && player._id)
          .map(([index, player]) => ({
            position: player.position,
            pitchIndex: Number(index),
            ...player
          }));
  
        if (playersArray.length === 0) {
          this.message = "⚠️ Select at least one player before saving!";
          this.isSuccess = false;
          return;
        }
  
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/squads/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              squadName: this.squadName,
              players: playersArray,
              totalValue: this.budget
            })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            this.message = "✅ Squad saved successfully!";
            this.isSuccess = true;
            this.squadName = "";
          } else {
            throw new Error(data.message || "Failed to save squad.");
          }
        } catch (error) {
          this.message = `❌ ${error.message}`;
          this.isSuccess = false;
        }
  
        setTimeout(() => {
          this.message = '';
        }, 3500);
      }
    }
  };
  </script>
  
  <style scoped>
  .save-squad {
    margin-top: 30px;
    text-align: center;
    padding: 25px;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    background-color: #111;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.15);
    margin-inline: auto;
  }
  
  /* Horizontal row for input + button */
  .form-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  /* Input Field */
  .squad-name-input {
    padding: 12px;
    flex: 1 1 250px;
    border-radius: 8px;
    border: 2px solid #00ff00;
    background: #1a1a1a;
    color: #fff;
    font-size: 16px;
    transition: border 0.3s;
    text-align: center;
  }
  
  .squad-name-input:focus {
    outline: none;
    border-color: #00ffcc;
  }
  
  /* Save Button */
  .save-squad button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #00ff00, #00cc66);
    color: #000;
    font-weight: bold;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.3s;
    flex-shrink: 0;
  }
  
  .save-squad button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px #00ff00;
  }
  
  /* Message Popup */
  .message-box {
    margin-top: 20px;
    padding: 14px 22px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .success {
    background-color: rgba(0, 128, 0, 0.3);
    border: 1px solid #00ff00;
    color: #00ff00;
  }
  
  .error {
    background-color: rgba(128, 0, 0, 0.3);
    border: 1px solid red;
    color: #ff4d4d;
  }
  
  /* Transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
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
  
  </style>
  