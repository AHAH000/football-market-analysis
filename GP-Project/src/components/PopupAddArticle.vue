<template>
    <div class="popup-overlay">
      <div class="popup">
        <h2>Create New Article</h2>
        <form @submit.prevent="createArticle">
          <div class="form-group">
            <label for="title">Title:</label>
            <input id="title" v-model="articleTitle" type="text" placeholder="Enter article title" required />
          </div>
  
          <div class="form-group">
            <label for="text">Content:</label>
            <textarea
              id="text"
              v-model="articleText"
              placeholder="Enter article content"
              required
              @input="adjustTextareaHeight"
            ></textarea>
          </div>
  
          <div class="form-group">
            <label for="photo">Photo URL:</label>
            <input id="photo" v-model="articlePhoto" type="text" placeholder="Enter image URL (optional)" />
          </div>
  
          <div class="form-actions">
            <button type="submit" class="submit-btn">Create Article</button>
            <button type="button" class="cancel-btn" @click="$emit('close')">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "PopupAddArticle",
    data() {
      return {
        articleTitle: "",
        articleText: "",
        articlePhoto: "",
      };
    },
    methods: {
      async createArticle() {
        try {
          const payload = {
            title: this.articleTitle,
            text: this.articleText,
            photo: this.articlePhoto.trim() || null,
          };
  
          console.log("Payload being sent:", payload);
  
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/articles/create`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          if (response.data.success) {
            alert("Article created successfully!");
            this.$emit("close"); // Close the popup after success
          } else {
            alert("Failed to create article. Please try again.");
          }
        } catch (error) {
          console.error("Error creating article:", error.response || error.message);
          alert(`An error occurred: ${error.response?.data?.message || error.message}`);
        }
      },
      adjustTextareaHeight(event) {
        const textarea = event.target;
        textarea.style.height = "auto"; // Reset height to calculate correctly
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
      },
    },
  };
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .popup {
    background-color: #1a1a1a;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
    max-width: 500px;
    width: 100%;
    text-align: center;
    color: #fff;
  }
  
  .popup h2 {
    margin-bottom: 20px;
    color: #00ff88;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 2px solid #00ff88;
    background-color: #1a1a1a;
    color: #fff;
    font-size: 16px;
  }
  
  textarea {
    resize: none; /* Disable manual resize */
    min-height: 100px; /* Minimum height */
    max-height: 400px; /* Maximum height */
    overflow-y: auto; /* Scroll if content exceeds max-height */
  }
  
  input::placeholder,
  textarea::placeholder {
    color: #aaa;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .submit-btn,
  .cancel-btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .submit-btn {
    background-color: #00ff88;
    color: #1a1a1a;
  }
  
  .submit-btn:hover {
    background-color: transparent;
    color: #00ff88;
    border-color: #00ff88;
  }
  
  .cancel-btn {
    background-color: #ff4444;
    color: #fff;
  }
  
  .cancel-btn:hover {
    background-color: transparent;
    color: #ff4444;
    border-color: #ff4444;
  }
  </style>
  