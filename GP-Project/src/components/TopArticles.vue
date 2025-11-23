<template>
    <section class="articles">
      <h2>Top Articles</h2>
      <div class="article-list">
        <div v-for="(article, index) in articles" :key="index" class="article-card">
          <img :src="article.image" alt="Article Image" />
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
          <router-link to="/articles" class="btn">Read More</router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        articles: [
          { image: "@/assets/Real-madrid.png", title: "Real Madrid Dominates", description: "A quick glance at Real Madrid's recent success." },
          { image: "@/assets/Barca.png", title: "Barcelona's Comeback", description: "Barcelona secures its place among the best." },
          { image: "@/assets/Bayern.jpeg", title: "Bayern's Reign", description: "Bayern Munich's dominance in Bundesliga." }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .articles {
    text-align: center;
    padding: 30px;
  }
  
  .article-list {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
  
  .article-card {
    background: #292929;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }
  
  .article-card img {
    width: 100%;
    border-radius: 8px;
  }
  
  .btn {
    background: #00ff99;
    padding: 10px;
    text-decoration: none;
    color: black;
    border-radius: 5px;
  }
  </style>
  