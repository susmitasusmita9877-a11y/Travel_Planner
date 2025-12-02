// server/routes/preferences.js
const express = require('express');
const router = express.Router();
const Preferences = require('../models/Preferences');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/preferences
// @desc    Get user preferences
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let preferences = await Preferences.findOne({ userId: req.user._id });
    
    // Create default preferences if none exist
    if (!preferences) {
      preferences = await Preferences.create({
        userId: req.user._id,
        interests: [],
        budgetRange: 'mid-range',
        travelType: 'solo'
      });
    }
    
    res.json(preferences);
  } catch (err) {
    console.error('Get preferences error:', err);
    res.status(500).json({ message: 'Failed to get preferences' });
  }
});

// @route   PUT /api/preferences
// @desc    Update user preferences
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const {
      interests,
      budgetRange,
      budgetPerDay,
      travelType,
      travelPace,
      accommodationPreference,
      dietaryRestrictions,
      preferredTransport,
      preferredSeasons,
      accessibilityNeeds,
      languages,
      notifications
    } = req.body;
    
    let preferences = await Preferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      preferences = new Preferences({ userId: req.user._id });
    }
    
    // Update fields
    if (interests) preferences.interests = interests;
    if (budgetRange) preferences.budgetRange = budgetRange;
    if (budgetPerDay) preferences.budgetPerDay = budgetPerDay;
    if (travelType) preferences.travelType = travelType;
    if (travelPace) preferences.travelPace = travelPace;
    if (accommodationPreference) preferences.accommodationPreference = accommodationPreference;
    if (dietaryRestrictions) preferences.dietaryRestrictions = dietaryRestrictions;
    if (preferredTransport) preferences.preferredTransport = preferredTransport;
    if (preferredSeasons) preferences.preferredSeasons = preferredSeasons;
    if (accessibilityNeeds) preferences.accessibilityNeeds = accessibilityNeeds;
    if (languages) preferences.languages = languages;
    if (notifications) preferences.notifications = { ...preferences.notifications, ...notifications };
    
    await preferences.save();
    res.json(preferences);
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

// @route   DELETE /api/preferences
// @desc    Reset preferences to default
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Preferences.findOneAndDelete({ userId: req.user._id });
    
    const defaultPreferences = await Preferences.create({
      userId: req.user._id,
      interests: [],
      budgetRange: 'mid-range',
      travelType: 'solo'
    });
    
    res.json(defaultPreferences);
  } catch (err) {
    console.error('Reset preferences error:', err);
    res.status(500).json({ message: 'Failed to reset preferences' });
  }
});

module.exports = router;