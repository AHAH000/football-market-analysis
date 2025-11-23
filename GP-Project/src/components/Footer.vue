<template>
    <footer class="footer">
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section">
          <h3 class="footer-heading">Football Hub</h3>
          <p class="footer-text">
            We provide accurate and up-to-date valuations for football players worldwide.
          </p>
        </div>
  
        <!-- Quick Links Section -->
        <div class="footer-section">
          <h3 class="footer-heading">Quick Links</h3>
          <ul class="footer-links">
            <li><router-link to="/Teams">Teams</router-link></li>
            <li><router-link to="/MarketValues">Market Values</router-link></li>
            <li><router-link to="/about">About us</router-link></li>
          </ul>
        </div>
  
        <!-- Social Media Section -->
        <div class="footer-section">
          <h3 class="footer-heading">Follow Us</h3>
          <div class="social-icons">
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
  
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="footer-copy">&copy; 2025 Football Player Valuation.</p>
      </div>
    </footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Footer',
  });
  </script>
  
  <style scoped>
  .footer {
    background-color: #1e1e1e;
    color: #ffffff;
    padding: 2rem 0;
    font-family: 'Arial', sans-serif;
    border-top: 4px solid #00ff00;
    animation: flicker 3s infinite; /* Flickering animation */
  }
  /* Flickering Animation */
@keyframes flicker {
    0%, 50% {
      border-color: #00ff00; /* Bright green */
    }
    25%, 75% {
      border-color: #004d00; /* Dimmer green */
    }
    100% {
      border-color: #00ff00; /* Back to bright green */
    }
  }
  
  .footer-content {
    display: flex;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    flex-wrap: wrap; /* Ensures responsiveness */
  }
  
  .footer-section {
    flex: 1;
    margin: 1rem;
    min-width: 200px; /* Prevents sections from becoming too narrow */
  }
  
  .footer-heading {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #00ff00;
  }
  
  .footer-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #cccccc;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin-bottom: 0.5rem;
  }
  li{
    background-color: none;
  }
  
  .footer-links a {
    text-decoration: none; /* Removes underline */
    color: #cccccc; /* Default text color */
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .footer-links a:hover {
    color: #00ff00; /* Changes text color on hover */
  }
  
  .social-icons {
    display: flex;
    justify-content: center; /* Centers icons horizontally */
    align-items: center; /* Aligns icons vertically */
    gap: 1rem;
    margin-top: 1rem; /* Adds spacing between the heading and icons */
  }
  
  .social-icon {
    color: #cccccc;
    font-size: 1.5rem;
    transition: color 0.3s ease;
  }
  
  .social-icon:hover {
    color: #00ff00;
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #333333;
  }
  
  .footer-copy {
    font-size: 0.8rem;
    color: #cccccc;
  }
  </style>