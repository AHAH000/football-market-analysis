
# 📌 **PlayersSearchApi – Player Similarity + Reddit Football Cloud API**

This service provides two main functionalities:

1. **⚽ Player Similarity API (KNN Model)**

   * Find the top 3 similar players based on stats
   * Estimate market value using average of their values
   * Used for scouting & comparison

2. **📰 Reddit Football Cloud API**

   * Scrapes football subreddits
   * Generates text data for word clouds
   * Supports transfer rumors, trends, and fan sentiment analysis

This API is part of the **Football Market Analysis Graduation Project**.

---

# 🚀 **Features Overview**

### ✔ 1. Player Similarity Engine (KNN)

* Calculates similarity between players
* Uses numerical + categorical features
* KNN (k=3) → averages top 3 players' market values
* Useful when ML prediction is uncertain or needs comparison
* Outputs details about similar players

### ✔ 2. Reddit Cloud API

* Connects to Reddit API via PRAW or Pushshift
* Fetches posts & comments from:

  * `r/soccer`
  * `r/football`
  * `r/premierleague`
  * `r/LaLiga`
* Preprocesses text for:

  * Word cloud generation
  * Trend analysis
  * Sentiment preparation

### ✔ 3. Dockerized Deployment

* Dockerfile for containerizing the API
* `docker-compose.yml` for easy multi-service execution

---

# 📁 **Project Structure**

```
PlayersSearchApi/
│
├── api.py                         ← Main Flask API
├── recommend_similar_players.py    ← KNN similarity module
├── reddit_cloud_api.py             ← Reddit scraping logic
│
├── Final_Player_Data_With_Market_Value.csv  ← Cleaned dataset
│
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

# 🧠 **How the KNN Similarity Works**

1. Load dataset:

   * age
   * position
   * goals
   * assists
   * passing stats
   * physical stats
   * market value

2. Encode categorical values (e.g., position)

3. Compute Euclidean distance to all players

4. Sort by similarity → take **top 3**

5. Estimate value:

[
Estimated\ Value = \frac{Value_1 + Value_2 + Value_3}{3}
]

6. Return:

* Similar players list
* Estimated market value
* Similarity scores

---

# 🔌 **API Endpoints**

## 1️⃣ **Player Similarity**

### `GET /similar?name=<player_name>`

**Example response:**

```json
{
  "query_player": "Kevin De Bruyne",
  "estimated_value": 89.2,
  "similar_players": [
    { "name": "Bruno Fernandes", "value": 78.1 },
    { "name": "Martin Odegaard", "value": 82.5 },
    { "name": "Bernardo Silva", "value": 76.9 }
  ]
}
```

---

## 2️⃣ **Reddit Word Cloud Data**

### `GET /reddit/cloud?q=<topic>`

Returns cleaned text for building a word cloud.

**Example:**

```json
{
  "topic": "transfer market",
  "wordcloud_text": "transfer rumors chelsea arsenal signing deal..."
}
```

---

# ⚙️ **Installation**

### 1️⃣ Navigate to project

```
cd PlayersSearchApi
```

### 2️⃣ Install dependencies

```
pip install -r requirements.txt
```

### 3️⃣ Run API

```
python api.py
```

---

# 🐳 **Run Using Docker**

### 1️⃣ Build image

```
docker build -t players-search-api .
```

### 2️⃣ Run container

```
docker run -p 6000:6000 players-search-api
```

### OR using docker-compose:

```
docker-compose up --build
```

---

# 🧪 Example Usage

### Test Similar Player API

```
http://localhost:6000/similar?name=Messi
```

### Test Reddit API

```
http://localhost:6000/reddit/cloud?q=premier+league
```

---

# ⭐ **Future Enhancements**

* Add TF-IDF sentiment scoring
* Add hybrid similarity model (stats + playstyle)
* Allow dynamic K value (choose K)
* Add caching layer for Reddit responses

---

# 👨‍💻 **Author**

**Ahmed Hamdi**
Machine Learning + Python API Developer
Football Market Analysis Project


