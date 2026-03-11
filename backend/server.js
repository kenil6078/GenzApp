require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const app = express();

// Connect MongoDB
connectDB();


// ========================
// CORS CONFIGURATION
// ========================

const allowedOrigins = [
  "http://localhost:5173",
  "https://genz-app-zeta.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());


// ========================
// MIDDLEWARES
// ========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ========================
// API ROUTES
// ========================

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tmdb', tmdbRoutes);


// ========================
// HEALTH CHECK
// ========================

app.get('/', (req, res) => {
  res.json({ message: "GenZ Movie API running 🎬" });
});


// ========================
// 404 ROUTE HANDLER
// ========================

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ========================
// GLOBAL ERROR HANDLER
// ========================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


// ========================
// START SERVER
// ========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});