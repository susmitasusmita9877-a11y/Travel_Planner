// server/models/Preferences.js
const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Travel Interests
  interests: [{
    type: String,
    enum: [
      'nature', 'adventure', 'heritage', 'beach', 'mountains',
      'city', 'culture', 'food', 'wildlife', 'photography',
      'shopping', 'nightlife', 'spiritual', 'sports'
    ]
  }],
  
  // Budget Preferences
  budgetRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    default: 'mid-range'
  },
  
  budgetPerDay: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10000 }
  },
  
  // Travel Style
  travelType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'group', 'business'],
    default: 'solo'
  },
  
  travelPace: {
    type: String,
    enum: ['relaxed', 'moderate', 'fast'],
    default: 'moderate'
  },
  
  // Accommodation Preferences
  accommodationPreference: [{
    type: String,
    enum: ['hotel', 'hostel', 'resort', 'airbnb', 'guesthouse', 'camping']
  }],
  
  // Dietary Preferences
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'none']
  }],
  
  // Transport Preferences
  preferredTransport: [{
    type: String,
    enum: ['flight', 'train', 'bus', 'car', 'bike', 'walking']
  }],
  
  // Season Preferences
  preferredSeasons: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  }],
  
  // Accessibility Needs
  accessibilityNeeds: {
    wheelchairAccess: { type: Boolean, default: false },
    hearingAssistance: { type: Boolean, default: false },
    visualAssistance: { type: Boolean, default: false }
  },
  
  // Language Preferences
  languages: [{ type: String }],
  
  // Notification Preferences
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true },
    weatherAlerts: { type: Boolean, default: true },
    tripReminders: { type: Boolean, default: true }
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Preferences', preferencesSchema);