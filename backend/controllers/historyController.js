const WatchHistory = require('../models/WatchHistory');

// @desc    Add to watch history
// @route   POST /api/history/add
const addToHistory = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterUrl, rating, releaseDate } = req.body;
    // Upsert - update watchedAt if already exists
    const history = await WatchHistory.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      { userId: req.user._id, tmdbId, mediaType, title, posterUrl, rating, releaseDate, watchedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user watch history
// @route   GET /api/history
const getHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id }).sort({ watchedAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear watch history
// @route   DELETE /api/history/clear
const clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'Watch history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToHistory, getHistory, clearHistory };
