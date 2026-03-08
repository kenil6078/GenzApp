const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true,
  },
  posterUrl: {
    type: String,
    default: '',
  },
  backdropUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: 'Description not available',
  },
  releaseDate: {
    type: String,
    default: '',
  },
  genre: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    enum: ['movie', 'tv', 'trending', 'popular'],
    default: 'movie',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
