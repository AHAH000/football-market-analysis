
# 📌 **Backend-API – Football Market Analysis (Node.js)**

This is the main backend service for the **Football Market Analysis Graduation Project**.
It acts as the central API gateway between:

* The **Frontend (Vue.js)**
* The **Machine Learning APIs (Python)**
* The **Players Search & Reddit API**
* The **Database layer**

It handles **authentication, routing, validation, file uploads, prediction requests, player management**, and more.

---

# 🚀 **Features**

### ✔ Authentication (Login / Register)

Handles user login & registration using JWT.

### ✔ Player Prediction API (via ML microservice)

Receives player attributes → forwards request to ML model → returns market value prediction.

### ✔ Player Management

CRUD operations for:

* Player profiles
* Saved searches
* Uploaded CSV files

### ✔ File Uploads

Supports uploading player images or datasets using `multer`.

### ✔ Middleware & Security

* JWT auth middleware
* Input validation
* Error handling
* Environment variable management with `.env`

---

# 📂 **Project Structure**

```
Backend-API/
│
├── controllers/         ← API logic  
├── middleware/          ← JWT auth, validators  
├── models/              ← Database models (MongoDB / MySQL / etc.)  
├── routes/              ← API route definitions  
├── uploads/             ← For uploaded files  
│
├── index.js             ← Main server file  
├── package.json  
└── .env.example         ← Environment template  
```

---

# 🛠 **Tech Stack**

* **Node.js**
* **Express.js**
* **MongoDB / Mongoose** (if used)
* **JWT for Authentication**
* **Multer for File Uploads**
* **Axios for calling ML APIs**
* **dotenv for environment variables**

---

# ⚙️ **Installation & Setup**

### 1️⃣ Navigate to the backend folder

```
cd Backend-API
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create a `.env` file

Use this template:

```
PORT=5000
JWT_SECRET=your-secret
ML_API_URL=http://localhost:7000/predict
PLAYER_SEARCH_API=http://localhost:6000/similar
DATABASE_URL=mongodb://localhost:27017/football
```

### 4️⃣ Start the server

```
npm start
```

or during development:

```
npm run dev
```

---

# 📡 **API Endpoints**

### 🔐 Authentication

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Register new user |
| POST   | `/auth/login`    | Login & get JWT   |

---

### 📊 Player Market Value Prediction

| Method | Endpoint   | Description                       |
| ------ | ---------- | --------------------------------- |
| POST   | `/predict` | Predict market value using ML API |

---

### ⚽ Player Management

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/players`     | Get all players |
| POST   | `/players`     | Add new player  |
| PUT    | `/players/:id` | Update player   |
| DELETE | `/players/:id` | Delete player   |

---

### 🖼 Image / File Upload

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| POST   | `/upload` | Upload player image or CSV |

---

# 🧪 **Testing**

Use Postman or ThunderClient.

Example prediction request:

```
POST http://localhost:5000/predict
Content-Type: application/json

{
  "age": 25,
  "position": "CM",
  "goals": 4,
  "assists": 7,
  "contract_years": 3,
  "league_strength": 85
}
```

# 👨‍💻 **Author**

**Ahmed Hamdi**
Football Market Analysis – Graduation Project
Node.js Backend Developer

