<template>
    <div class="container">
        <h2>Generate Reddit Word Cloud</h2>

        <!-- Form for Input -->
        <form @submit.prevent="fetchWordCloud">
            <div class="form-group">
                <label>Subreddit:</label>
                <input type="text" v-model="subreddit" placeholder="Enter subreddit (e.g., soccer, realMadrid)" required />
            </div>

            <div class="form-group">
                <label>Keyword:</label>
                <input type="text" v-model="keyword" placeholder="Enter keyword (e.g., RealMadrid, vini)" required />
            </div>

            <div class="form-group">
                <label>Days Ago:</label>
                <select v-model="daysAgo">
                    <option value="0">Latest</option>
                    <option value="1">Yesterday</option>
                    <option value="2">2 Days Ago</option>
                    <option value="3">3 Days Ago</option>
                    <option value="7">1 Week Ago</option>
                </select>
            </div>

            <div class="form-group">
                <label>Theme:</label>
                <select v-model="theme">
                    <option value="colorful">Colorful</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="cool">Cool</option>
                    <option value="sunset">Sunset</option>
                </select>
            </div>

            <div class="button-container">
                <button type="submit" class="btn">Generate Word Cloud</button>
            </div>
        </form>

        <!-- Loading Indicator -->
        <div v-if="loading" class="loading-spinner">
            <div class="spinner"></div>
            <p>Generating Word Cloud...</p>
        </div>

        <!-- Display Word Cloud Image -->
        <div v-if="imageUrl && !loading" class="wordcloud-display">
            <h3>Generated Word Cloud:</h3>
            <img :src="imageUrl" alt="Word Cloud" class="wordcloud-image" />

            <!-- Download Button -->
            <button class="download-btn" @click="downloadImage">Download Word Cloud</button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error">
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            subreddit: "",
            keyword: "",
            daysAgo: "0",
            theme: "colorful",
            imageUrl: null,
            errorMessage: null,
            loading: false, // ✅ Tracks loading state
        };
    },
    methods: {
        async fetchWordCloud() {
            this.imageUrl = null;
            this.errorMessage = null;
            this.loading = true; // ✅ Show loading indicator

            // Check if required fields are filled
            if (!this.subreddit.trim() || !this.keyword.trim()) {
                this.errorMessage = "Subreddit and Keyword are required!";
                this.loading = false;
                return;
            }

            try {
                let apiUrl = `http://127.0.0.1:8002/generate_wordcloud/${this.subreddit}/${this.keyword}`;
                if (this.daysAgo) {
                    apiUrl += `/${this.daysAgo}`;
                }
                apiUrl += `?theme=${this.theme}`;

                const response = await axios.get(apiUrl);

                if (response.data.image_url) {
                    this.imageUrl = response.data.image_url;
                } else {
                    this.errorMessage = "No word cloud generated. Try different parameters.";
                }
            } catch (error) {
                this.errorMessage = "Error fetching word cloud. Please try again.";
                console.error(error);
            } finally {
                this.loading = false; // ✅ Hide loading indicator
            }
        },

        // ✅ Download Functionality
        downloadImage() {
            if (this.imageUrl) {
                axios
                    .get(this.imageUrl, { responseType: "blob" }) // Fetch image as a blob
                    .then((response) => {
                        const blob = new Blob([response.data], { type: "image/png" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "wordcloud.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href); // Clean up memory
                    })
                    .catch((error) => {
                        console.error("Error downloading the image:", error);
                    });
            }
        }
        ,
    },
};
</script>

<style scoped>
/* --- GENERAL STYLING --- */
.container {
    color: #00ff00;
    padding: 30px;
    border-radius: 10px;
    width: 60%;
    margin: auto;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    margin-top: 140px;
}

/* --- FORM STYLING --- */
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* --- FORM GROUPS --- */
.form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

/* --- INPUT FIELDS --- */
input,
select {
    padding: 10px;
    width: 90%;
    border-radius: 6px;
    border: 2px solid #00ff00;
    background-color: #1a1a1a;
    color: #00ff00;
    outline: none;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
}

/* --- ERROR MESSAGE --- */
.error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}

/* --- BUTTON STYLING --- */
button {
    padding: 12px;
    background-color: #00ff00;
    color: #0d0d0d;
    font-size: 18px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    width: 90%;
    transition: all 0.3s ease-in-out;
}

button:hover {
    background-color: #009900;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
}

/* --- WORD CLOUD DISPLAY --- */
.wordcloud-display {
    margin-top: 20px;
}

/* ✅ Increased image size */
.wordcloud-image {
    width: 100%;
    max-width: 700px;
    border: 3px solid #00ff00;
    padding: 10px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
}

/* ✅ Download Button */
.download-btn {
    margin-top: 15px;
    background-color: #ffcc00;
    color: #000;
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
}

.download-btn:hover {
    background-color: #ff9900;
    box-shadow: 0 0 15px rgba(255, 165, 0, 0.7);
}

/* ✅ Loading Spinner */
.loading-spinner {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 255, 0, 0.3);
    border-top: 5px solid #00ff00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* --- RESPONSIVE DESIGN --- */
@media (max-width: 768px) {
    .container {
        width: 80%;
    }

    input,
    select,
    button {
        width: 100%;
    }
}
</style>