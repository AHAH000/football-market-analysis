const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const userRoute = require('./routes/userRoute');
const playerRoutes = require('./routes/playerRoute');
const searchRoute = require('./routes/searchRoute');
const Player = require('./models/player.model'); // Import the Player model
const footballRoute=require("./routes/footballRoute");
const tableRoute=require("./routes/tableRoute");
const articleRoute=require("./routes/articleRoute");
const fetchUser = require("./routes/fetchUser");
const upcomingMatchesRoute = require('./routes/upcomingMatchesRoute');
const crudPlayers=require("./routes/crudPlayers")
const squadRoute=require('./routes/squadRoute')
// Routes
app.use('/api/user', userRoute);
app.use('/api/players', playerRoutes);
app.use('/api/search', searchRoute);
app.use('/api/football', footballRoute);
app.use('/api/table',tableRoute);
app.use('/api/articles',articleRoute);
app.use('/api/fetchuser',fetchUser);
app.use('/api/football', upcomingMatchesRoute);
app.use('/api/handlePlayer',crudPlayers);
app.use('/api/squads', squadRoute); // ✅ Register squad routes
const searchMiddleware = require('./middleware/searchMiddleware');
const sortingMiddleware = require('./middleware/sortingMiddleware');
const req = require('express/lib/request');

app.get('/api/players/search-sort', searchMiddleware, sortingMiddleware, (req, res) => {
    try {
        res.json(req.players); // Search and sort results are handled by middlewares
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});





// Root route
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () =>
        console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if MongoDB connection fails
});

// Default error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
