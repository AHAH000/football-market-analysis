<template>
  <div class="home-container">
    <!-- Hero Section with Carousel -->
    <section class="hero-section">
      <CarouselSection />
    </section>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Left Section: Top Goal Scorers -->
      <div class="left-section">
        <section class="top-goal-scorers">
          <TopGoalScoccer />
        </section>
        <section class="top-goal-scorers">
          <TodayMatches />
        </section>

      </div>

      <!-- Right Section: News Cards and Table Standards -->
      <div class="right-section">
        <section class="news-section">
          <NewsCards />
        </section>
        <section class="league-standings">
          <LeagueStandings />
        </section>
      </div>
    </div>

    <!-- Featured Section: Top 5 Players -->
    <section class="featured-section">
      <Top5Section />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CarouselSection from '@/components/CarouselSection.vue';
import NewsCards from '@/components/NewsCards.vue';
import Top5Section from '@/components/Top5Section.vue';
import TopGoalScoccer from '@/components/TopGoalScoccer.vue';
import LeagueStandings from '@/components/LeagueStandings.vue';
import TodayMatches from '@/components/TodayMatches.vue';
export default defineComponent({
  components: {
    CarouselSection,
    NewsCards,
    Top5Section,
    TopGoalScoccer,
    LeagueStandings,
    TodayMatches,
  },
});
</script>

<style scoped>
/* Overall Layout */
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  background-color: #121212; /* Dark background for the page */
  color: #fff; /* Ensure text is readable */
}

/* Hero Section with Carousel */
.hero-section {
  width: 100%;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Main Content Section */
.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

/* Left Section */
.left-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-goal-scorers {
  background-color: #1b1b1b;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

/* Right Section */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-section {
  background-color: #1a1a1a;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}

/* Reduced Width for League Standings */
.league-standings {
  background-color: #1b1b1b;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%; /* Full width of the right section */
}

/* Featured Section: Top 5 Players */
.featured-section {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
}
</style>
