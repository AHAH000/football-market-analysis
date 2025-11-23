<template>
  <div class="news-cards">
    <h1>Latest News</h1>

    <div
      v-for="(news, index) in newsList.slice(0, 3)"
      :key="news._id"
      class="card"
      @mouseover="hoverCard(index)"
      @mouseleave="resetHover(index)"
    >
      <div class="card-image">
        <img :src="news.photo || 'src/assets/default-image.png'" :alt="news.title" />
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ news.title }}</h3>
        <p class="card-author">By: {{ news.author || 'Unknown Author' }}</p>
        <div class="card-meta">
          <span class="comments">{{ news.comments || 0 }} comments</span>
        </div>
      </div>
      <button class="read-more" @click="showMore(news._id)">Read More</button>
    </div>

    <div v-if="loading" class="loading">Loading news...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

interface News {
  _id: string;
  photo: string;
  title: string;
  author: string;
  comments: number;
  hovered: boolean;
}

export default defineComponent({
  name: "NewsCards",
  setup() {
    const router = useRouter();

    return { router };
  },
  data() {
    return {
      newsList: [] as News[],
      loading: false,
      error: null as string | null,
    };
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      this.error = null;

      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/articles`;
        const response = await axios.get(apiUrl);

        if (response.data.success) {
          this.newsList = response.data.articles.map((article: any) => ({
            _id: article._id,
            photo: article.photo,
            title: article.title,
            author: article.createdBy?.username || "Admin",
            comments: 0,
            hovered: false,
          }));
        } else {
          this.error = "Failed to fetch news. Please try again.";
        }
      } catch (err: any) {
        this.error = err.message || "An error occurred while fetching news.";
      } finally {
        this.loading = false;
      }
    },
    hoverCard(index: number) {
      this.newsList[index].hovered = true;
    },
    resetHover(index: number) {
      this.newsList[index].hovered = false;
    },
    showMore(articleId: string) {
      this.router.push({ name: "ArticleDetails", params: { id: articleId } });
    },
  },
  mounted() {
    this.fetchNews();
  },
});
</script>

<style scoped>
/* Overall News Card Container */
.news-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 20px auto;
  font-family: "Roboto", sans-serif;
  color: #00ff88;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #00ff88;
}

.loading,
.error {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}

.error {
  color: red;
}

/* Individual News Card */
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  background-color: #292929;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

/* Card Image */
.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 15px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image scales and crops perfectly */
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.1); /* Zoom effect on hover */
}

/* Card Content */
.card-content {
  text-align: center;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
  color: #00ff00;
  transition: color 0.3s ease;
}

.card:hover .card-title {
  color: #4caf50;
}

.card-author {
  font-size: 14px;
  color: #cccccc;
  margin-bottom: 10px;
}

.card-meta {
  font-size: 12px;
  color: #999999;
}

/* Read More Button */
.read-more {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #00ff88;
  color: #1e1e1e;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more:hover {
  background-color: #4caf50;
  color: white;
}
</style>
