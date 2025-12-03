// server/routes/recommendations.js
const express = require('express');
const router = express.Router();
const aiRecommendations = require('../services/aiRecommendations');
const Preferences = require('../models/Preferences');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/recommendations
// @desc    Get personalized recommendations based on user preferences
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get user preferences
    const preferences = await Preferences.findOne({ userId: req.user._id });
    
    if (!preferences || preferences.interests.length === 0) {
      // Return trending if no preferences set
      const trending = aiRecommendations.getTrending(6);
      return res.json(trending);
    }
    
    // Get AI-powered recommendations
    const recommendations = aiRecommendations.getRecommendations(preferences, 6);
    res.json(recommendations);
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

// @route   GET /api/recommendations/trending
// @desc    Get trending destinations
// @access  Private
router.get('/trending', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const trending = aiRecommendations.getTrending(limit);
    res.json(trending);
  } catch (err) {
    console.error('Get trending error:', err);
    res.status(500).json({ message: 'Failed to get trending destinations' });
  }
});

// @route   GET /api/recommendations/search
// @desc    Search destinations
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;
    
    if (!query.trim()) {
      return res.json([]);
    }
    
    const results = aiRecommendations.search(query, limit);
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// @route   GET /api/recommendations/:id
// @desc    Get destination details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const destination = aiRecommendations.getDestinationById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Get similar destinations
    const similar = aiRecommendations.getSimilarDestinations(req.params.id, 4);
    
    res.json({
      ...destination,
      similar
    });
  } catch (err) {
    console.error('Get destination error:', err);
    res.status(500).json({ message: 'Failed to get destination' });
  }
});

// @route   GET /api/recommendations/:id/similar
// @desc    Get similar destinations
// @access  Private
router.get('/:id/similar', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const similar = aiRecommendations.getSimilarDestinations(req.params.id, limit);
    res.json(similar);
  } catch (err) {
    console.error('Get similar destinations error:', err);
    res.status(500).json({ message: 'Failed to get similar destinations' });
  }
});

module.exports = router;