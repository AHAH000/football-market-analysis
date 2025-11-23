<template>
  <div class="my-squads">
    <h2>📂 My Saved Squads</h2>

    <div v-if="loading" class="loader">Loading squads...</div>

    <div v-else-if="squads.length > 0" class="squad-list">
      <div v-for="squad in squads" :key="squad._id" class="squad-card">
        <div class="squad-bg" @click="loadSquad(squad)">
          <div class="squad-content">
            <h3>{{ squad.squadName }}</h3>
            <p>💰 Total Value: €{{ formatCurrency(squad.totalValue) }}</p>
          </div>
        </div>
        <button class="delete-btn" @click.stop="confirmDelete(squad._id)">
          🗑️
        </button>
      </div>
    </div>

    <p v-else>No squads saved yet.</p>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="confirm-modal" @click.self="showConfirmModal = false">
      <div class="modal-content">
        <h2>⚠️ Confirm Deletion</h2>
        <p>This squad will be <strong>permanently deleted</strong>.</p>
        <div class="modal-actions">
          <button class="cancel" @click="showConfirmModal = false">Cancel</button>
          <button class="confirm" @click="deleteSquad(squadToDelete)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      squads: [],
      loading: true,
      showConfirmModal: false,
      squadToDelete: null
    };
  },
  mounted() {
    this.fetchMySquads();
  },
  methods: {
    async fetchMySquads() {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login to view your saved squads.");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/squads/my-squads`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok) {
          this.squads = data;
        } else {
          throw new Error(data.message || "Failed to fetch squads.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        this.loading = false;
      }
    },

    loadSquad(squad) {
      this.$router.push({
        name: "SquadBuilderView",
        query: {
          squad: JSON.stringify(squad)
        }
      });
    },

    confirmDelete(squadId) {
      this.showConfirmModal = true;
      this.squadToDelete = squadId;
    },

    async deleteSquad(squadId) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/squads/delete/${squadId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to delete squad");

        this.squads = this.squads.filter(s => s._id !== squadId);
      } catch (err) {
        alert(err.message || "Something went wrong.");
      } finally {
        this.showConfirmModal = false;
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US").format(value);
    }
  }
};
</script>
<style scoped>
.my-squads {
  text-align: center;
  padding: 40px;
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  margin-top: 85px;
}

.loader {
  margin-top: 100px;
  font-size: 1.2rem;
  color: #aaa;
}

.squad-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 30px;
  align-items: center;
}

.squad-card {
  position: relative;
  width: 90%;
  max-width: 680px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(0, 255, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.squad-card:hover {
  transform: scale(1.03);
  box-shadow: 0 0 18px rgba(0, 255, 0, 0.5);
}

.squad-bg {
  background-image: url('@/assets/footballpitchjpg.jpg');
  background-size: cover;
  background-position: center;
  padding: 30px;
  cursor: pointer;
}

.squad-content {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px 20px;
  border-radius: 10px;
}

.squad-content h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.squad-content p {
  margin-top: 8px;
  color: #ccc;
}

.delete-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: red;
  font-size: 1.6rem;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.2);
}

/* Confirmation Modal */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.modal-content {
  background: #111;
  border: 2px solid #2e2e2e;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  width: 95%;
  max-width: 450px;
  animation: pop 0.3s ease;
}

@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-content h2 {
  color: #ff4444;
  margin-bottom: 10px;
}

.modal-content p {
  color: #ccc;
}

.modal-actions {
  margin-top: 25px;
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.modal-actions .cancel {
  background: #0a0;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}

.modal-actions .confirm {
  background: #d00;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
