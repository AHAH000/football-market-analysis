<template>
  <div class="fixture-container">
    <h2 class="title">Fixtures & Results</h2>
    <swiper
      v-if="competitions.length > 0"
      :modules="[Pagination, Navigation]"
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      :navigation="true"
      class="fixture-carousel"
    >
      <swiper-slide
        v-for="competition in competitions"
        :key="competition.id"
        class="competition-slide"
      >
        <div class="competition-header">
          <img :src="competition.logo" alt="Competition Logo" class="competition-logo" />
          <h3 class="competition-name">{{ competition.name }}</h3>
        </div>
        <!-- Embed HTML dynamically with v-html -->
        <div v-html="competition.embedHtml"></div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default defineComponent({
  name: "FixtureComponent",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const competitions = [
      {
        id: "premier-league",
        name: "Premier League",
        logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        embedHtml: `<div class="fwp-embed" data-background-color="#181818" data-url="premier-league/fixtures-results"></div>`,
      },
      {
        id: "ligue-1",
        name: "Ligue 1",
        logo: "https://upload.wikimedia.org/wikipedia/en/8/83/Ligue_1_2024.svg",
        embedHtml: `<div class="fwp-embed" data-background-color="#181818" data-url="ligue-1/fixtures-results"></div>`,
      },
      {
        id: "bundesliga",
        name: "Bundesliga",
        logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
        embedHtml: `<div class="fwp-embed" data-background-color="#181818" data-url="bundesliga/fixtures-results"></div>`,
      },
      {
        id: "serie-a",
        name: "Serie A",
        logo: "https://upload.wikimedia.org/wikipedia/en/a/ab/Serie_A_ENILIVE_logo.svg",
        embedHtml: `<div class="fwp-embed" data-background-color="#181818" data-url="serie-a/fixtures-results"></div>`,
      },
      {
        id: "laliga",
        name: "LaLiga",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg",
        embedHtml: `<div class="fwp-embed" data-background-color="#181818" data-url="spanish-la-liga/fixtures-results"></div>`,
      },
    ];

    onMounted(() => {
  if (!document.querySelector('script[src="https://www.footballwebpages.co.uk/embed.js"]')) {
    const script = document.createElement("script");
    script.src = "https://www.footballwebpages.co.uk/embed.js";
    script.defer = true;
    document.body.appendChild(script);
  }
});


    return {
      competitions,
      Pagination,
      Navigation,
    };
  },
});
</script>

<style scoped>
.fixture-container {
  background: linear-gradient(145deg, #1b1b1b, #222222);
  color: #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  text-align: center;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #00ff00;
  text-shadow: 0 1px 5px rgba(0, 255, 0, 0.5);
}

.fixture-carousel {
  width: 100%;
}

.competition-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.competition-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.competition-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background-color: #ffffff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.competition-name {
  font-size: 22px;
  font-weight: bold;
  color: #00ff99;
  margin: 0;
}
</style>
