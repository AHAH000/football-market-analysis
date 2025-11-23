<template>
    <div class="article-details">
      <div v-if="loading" class="loading">Loading article...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="article">
        <h1 v-if="!isEditing" class="title">{{ article.title }}</h1>
        <input
          v-else
          v-model="editedArticle.title"
          class="editable-input title-input"
          placeholder="Edit Title"
        />
  
        <div class="article-image">
          <img
            :src="article.photo || 'src/assets/default-image.png'"
            :alt="article.title"
            v-if="!isEditing"
          />
          <input
            v-else
            v-model="editedArticle.photo"
            class="editable-input photo-input"
            placeholder="Paste Image URL"
          />
        </div>
  
        <p class="author">
          By: {{ article.createdBy?.username || "Unknown" }} |
          <span class="date">{{ new Date(article.createdAt).toLocaleDateString() || "Unknown Date" }}</span>
        </p>
  
        <div class="separator"></div>
  
        <div v-if="!isEditing" class="content">
          <p v-for="(paragraph, index) in formattedText" :key="index">{{ paragraph }}</p>
        </div>
        <textarea
          v-else
          v-model="editedArticle.text"
          class="editable-input content-input"
          placeholder="Edit Article Content"
        ></textarea>
  
        <div class="buttons">
          <button v-if="isAdmin" @click="toggleEdit" class="edit-button">
            <i class="icon-pen"></i> {{ isEditing ? "Cancel" : "Edit" }}
          </button>
          <button v-if="isEditing" @click="saveChanges" class="save-button">
            Save Changes
          </button>
          <button
            v-if="isAdmin && !isEditing"
            @click="confirmDelete"
            class="delete-button"
          >
            <i class="icon-trash"></i> Delete Article
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import axios from "axios";
  import { useRoute, useRouter } from "vue-router";
  
  export default defineComponent({
    name: "ArticleDetails",
    data() {
      return {
        article: null as any,
        editedArticle: {
          title: "",
          text: "",
          photo: "",
        },
        isEditing: false,
        loading: false,
        error: null as string | null,
        currentUserRole: JSON.parse(localStorage.getItem("user") || "{}").role || null, // Fetch role from localStorage
      };
    },
    computed: {
      isAdmin() {
        return this.currentUserRole === "admin"; // Check if user is admin
      },
      formattedText() {
        return this.article?.text.split("\n") || [];
      },
    },
    setup() {
      const route = useRoute();
      const router = useRouter();
      return { route, router };
    },
    methods: {
      async fetchArticle() {
        this.loading = true;
        this.error = null;
  
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/articles/${this.route.params.id}`;
          const response = await axios.get(apiUrl);
  
          if (response.data.success) {
            this.article = response.data.article;
            this.editedArticle = { ...response.data.article };
          } else {
            this.error = "Failed to fetch the article. Please try again.";
          }
        } catch (err) {
          this.error = "An error occurred while fetching the article.";
        } finally {
          this.loading = false;
        }
      },
      toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
          this.editedArticle = { ...this.article };
        }
      },
      async saveChanges() {
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/articles/update/${this.article._id}`;
          const response = await axios.put(apiUrl, this.editedArticle, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.data.success) {
            this.article = response.data.article;
            this.isEditing = false;
            alert("Article updated successfully!");
          } else {
            alert("Failed to save changes. Please try again.");
          }
        } catch (error) {
          alert("Error saving changes. Please try again.");
        }
      },
      async deleteArticle() {
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/articles/delete/${this.article._id}`;
          await axios.delete(apiUrl, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          alert("Article deleted successfully!");
          this.router.push("/");
        } catch (error) {
          alert("Failed to delete the article. Please try again.");
        }
      },
      confirmDelete() {
        if (confirm("Are you sure you want to delete this article?")) {
          this.deleteArticle();
        }
      },
    },
    mounted() {
      this.fetchArticle();
    },
  });
  </script>
  
  <style scoped>
  .article-details {
    max-width: 1400px;
    margin: 40px auto;
    font-family: "Roboto", sans-serif;
    color: #00ff88;
    text-align: center;
    margin-top: 140px;
  }
  
  .title {
    font-size: 36px;
    font-weight: bold;
    color: #00ff88;
    margin-bottom: 20px;
    text-shadow: 0 1px 3px rgba(0, 255, 136, 0.6);
  }
  
  .article-image {
    margin: 40px 0;
    text-align: center;
  }
  
  .article-image img {
    width: 100%;
    max-width: 800px; /* Consistent image size for all articles */
    height: auto;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8);
  }
  
  .editable-input {
    width: 90%;
    max-width: 1200px;
    margin: 15px auto;
    padding: 10px;
    font-size: 18px;
    border: 2px solid #00ff88;
    border-radius: 5px;
    background-color: #1a1a1a;
    color: #00ff88;
  }
  
  .editable-input.title-input {
    font-size: 28px;
    font-weight: bold;
  }
  
  .editable-input.photo-input {
    margin-top: 20px;
  }
  
  .editable-input.content-input {
    height: 200px;
    resize: none;
  }
  
  .author {
    font-size: 18px;
    color: #00ff88;
    margin: 15px 0;
    font-weight: bold;
  }
  
  .date {
    color: #cccccc;
    font-size: 16px;
    margin-left: 5px;
  }
  
  .separator {
    height: 4px;
    width: 95%;
    background-color: #00ff88;
    margin: 25px auto;
    border-radius: 5px;
  }
  
  .content {
    max-width: 800px;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 18px;
    line-height: 1.8;
    text-align: justify;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: #dddddd;
  }
  
  .content p {
    margin-bottom: 20px;
  }
  
  .buttons {
    margin: 20px 0;
  }
  
  .edit-button,
  .save-button,
  .delete-button {
    background-color: #1a1a1a;
    border: 2px solid #00ff88;
    color: #00ff88;
    font-size: 16px;
    padding: 10px 20px;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .edit-button:hover,
  .save-button:hover,
  .delete-button:hover {
    background-color: #00ff88;
    color: #1a1a1a;
    transform: scale(1.1);
  }
  
  .icon-pen::before {
    content: "✎"; /* Pen icon */
    margin-right: 5px;
  }
  
  .icon-trash::before {
    content: "🗑️"; /* Trash icon */
    margin-right: 5px;
  }
  </style>
  