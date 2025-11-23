<template>
  <div class="market-values-page">
    <h1 class="page-title">Market Values</h1>
    <PlayerFilter @filter="handlePlayerFilter" />

    <!-- Loading Screen -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-else>
      <div v-if="players.length > 0" class="players-container">
        <!-- Display 4 players per row, 12 per page -->
        <router-link v-for="(player, index) in players" :key="index" :to="`/playerView/${player._id}`"
          class="player-card-link">
          <div class="player-card">
            <div class="player-header">
              <div class="player-image-wrapper">
                <img :src="player.image_url" alt="Player Image" class="player-image" />
              </div>
              <div class="player-basic-info">
                <h2 class="player-name">{{ player.Name }}</h2>
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
                <p class="market-value">
                  Market Value: €{{ formatCurrency(player.XGBoost_predicted_values) }}
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div v-else>
        <p class="no-results">No players available.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CountryFlag from "vue-country-flag-next";
import iso31661 from "iso-3166-1";
import PlayerFilter from "@/components/PlayerFilter.vue";
interface Player {
  _id: string;
  Name: string;
  Nationality: string;
  age: number;
  sub_position: string;
  market_value_in_eur: number;
  image_url: string;
  XGBoost_predicted_values: number;
  country_of_citizenship: string;
}

export default defineComponent({
  name: "MarketValues",
  components: {
    CountryFlag,
    PlayerFilter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const players = ref<Player[]>([]);
    const currentPage = ref(parseInt(route.query.page as string) || 1);
    const totalPages = ref(1);
    const playersPerPage = 12; // Ensure 12 players per page
    const isLoading = ref(false); // For loading screen

    const fetchPlayers = async () => {
      try {
        isLoading.value = true; // Show loading screen
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/players?page=${currentPage.value}&limit=${playersPerPage}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        players.value = data.players || [];
        totalPages.value = data.totalPages || 1;
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setTimeout(() => {
          isLoading.value = false; // Hide loading screen after delay
        }, 500); // Add slight delay for smoother UX
      }
    };
    const handlePlayerFilter = async (filters: any) => {
      try {
        isLoading.value = true;

        // Check if filters is empty
        if (Object.keys(filters).length === 0) {
          // No filters applied — fetch original list
          await fetchPlayers();
          return;
        }

        // If filters are provided, build query
        const params = new URLSearchParams(filters).toString();
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/players/filter?${params}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error("Filtering failed");

        const data = await response.json();
        players.value = data;
        totalPages.value = 1;
        currentPage.value = 1;
      } catch (error) {
        console.error("Filter error:", error);
        players.value = [];
      } finally {
        isLoading.value = false;
      }
    };



    const getCountryCode = (nationality: string) => {
      const country = iso31661.whereCountry(nationality);
      return country?.alpha2?.toLowerCase() || null;
    };

    const formatCurrency = (value: number) => (value ? value.toLocaleString() : "N/A");

    const getPositionIcon = (position: string) => {
      const positionIcons: Record<string, string> = {
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

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        router.push({ query: { page: currentPage.value } });
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        router.push({ query: { page: currentPage.value } });
      }
    };

    watch(
      () => route.query.page,
      (newPage) => {
        currentPage.value = parseInt(newPage as string) || 1;
        fetchPlayers();
      },
      { immediate: true }
    );

    return {
      players,
      currentPage,
      totalPages,
      isLoading,
      getCountryCode,
      formatCurrency,
      getPositionIcon,
      prevPage,
      nextPage,
      handlePlayerFilter,
    };
  },
});
</script>

<style scoped>
/* Page Styling */
.market-values-page {
  color: #e0e0e0;
  padding: 20px;
  max-width: 1400px;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
  margin-top: 150px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #00ff00;
  text-shadow: 0 2px 10px rgba(0, 255, 0, 0.6);
}

/* Player Card Styling */
.players-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 4 cards per row */
  gap: 20px;
  justify-content: center;
}

.player-card-link {
  text-decoration: none;
  color: inherit;
}

.player-card {
  background: linear-gradient(145deg, #1f1f1f, #292929);
  /* Metallic effect */
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0px 0px 15px rgba(0, 255, 0, 0.5), inset 0px 0px 10px rgba(255, 255, 255, 0.2);
  height: 350px;
  /* Equal height for all cards */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.4);
}

/* Player Image */
.player-image-wrapper {
  text-align: center;
  padding: 10px;
}

.player-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #00ff00;
  margin: 0 auto;
}

/* Basic Info */
.player-basic-info {
  padding: 10px;
  text-align: center;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #00ff00;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  color: black;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #00cc00;
}

.pagination button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* Loading Spinner */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-spinner {
  border: 5px solid #ccc;
  border-top: 5px solid #00ff00;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>