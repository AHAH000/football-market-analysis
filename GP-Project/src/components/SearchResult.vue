<template>
    <div class="search-results-page">
      <h1 class="page-title">Search Results</h1>
      <div v-if="results.length > 0" class="results-container">
        <!-- Loop through the results to display each player as a card -->
        <router-link
          v-for="(player, index) in results"
          :key="index"
          :to="`/playerView/${player._id}`"
          class="player-card-link"
        >
          <div class="player-card">
            <div class="player-header">
              <div class="player-image-wrapper">
                <img :src="player.image_url" alt="Player Image" class="player-image" />
              </div>
              <div class="player-basic-info">
                <h2 class="player-name">{{ player.Name }}</h2>
                <div class="flag-container">
                  <CountryFlag
                    v-if="getCountryCode(player.Nationality)"
                    :country="getCountryCode(player.Nationality)"
                    class="country-flag"
                  />
                  <span class="country-name">{{ player.Nationality }}</span>
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
        <p class="no-results">No results found for "{{ searchQuery }}".</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import CountryFlag from "vue-country-flag-next";
  import iso31661 from "iso-3166-1";
  
  // Define the Player interface to match the API response
  interface Player {
    _id: string; // Object ID from the API
    Name: string;
    Nationality: string;
    age: number;
    sub_position: string;
    market_value_in_eur: number;
    image_url: string;
    XGBoost_predicted_values:number;
  }
  
  export default defineComponent({
    name: "SearchResults",
    components: {
      CountryFlag,
    },
    setup() {
      const route = useRoute();
      const searchQuery = ref(route.query.query || "");
      const results = ref<Player[]>([]);
  
      const fetchResults = async () => {
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/search`;
          const response = await fetch(`${apiUrl}?query=${searchQuery.value}`);
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }
          const data = await response.json();
          results.value = data.players || [];
        } catch (error) {
          console.error("Error fetching search results:", error);
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
  
      // Watch the query parameter and fetch results when it changes
      watch(
        () => route.query.query,
        (newQuery) => {
          searchQuery.value = newQuery || "";
          fetchResults();
        },
        { immediate: true }
      );
  
      return {
        searchQuery,
        results,
        getCountryCode,
        formatCurrency,
        getPositionIcon,
      };
    },
  });
  </script>
  
  <style scoped>
  .search-results-page {
    background-color: #121212;
    color: #e0e0e0;
    padding: 20px;
    max-width: 1000px;
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
  
  .results-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
  
  .player-card-link {
    text-decoration: none;
    color: inherit;
  }
  
  .player-card {
    background-color: #1b1b1b;
    width: 220px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .player-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.8);
  }
  
  .player-image-wrapper {
    text-align: center;
    padding: 10px;
  }
  
  .player-image {
    width: 100px; /* Adjust width as needed */
    height: 100px; /* Make height equal to width */
    object-fit: cover;
    border-radius: 50%; /* This makes the image circular */
    border: 2px solid #00ff00; /* Add a green border */
    margin: 0 auto; /* Center the image */
  }
  
  
  .player-basic-info {
    padding: 10px;
    text-align: center;
  }
  
  .player-name {
    font-size: 18px;
    font-weight: bold;
    color: #e0e0e0;
    margin-bottom: 5px;
  }
  
  .country-name {
    font-size: 14px;
    color: #00ff00;
  }
  
  .player-info {
    font-size: 14px;
    color: #cccccc;
    margin: 5px 0;
  }
  
  .player-position {
    font-size: 14px;
    color: #00ff00;
  }
  
  .market-value {
    font-size: 16px;
    font-weight: bold;
    color: #00ff00;
    margin-top: 5px;
  }
  
  .no-results {
    text-align: center;
    font-size: 18px;
    color: #ff0000;
  }
  </style>
  