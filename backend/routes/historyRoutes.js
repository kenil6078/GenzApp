const express = require('express');
const router = express.Router();
const { addToHistory, getHistory, clearHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToHistory);
router.get('/', protect, getHistory);
router.delete('/clear', protect, clearHistory);

module.exports = router;
