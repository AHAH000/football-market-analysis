<template>
  <div class="top-players-container">
    <swiper
      v-if="computedCompetitions.length > 0"
      :modules="[Pagination, Navigation]"
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      :navigation="true"
      class="competition-carousel"
    >
      <swiper-slide
        v-for="competition in computedCompetitions"
        :key="competition._id"
      >
        <div class="competition-section">
          <div class="league-header">
            <img
              :src="getLeagueIcon(competition._id)"
              alt="League Icon"
              class="league-icon"
            />
            <br>
          </div>
          <h3 class="competition-title">
            Top 5 Players in {{ getLeagueName(competition._id) }}
          </h3>
          <div class="players-list">
            <div
              v-for="player in competition.topPlayers"
              :key="player._id"
              class="player-card"
            >
              <img
                :src="player.image_url"
                alt="Player Image"
                class="player-image"
              />
              <div class="player-info">
                <h4 class="player-name">{{ player.Name }}</h4>
                <p class="player-value">
                  €{{ formatCurrency(player.XGBoost_predicted_values) }}
                </p>
                <router-link
                  :to="`/playerView/${player._id}`"
                  class="view-profile"
                  >View Profile</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <div v-else>
      <p class="loading-message">Loading top players...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Player {
  _id: string;
  Name: string;
  market_value_in_eur: number;
  image_url: string;
  XGBoost_predicted_values:number,
}

interface Competition {
  _id: string;
  topPlayers: Player[];
}

export default defineComponent({
  name: "Top5Section",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    leagueId: {
      type: String,
      default: null, // If null, use all leagues
    },
  },
  setup(props) {
    const competitions = ref<Competition[]>([]);
    const allowedCompetitions = ["GB1", "FR1", "ES1", "IT1", "L1"];

    const leagueMapping: Record<string, { name: string; icon: string }> = {
      GB1: {
        name: "Premier League",
        icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/420px-Premier_League_Logo.svg.png",
      },
      FR1: {
        name: "Ligue 1",
        icon: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Ligue_1_2024.svg/255px-Ligue_1_2024.svg.png",
      },
      ES1: {
        name: "LaLiga",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/360px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png",
      },
      IT1: {
        name: "Serie A",
        icon: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/210px-Serie_A_ENILIVE_logo.svg.png",
      },
      L1: {
        name: "Bundesliga",
        icon: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/270px-Bundesliga_logo_%282017%29.svg.png",
      },
    };

    const fetchTopPlayers = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/players/getTop5`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch top players");
        const data = await response.json();
        competitions.value = data;
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    const computedCompetitions = computed(() => {
      if (props.leagueId) {
        return competitions.value.filter((comp) => comp._id === props.leagueId);
      }
      return competitions.value.filter((comp) =>
        allowedCompetitions.includes(comp._id)
      );
    });

    const getLeagueName = (competitionId: string) =>
      leagueMapping[competitionId]?.name || competitionId;

    const getLeagueIcon = (competitionId: string) =>
      leagueMapping[competitionId]?.icon || "";

    const formatCurrency = (value: number) =>
      value ? value.toLocaleString() : "N/A";

    watch(() => props.leagueId, fetchTopPlayers, { immediate: true });

    onMounted(() => {
      fetchTopPlayers();
    });

    return {
      computedCompetitions,
      formatCurrency,
      Pagination,
      Navigation,
      getLeagueName,
      getLeagueIcon,
    };
  },
});
</script>

  
  <style scoped>
  .top-players-container {
    background: linear-gradient(145deg, #1b1b1b, #222222); /* Gradient background */
    color: #e0e0e0;
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
    text-align: center;
    max-width: 1500px; /* Wider container */
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }


  .title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #00ff00;
    text-shadow: 0 1px 5px rgba(0, 255, 0, 0.5);
  }
  
  /* Swiper Carousel */
  .competition-carousel {
    width: 100%;
  }
  
  .competition-title {
    font-size: 22px;
    font-weight: bold;
    color: #00ff99;
    margin-bottom: 15px;
  }
  
  .players-list {
    display: flex;
    gap: 30px; /* Increased distance between cards */
    justify-content: center;
  }
  
  .player-card {
    background: linear-gradient(145deg, #333, #222); /* Gradient background for cards */
    width: 260px;
    height: 380px; /* Uniform height */
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .player-card:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.6);
  }
  
  .player-image {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #00ff99;
    margin-bottom: 10px;
  }
  
  .player-info {
    margin-top: 10px;
  }
  
  .player-name {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
  }
  
  .player-value {
    font-size: 16px;
    font-weight: bold;
    color: #00ff99;
    margin-bottom: 15px;
  }
  
  .view-profile {
    display: inline-block;
    margin-top: auto; /* Align at the same level */
    padding: 10px 15px;
    background: #00ff00; /* Button color */
    color: #121212;
    font-size: 14px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    transition: background 0.3s ease;
  }
  
  .view-profile:hover {
    background: #009900; /* Darker green on hover */
  }
  
  /* Swiper Navigation */
/* Adjust the color and placement of navigation arrows */
.swiper-container .swiper-button-prev,
.swiper-container .swiper-button-next {
  color: #ffffff; /* White color for better visibility */
  font-size: 28px; /* Slightly larger for better accessibility */
  background-color: rgba(0, 255, 0, 0.7); /* Semi-transparent green background */
  border-radius: 50%; /* Circular buttons */
  padding: 10px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow for depth */
  transition: all 0.3s ease; /* Smooth animation */
}

.swiper-container .swiper-button-prev:hover,
.swiper-container .swiper-button-next:hover {
  background-color: rgba(0, 200, 0, 1); /* Darker green on hover */
  transform: scale(1.2); /* Slight zoom effect */
}

/* Positioning arrows outside the card container */
.swiper-container .swiper-button-prev {
  left: -50px; /* Move the left arrow further left */
}

.swiper-container .swiper-button-next {
  right: -50px; /* Move the right arrow further right */
}

/* Adjust the color and size of pagination bullets */
.swiper-container .swiper-pagination-bullet {
  background: rgba(0, 255, 0, 0.7); /* Semi-transparent green bullets */
  opacity: 0.7; /* Subtle transparency */
  width: 12px;
  height: 12px;
  margin: 0 6px; /* Increase spacing between bullets */
  transition: all 0.3s ease;
}

.swiper-container .swiper-pagination-bullet-active {
  background: #00ff00; /* Fully opaque green for the active bullet */
  opacity: 1;
  transform: scale(1.3); /* Slight enlargement for the active bullet */
}

/* Ensure the pagination is centered and spaced from the cards */
.swiper-container .swiper-pagination {
  bottom: -25px; /* Move pagination below the cards */
}

  
  /* Loading message */
  .loading-message {
    text-align: center;
    font-size: 16px;
    color: #ff0000;
  }
  /* League Header */
/* League Header */
.league-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px; /* Adjust spacing for better layout */
    margin-bottom: 20px; /* Add more space below the header */
}

.league-icon {
    width: 100px; /* Size of the icon */
    height: 100px;
    object-fit: contain;
    background-color: #ffffff; /* Light background for visibility */
    border-radius: 25%; /* Circular shape */
    padding: 5px; /* Reduced padding to ensure the entire icon fits */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Depth effect */
    display: flex;
    align-items: center;
    justify-content: center; /* Center the icon */
}

  

.competition-title {
    font-size: 24px; /* Slightly larger font size */
    font-weight: bold;
    color: #00ff99;
    margin: 0;
    text-shadow: 0 1px 5px rgba(0, 255, 0, 0.5); /* Subtle text shadow for better readability */
}

  
  </style>
  