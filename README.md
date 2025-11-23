
# ✅ **1. MAIN REPOSITORY — `README.md`**

## 📌 Football Market Analysis – Graduation Project

A complete end-to-end system that predicts football player market value, analyzes player performance, and provides intelligent player search tools using machine learning, data scraping, and web technologies.

This project is structured as a **monorepo**, containing all system components:

```
football-market-analysis
│
├── PlayersSearchApi/           
├── User-Backend-GP-API/        
└── GP-Project/                 
```

---

## 🚀 **Project Overview**

This system provides:

### ✔ **Machine Learning-based Player Market Value Prediction**

* XGBoost
* Gradient Boosting
* Linear Regression
* Feature engineering on age, assists, goals, league strength, contract length, etc.

### ✔ **Player Similarity Search API**

* Compare players based on attributes
* Retrieve similar profiles
* Useful for scouting and transfer analysis

### ✔ **Reddit Search API for Football Threads**

* Scrapes Reddit football communities
* Helps gather contextual fan sentiment, player discussions, and transfer rumors

### ✔ **Full Web Application**

* Vue.js frontend for interacting with the model
* Node.js backend serving predictions + CRUD
* Modular APIs (scouting, search, sentiment scraping)

---

## 📁 **Repository Structure**

```
📦 football-market-analysis
 ┣ 📂 PlayersSearchApi
 ┣ 📂 User-Backend-GP-API
 ┗ 📂 GP-Project
```

### **PlayersSearchApi/**

Contains:

* Reddit cloud scraping logic
* Similar players recommendation API
* Python scripts / endpoints

### **User-Backend-GP-API/**

Contains:

* Node.js backend (Express)
* Authentication
* Model serving
* Endpoints for player predictions and analysis

### **GP-Project/**

Contains:

* Vue.js full frontend
* UI for searching players
* UI for viewing prediction results
* UI for analytics and visual dashboards

---

## 🧱 **Technologies Used**

### **Backend**

* Node.js
* Express.js
* Python (APIs + ML)
* Reddit API

### **Frontend**

* Vue.js
* Axios
* Tailwind / Bootstrap (optional)

### **Machine Learning**

* Python
* Pandas
* XGBoost
* Scikit-learn

### **DevOps**

* Git + GitHub
* Monorepo structure

---

## 📄 **How to Run the Entire System (High-Level)**

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/football-market-analysis.git
```

### 2️⃣ Install dependencies

Each project has its **own README** and install commands.

### 3️⃣ Run APIs

* Run Node backend
* Run Python APIs

### 4️⃣ Run Vue Frontend

---

## 👨‍💻 Author

**Ahmed Hamdi**
Computer Science (Information Systems)
BUE – Graduation Project


