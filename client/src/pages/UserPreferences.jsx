// client/src/pages/UserPreferences.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FaHiking, FaMountain, FaUmbrellaBeach, FaCity, FaCamera,
  FaUtensils, FaShoppingBag, FaLandmark, FaLeaf, FaPaw
} from 'react-icons/fa';

const INTEREST_OPTIONS = [
  { value: 'nature', label: 'Nature', icon: <FaLeaf /> },
  { value: 'adventure', label: 'Adventure', icon: <FaHiking /> },
  { value: 'heritage', label: 'Heritage', icon: <FaLandmark /> },
  { value: 'beach', label: 'Beach', icon: <FaUmbrellaBeach /> },
  { value: 'mountains', label: 'Mountains', icon: <FaMountain /> },
  { value: 'city', label: 'City', icon: <FaCity /> },
  { value: 'food', label: 'Food', icon: <FaUtensils /> },
  { value: 'wildlife', label: 'Wildlife', icon: <FaPaw /> },
  { value: 'photography', label: 'Photography', icon: <FaCamera /> },
  { value: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> }
];

export default function UserPreferences() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [preferences, setPreferences] = useState({
    interests: [],
    budgetRange: 'mid-range',
    budgetPerDay: { min: 1000, max: 5000 },
    travelType: 'solo',
    travelPace: 'moderate',
    accommodationPreference: [],
    dietaryRestrictions: [],
    preferredTransport: [],
    preferredSeasons: []
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await api.get('/preferences');
      setPreferences(res.data);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInterest = (interest) => {
    const updated = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest];
    setPreferences({ ...preferences, interests: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/preferences', preferences);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
      setTimeout(() => navigate('/discover'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tell us about your travel style
          </h1>
          <p className="text-gray-600">
            Help us personalize your experience and recommend the best destinations
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Travel Interests */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">What interests you?</h3>
            <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {INTEREST_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleToggleInterest(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                    preferences.interests.includes(option.value)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Budget Preference</h3>
            <div className="grid grid-cols-3 gap-4">
              {['budget', 'mid-range', 'luxury'].map((range) => (
                <button
                  key={range}
                  onClick={() => setPreferences({ ...preferences, budgetRange: range })}
                  className={`p-4 rounded-xl border-2 transition ${
                    preferences.budgetRange === range
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{range}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {range === 'budget' && '$0 - $50/day'}
                    {range === 'mid-range' && '$50 - $150/day'}
                    {range === 'luxury' && '$150+/day'}
                  </div>
                </button>
              ))}
            </div>

            {/* Budget Range Slider */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Budget Range: ${preferences.budgetPerDay.min} - ${preferences.budgetPerDay.max}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={preferences.budgetPerDay.min}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    budgetPerDay: { ...preferences.budgetPerDay, min: Number(e.target.value) }
                  })}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={preferences.budgetPerDay.max}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    budgetPerDay: { ...preferences.budgetPerDay, max: Number(e.target.value) }
                  })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Travel Type */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Travel Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['solo', 'couple', 'family', 'group', 'business'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPreferences({ ...preferences, travelType: type })}
                  className={`p-3 rounded-lg border-2 transition capitalize ${
                    preferences.travelType === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Pace */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Travel Pace</h3>
            <div className="grid grid-cols-3 gap-4">
              {['relaxed', 'moderate', 'fast'].map((pace) => (
                <button
                  key={pace}
                  onClick={() => setPreferences({ ...preferences, travelPace: pace })}
                  className={`p-4 rounded-xl border-2 transition ${
                    preferences.travelPace === pace
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{pace}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {pace === 'relaxed' && '1-2 activities/day'}
                    {pace === 'moderate' && '3-4 activities/day'}
                    {pace === 'fast' && '5+ activities/day'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation Preferences */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Accommodation Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['hotel', 'hostel', 'resort', 'airbnb', 'guesthouse', 'camping'].map((acc) => (
                <button
                  key={acc}
                  onClick={() => {
                    const updated = preferences.accommodationPreference.includes(acc)
                      ? preferences.accommodationPreference.filter(a => a !== acc)
                      : [...preferences.accommodationPreference, acc];
                    setPreferences({ ...preferences, accommodationPreference: updated });
                  }}
                  className={`p-3 rounded-lg border-2 transition capitalize ${
                    preferences.accommodationPreference.includes(acc)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Dietary Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'none'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => {
                    const updated = preferences.dietaryRestrictions.includes(diet)
                      ? preferences.dietaryRestrictions.filter(d => d !== diet)
                      : [...preferences.dietaryRestrictions, diet];
                    setPreferences({ ...preferences, dietaryRestrictions: updated });
                  }}
                  className={`p-3 rounded-lg border-2 transition capitalize ${
                    preferences.dietaryRestrictions.includes(diet)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex-1"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}