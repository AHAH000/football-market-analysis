<template>
    <div class="about-container">
      <!-- Header Section -->
      <section class="about-header">
        <h1>About Us</h1>
        <h2 class="subtitle">Football Market Analysis - Your Leading Football Platform</h2>
        <p>
          Welcome to Football Hub, your trusted source for football insights, player valuations, and the latest news.
        </p>
      </section>
  
      <!-- Mission Section -->
      <section class="about-section">
        <div class="about-card">
          <h2>Our Mission</h2>
          <p>
            Empowering football enthusiasts with accurate insights to navigate the dynamic world of football.
          </p>
        </div>
      </section>
  
      <!-- Team Section -->
      <section class="team-section">
        <h2>Meet the Team</h2>
        <div class="team-grid">
          <div class="team-card" v-for="(member, index) in team" :key="index">
            <img :src="member.image" :alt="member.name" />
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'AboutUs',
    setup() {
      const team = [
        { name: 'Ahmed Hamdi Hegazi', role: 'Founder & CEO', image: 'src/assets/team1.jpg' },
     
      ];
  
      return { team };
    },
  });
  </script>
  
  <style scoped>
  /* General Styling */
  .about-container {
    padding: 40px;
    color: #ffffff;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #121212, #292929);
    text-align: center;
    animation: fadeInPage 1s ease-in-out;
    margin-top: 100px;
  }
  
  /* Header Section */
  .about-header h1 {
    font-size: 3rem;
    color: #00ff00;
    margin-bottom: 10px;
    animation: fadeIn 1s ease-in-out;
  }
  
  .about-header .subtitle {
    font-size: 1.5rem;
    color: #cccccc;
    margin-bottom: 20px;
    animation: fadeIn 1.5s ease-in-out;
  }
  
  .about-header p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    color: #cccccc;
    animation: fadeIn 2s ease-in-out;
  }
  
  /* Mission Section */
  .about-section {
    margin: 40px auto;
    max-width: 800px;
  }
  
  .about-card {
    background: #1e1e1e;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
    animation: zoomIn 1.2s ease-in-out;
  }
  
  .about-card h2 {
    color: #00ff00;
    margin-bottom: 15px;
  }
  
  .about-card p {
    color: #cccccc;
    font-size: 1rem;
    line-height: 1.6;
  }
  
  /* Team Section */
  .team-section {
    margin-top: 40px;
  }
  
  .team-section h2 {
    font-size: 2rem;
    color: #00ff00;
    margin-bottom: 30px;
  }
  
  .team-grid {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .team-card {
    background: #1e1e1e;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    max-width: 180px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    animation: fadeIn 1.5s ease-in-out;
  }
  
  .team-card:hover {
    transform: scale(1.1);
    background-color: #2a2a2a;
  }
  
  .team-card img {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-bottom: 10px;
  }
  
  .team-card h3 {
    color: #00ff00;
    margin-bottom: 5px;
  }
  
  .team-card p {
    font-size: 0.9rem;
    color: #cccccc;
  }
  
  /* Animations */
  @keyframes fadeInPage {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  