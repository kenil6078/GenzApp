const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addFavorite);
router.get('/', protect, getFavorites);
router.delete('/remove/:tmdbId', protect, removeFavorite);
router.get('/check/:tmdbId', protect, checkFavorite);

module.exports = router;
