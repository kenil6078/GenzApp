const Favorite = require('../models/Favorite');

// @desc    Add to favorites
// @route   POST /api/favorites/add
const addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterUrl, rating, releaseDate } = req.body;
    const existing = await Favorite.findOne({ userId: req.user._id, tmdbId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });
    const favorite = await Favorite.create({ userId: req.user._id, tmdbId, mediaType, title, posterUrl, rating, releaseDate });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/remove/:tmdbId
const removeFavorite = async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({ userId: req.user._id, tmdbId: req.params.tmdbId });
    if (!result) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if a movie is favorited
// @route   GET /api/favorites/check/:tmdbId
const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ userId: req.user._id, tmdbId: req.params.tmdbId });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite, checkFavorite };
