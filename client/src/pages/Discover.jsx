// client/src/pages/Discover.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FaHeart, FaRegHeart, FaMapMarkerAlt, FaDollarSign,
  FaSearch, FaStar, FaFire, FaCompass, FaFilter
} from 'react-icons/fa';

export default function Discover() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('recommended');
  const [savedDestinations, setSavedDestinations] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const [recRes, trendRes] = await Promise.all([
        api.get('/recommendations'),
        api.get('/recommendations/trending')
      ]);
      setRecommendations(recRes.data);
      setTrending(trendRes.data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/recommendations/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const toggleSave = (destinationId) => {
    setSavedDestinations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const createTripFromDestination = (destination) => {
    navigate('/new-trip', {
      state: {
        prefill: {
          title: `Trip to ${destination.name}`,
          destination: destination.name,
          imageUrl: destination.imageUrl,
          description: destination.description,
          budget: destination.avgDailyBudget.max * 7 // Assume 7 days
        }
      }
    });
  };

  const displayedDestinations = searchQuery
    ? searchResults
    : activeFilter === 'trending'
    ? trending
    : recommendations;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="skeleton h-12 w-64 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card">
                <div className="skeleton h-48 w-full mb-4"></div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCompass size={32} />
            <h1 className="text-4xl font-bold">Discover Your Next Adventure</h1>
          </div>
          <p className="text-xl text-white/90 mb-8">
            AI-powered recommendations tailored just for you
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search destinations, activities, or interests..."
              className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <button
              onClick={() => {
                setActiveFilter('recommended');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeFilter === 'recommended' && !searchQuery
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaStar size={14} />
              For You
            </button>
            
            <button
              onClick={() => {
                setActiveFilter('trending');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeFilter === 'trending' && !searchQuery
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFire size={14} />
              Trending
            </button>

            <button
              onClick={() => navigate('/preferences')}
              className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <FaFilter size={14} />
              Update Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-gray-600">{searchResults.length} destinations found</p>
          </div>
        )}

        {!searchQuery && activeFilter === 'recommended' && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Personalized for You
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your travel preferences and interests
            </p>
          </div>
        )}

        {!searchQuery && activeFilter === 'trending' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaFire className="text-orange-500" />
              Trending Destinations
            </h2>
            <p className="text-gray-600 mb-6">
              Most popular destinations right now
            </p>
          </div>
        )}

        {displayedDestinations.length === 0 ? (
          <div className="text-center py-20">
            <FaCompass size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or updating your preferences
            </p>
            <button
              onClick={() => navigate('/preferences')}
              className="btn btn-primary"
            >
              Update Preferences
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isSaved={savedDestinations.has(destination.id)}
                onToggleSave={() => toggleSave(destination.id)}
                onCreateTrip={() => createTripFromDestination(destination)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DestinationCard({ destination, isSaved, onToggleSave, onCreateTrip }) {
  return (
    <article className="card hover-lift cursor-pointer group relative">
      {/* Match Score Badge (if available) */}
      {destination.matchScore && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
          {Math.round(destination.matchScore)}% Match
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition"
      >
        {isSaved ? (
          <FaHeart className="text-red-500" size={18} />
        ) : (
          <FaRegHeart className="text-gray-600" size={18} />
        )}
      </button>

      {/* Image */}
      <div className="card-image mb-4">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-500" size={14} />
            <span className="font-medium">{destination.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {destination.description}
        </p>

        {/* Match Reasons */}
        {destination.matchReasons && destination.matchReasons.length > 0 && (
          <div className="mb-3 space-y-1">
            {destination.matchReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-primary-600">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Budget */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <FaDollarSign size={14} />
          <span>
            ${destination.avgDailyBudget.min} - ${destination.avgDailyBudget.max} per day
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.highlights.slice(0, 3).map((highlight, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateTrip();
          }}
          className="btn btn-primary w-full"
        >
          Plan Trip Here
        </button>
      </div>
    </article>
  );
}