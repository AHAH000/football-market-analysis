Here is the **perfect README.md** for your **GP-Project (Vue.js Frontend)**.
It is clean, professional, and suitable for GitHub + CV + interviews.

---

# 🎨 **GP-Project – Football Market Analysis Frontend (Vue.js)**

This is the **frontend application** for the **Football Market Analysis Graduation Project**.
The UI is built using **Vue.js**, and it connects to:

* The **Backend API (Node.js)**
* The **ML Prediction API (Python)**
* The **Players Search API**
* The **Reddit Football Cloud API**

The frontend provides an interactive interface for exploring players, predicting market values, finding similar players, and viewing football insights.

---

# 🚀 **Core Features**

### ✔ Player Search & Player Profiles

Search for players and view detailed statistics.

### ✔ ML-Based Market Value Prediction

Send player attributes → get predicted transfer market value.

### ✔ Similar Players Recommendation

View similar players based on position, stats, and playstyle.

### ✔ Reddit Football Posts Integration

Fetch and visualize football discussions and cloud data from Reddit.

### ✔ Modern UI/UX

* Clean player cards
* Real-time inputs
* Dynamic tables
* Animated transitions
* Charts & insights

---

# 🛠 **Tech Stack**

| Area               | Technology                       |
| ------------------ | -------------------------------- |
| Frontend Framework | **Vue.js 3**                     |
| Build Tool         | **Vite**                         |
| Language           | TypeScript (if configured)       |
| UI                 | Custom CSS / Tailwind (optional) |
| HTTP Client        | Axios                            |
| State Management   | Pinia / Vue Store (optional)     |

---

# 📁 **Project Structure**

```
GP-Project/
│
├── public/                ← Static files
├── src/
│   ├── components/        ← UI components
│   ├── pages/             ← Main pages (Home, Prediction, Players)
│   ├── store/             ← Global store (optional)
│   ├── services/          ← Axios services for APIs
│   ├── assets/            ← Images, icons
│   ├── App.vue
│   └── main.ts
│
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ **Installation & Setup**

### 1️⃣ Navigate to the project folder

```
cd GP-Project
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create a `.env` file

Use this as an example:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_ML_API_URL=http://localhost:7000/predict
VITE_PLAYERS_API_URL=http://localhost:6000
```

### 4️⃣ Run development server

```
npm run dev
```

The app will start at:

```
http://localhost:5173/
```

---

# 🖥 **Main Pages**

### 🏠 **Home Page**

* Project overview
* Navigation

### 📊 **Market Value Prediction Page**

Enter player stats:

* Age
* Goals
* Assists
* Position
* Contract length
* League strength

Get instant predicted value.

### 🧑‍🤝‍🧑 **Similar Players Page**

* Search a player
* Get recommended similar players
* Comparison view

### 📰 **Reddit Insights Page**

* View football-related posts
* Explore transfer rumors
* Analyze cloud data

---

# 🔌 **API Communication (Axios Services)**

Example prediction call:

```ts
import axios from "axios";

export const predictValue = (playerData) => {
  return axios.post(`${import.meta.env.VITE_ML_API_URL}`, playerData);
};
```

---

# 🧪 **Testing**

Use built-in Vite test runner (if configured):

```
npm run test
```

Or test manually using the UI.

---

# 🚢 **Build for Production**

```
npm run build
```

Build output goes to:

```
/dist
```

---

---

# 👨‍💻 **Author**

**Ahmed Hamdi**
Frontend Developer – Vue.js
Football Market Analysis Graduation Project
