<template>
  <header class="header">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <span><router-link to="/" class="login-link-text">        
          <img src="@/assets/NewLogo.png" alt="Logo" />
        </router-link></span>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Enter your search term" />
        <button @click="search"><i class="fas fa-search"></i></button>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results">
        <ul>
          <li v-for="(result, index) in searchResults" :key="index">
            {{ result.Name }} - {{ result.market_value_in_eur }} EUR
          </li>
        </ul>
      </div>

      <!-- User Actions -->
      <div class="user-actions">
        <div class="user-profile" v-if="isLoggedIn">
          <img :src="profileImageSrc" alt="User Profile" class="profile-image" @click="goToEditProfile" />
        </div>

        <!-- <button class="icon-btn"><i class="fas fa-user"></i></button> -->
        <!-- <button class="icon-btn"><i class="fas fa-bookmark"></i></button> -->
        <!-- <button class="icon-btn"><i class="fas fa-shield-alt"></i></button> -->
      
        <!-- Admin: Write Article -->
        <button v-if="isAdmin" class="icon-btn" @click="showAddArticlePopup = true">
          <i class="fas fa-pen"></i>

        </button>
        <button v-if="isAdmin" class="icon-btn" @click="goToplayerCreate" >
          <i class="fas fa-user"></i>
        </button>
        <!-- Dynamic Login/Logout Button -->
        <button v-if="!isLoggedIn" class="login-btn">
          <router-link to="/login" class="login-link-text">Login</router-link>
        </button>
        <button v-else @click="logout" class="logout-btn">Logout</button>
      </div>

      <!-- Hamburger Menu -->
      <button class="hamburger" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <!-- Navigation Bar -->
    <nav class="nav-bar" :class="{ 'open-menu': isMobileMenuOpen }">
      <ul>
        <!-- <li><a href="#">Transfers & Rumours</a></li> -->
        <li><router-link to="/MarketValues">Market Values</router-link></li>
        <li><router-link to="/Competition">Competitions</router-link></li>
        <li><router-link to="/Teams">Teams</router-link></li>
        <!-- <li><a href="#">Statistics</a></li> -->
        <li><router-link to="/WordCloud">Word Cloud Generation</router-link></li>
        <li><router-link to="/PlayerValueGen">Player Price Estimator</router-link></li>
        <li><router-link to="/SquadBuilderView">Squad Builder</router-link></li>

      </ul>
    </nav>

    <!-- Add Article Popup -->
    <PopupAddArticle v-if="showAddArticlePopup" @close="showAddArticlePopup = false" />
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { isTokenValid, clearSession } from "../utils/authUtils";
import { useRouter } from "vue-router";
import PopupAddArticle from "./PopupAddArticle.vue";

interface Player {
  Name: string;
  market_value_in_eur: number;
}

export default defineComponent({
  name: "Header",
  components: {
    PopupAddArticle, // Register the popup component
  },
  setup() {
    const searchQuery = ref("");
    const searchResults = ref<Player[]>([]);
    const isMobileMenuOpen = ref(false);
    const isLoggedIn = ref(false);
    const showAddArticlePopup = ref(false);
    const userProfileImage = ref("");

    // Check if the user is an admin
    const isAdmin = ref(
      JSON.parse(localStorage.getItem("user") || "{}").role === "admin"
    );

    const router = useRouter();

    // Computed property for profile image fallback
    const profileImageSrc = computed(() => {
      return userProfileImage.value
        ? userProfileImage.value
        : new URL("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg", import.meta.url).href;
    });


    const search = async () => {
      try {
        if (!searchQuery.value) {
          console.log("Please enter a search query.");
          return;
        }
        router.push({ name: "SearchResults", query: { query: searchQuery.value } });
      } catch (error) {
        console.error("Error during search:", error);
      }
    };

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const logout = () => {
      clearSession();
      isLoggedIn.value = false;
      window.location.href = "/";
    };

    const goToEditProfile = () => {
      router.push("/EditProfile");
    };
    const goToplayerCreate = () => {
      router.push("/CreatePlayer");
    };

    onMounted(() => {
      isLoggedIn.value = isTokenValid();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userProfileImage.value = user.profileImage || "";
    });

    return {
      searchQuery,
      searchResults,
      isMobileMenuOpen,
      isLoggedIn,
      isAdmin,
      search,
      toggleMobileMenu,
      logout,
      showAddArticlePopup,
      profileImageSrc,
      goToEditProfile,
      goToplayerCreate,
    };
  },
});
</script>

<style scoped>
/* General Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(135deg, #1c1c1e, #292929);
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

body {
  margin: 0;
  padding-top: 120px; /* Offset for fixed navbar */
}

/* Navbar Container */
/* Navbar Container - Set a fixed height */
.navbar-container {
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  height: 70px; /* Fixed height to prevent resizing */
}

/* Logo Section */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%; /* Prevent affecting navbar height */
}

/* Allow the logo to scale but not affect navbar */
.logo img {
  height: 80px; /* Increase size */
  width: 80px;
  max-height: 100%; /* Ensures it stays within navbar */
  object-fit: contain; /* Prevents distortion */
}

.logo:hover {
  transform: scale(1.1);
}

.logo span {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #00ff99, #00cc88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  background: #333;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.search-bar:hover {
  background: #444;
}

.search-bar input {
  border: none;
  outline: none;
  padding: 5px 10px;
  background: transparent;
  color: #fff;
  flex: 1;
}

.search-bar button {
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s;
}

.search-bar button:hover {
  transform: scale(1.2);
}

/* User Actions */
.user-actions {
  display: flex;
  gap: 15px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.icon-btn:hover {
  color: #00cc88;
  transform: scale(1.2);
}

.login-btn {
  padding: 5px 15px;
  border-radius: 20px;
  background: linear-gradient(135deg, #00ff99, #00cc88);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 255, 153, 0.4);
}
.login-link-text {
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit color from parent */
  font-weight: bold; /* Optional: Ensure bold font matches the button */
  display: inline-block; /* Optional: Ensures it behaves like a button */
}

.login-link-text:hover {
  color: inherit; /* Prevent color change on hover */
  text-decoration: none; /* Ensure no underline on hover */
}


/* Navigation Bar */
.nav-bar {
  background-color: #292929;
  width: 100%;
  padding: 10px 0;
  border-bottom: 4px solid #00ff00; /* Green bottom border */
  overflow: hidden;
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
/* Navigation Bar Links */
.nav-bar ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-bar a {
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-bar a:hover {
  color: #00ff99;
  transform: scale(1.1);
}

/* Mobile Menu Open */
.nav-bar.open-menu {
  max-height: 300px;
}

/* Hamburger Menu */
.hamburger {
  display: none;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s;
}

.hamburger:hover {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-bar {
    display: none;
  }

  .nav-bar ul {
    flex-direction: column;
    gap: 15px;
  }

  .hamburger {
    display: block;
  }
}
/* Add styles for logout button */
.logout-btn {
  padding: 5px 15px;
  border-radius: 20px;
  background: linear-gradient(135deg, #ff4444, #cc3333);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 68, 68, 0.4);
}
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #292929;
  color: #fff;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 5px;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.search-results ul {
  list-style: none;
  margin: 0;
  padding: 10px;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #444;
  cursor: pointer;
  transition: background 0.3s;
}
li{
  background-color: #292929;
}

.search-results li:hover {
  background: #333;
}
/* User Profile Image */
.user-profile {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s;
}

.profile-image:hover {
  transform: scale(1.1);
}


</style>