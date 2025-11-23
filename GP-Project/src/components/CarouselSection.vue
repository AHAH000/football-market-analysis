<template>
  <div class="carousel-container">
    <div class="carousel" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(slide, index) in slides" :key="index" class="slide" @click="routeToPage">
        <img :src="slide.image" :alt="slide.alt" class="slide-image" />
        <div class="slide-content">
          <h3 class="slide-title">{{ slide.title }}</h3>
          <p class="slide-description">{{ slide.description }}</p>
        </div>
      </div>
    </div>
    <button class="carousel-button prev" @click="prevSlide">&#10094;</button>
    <button class="carousel-button next" @click="nextSlide">&#10095;</button>
    <div class="indicators">
      <span
        v-for="(slide, index) in slides"
        :key="index"
        :class="['indicator', { active: currentIndex === index }]"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

interface Slide {
  image: string;
  alt: string;
  title: string;
  description: string;
  route: string; 
}

export default defineComponent({
  name: 'CarouselSection',
  setup() {
    const router = useRouter(); // Inject Vue Router
    return { router };
  },
  data() {
    return {
      currentIndex: 0,
      slides: [
        {
          image: 'src/assets/Teams.png',
          alt: 'Teams',
          title: 'Teams',
          description: 'Check out The Teams.',
          route: '/Teams', // Define the route for Teams
        },
        {
          image: 'src/assets/MarketValues.png',
          alt: 'Market Value',
          title: 'Market Value',
          description: 'Check out the market values of players.',
          route: '/MarketValues', // Define the route for Market Values
        },
        {
          image: 'src/assets/Kick90_Logo.png',
          alt: 'Player Spotlight',
          title: 'Player Spotlight',
          description: 'Get to know the star players making headlines.',
          route: '/players', // Define the route for Player Spotlight
        },
      ] as Slide[],
    };
  },
  methods: {
    nextSlide(): void {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    },
    prevSlide(): void {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    },
    goToSlide(index: number): void {
      this.currentIndex = index;
    },
    routeToPage(): void {
      // Get the selected slide's route and navigate
      const selectedSlide = this.slides[this.currentIndex];
      if (selectedSlide.route) {
        this.$router.push(selectedSlide.route);
      }
    },
  },
});
</script>


<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1800px;
  margin: 20px auto; /* Add vertical and horizontal margins */
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #1e1e1e; /* Ensure a cohesive background */
  padding: 10px; /* Add padding for spacing within the container */
  margin-top: 150px;
  max-height: 1090px;
  max-height: 888px;
  height: 73%;
}

.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  position: relative;
}

.slide-image {
  width: 100%;
  display: block;
  border-radius: 8px; /* Add rounded corners to the images */
  height: 500px;
  max-height: 100%;
  object-fit:fill;
}

.slide-content {
  position: absolute;
  bottom: 10%;
  left: 10%;
  right: 10%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.slide-title {
  margin: 0;
  font-size: 24px;
  color: #4caf50; /* Green */
}

.slide-description {
  margin: 10px 0 0;
  font-size: 16px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.carousel-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.indicator {
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.indicator.active {
  opacity: 1;
  background-color: #4caf50; /* Green */
}

.indicator:hover {
  opacity: 1;
}

</style>
