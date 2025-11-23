<template>
    <section class="video-highlights">
      <h2>Video Highlights</h2>
      <div class="video-container">
        <iframe v-for="(video, index) in videos" :key="index" :src="video.url" frameborder="0" allowfullscreen></iframe>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        videos: [
          { url: "https://www.youtube.com/embed/8qtR3_Uj1lA" },
          { url: "https://www.youtube.com/embed/1WB4Y6swD4k" },
          { url: "https://www.youtube.com/embed/OSLqTSIekRk" }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .video-highlights {
    text-align: center;
    padding: 30px;
  }
  
  .video-container {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .video-container iframe {
    width: 300px;
    height: 200px;
  }
  </style>
  