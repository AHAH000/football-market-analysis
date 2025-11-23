<template>
    <div class="player-extras" v-if="socialMedia.length || outfitter">
      <!-- Outfitter Logo -->
      <div class="outfitter" v-if="outfitterLogo">
        <h3>Outfitter</h3>
        <img :src="outfitterLogo" alt="Outfitter Logo" class="outfitter-logo" />
      </div>
  
      <!-- Social Media Icons -->
      <div class="social-media" v-if="socialMedia.length">
        <h3>Social Media</h3>
        <div class="social-icons">
          <a
            v-for="(link, index) in socialMedia"
            :key="index"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i :class="getSocialIconClass(link)"></i>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  
  const props = defineProps({
    playerId: {
      type: String,
      required: true
    }
  });
  
  const outfitter = ref("");
  const socialMedia = ref([]);
  const outfitterLogo = ref("");
  const apiBase = import.meta.env.VITE_TransferMarkt_Api_URL;
  
  // Map known outfitters to logos
  const outfitterLogos = {
    adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    puma: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_AG.svg"
  };
  
  const getSocialIconClass = (url) => {
    if (url.includes("twitter.com")) return "fab fa-twitter";
    if (url.includes("instagram.com")) return "fab fa-instagram";
    if (url.includes("facebook.com")) return "fab fa-facebook";
    return "fas fa-globe";
  };
  
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${apiBase}/players/${props.playerId}/profile`);
      const data = await res.json();
      outfitter.value = data.outfitter?.toLowerCase() || "";
      socialMedia.value = data.socialMedia || [];
  
      // Assign outfitter logo if known
      if (outfitter.value in outfitterLogos) {
        outfitterLogo.value = outfitterLogos[outfitter.value];
      } else {
        outfitterLogo.value = ""; // fallback
      }
    } catch (err) {
      console.error("Error fetching player profile:", err);
    }
  };
  
  onMounted(fetchProfile);
  watch(() => props.playerId, fetchProfile);
  </script>
  
  <style scoped>
  .player-extras {
    margin-top: 24px;
    padding: 16px;
    border-radius: 10px;
    border: 1px solid #1f1f1f;

  }
  
  h3 {
    color: #6ef285;
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .outfitter {
    margin-bottom: 20px;
  }
  
  .outfitter-logo {
    height: 36px;
    margin-top: 6px;
    transition: transform 0.3s ease;
    filter: brightness(1.2);
  }
  
  .outfitter-logo:hover {
    transform: scale(1.1);
  }
  
  .social-icons {
    display: flex;
    gap: 16px;
    margin-top: 10px;
    align-items: center;
  }
  
  .social-icons a {
    font-size: 30px;
    color: #6ef285;
    transition: color 0.3s ease, transform 0.2s ease;
  }
  
  .social-icons a:hover {
    color: #1da1f2;
    transform: scale(1.1);
  }
  
  </style>
  