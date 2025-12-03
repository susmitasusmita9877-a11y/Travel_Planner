// server/services/aiRecommendations.js
// AI-powered destination recommendations based on user preferences

const destinationsDatabase = [
  {
    id: 'paris',
    name: 'Paris, France',
    interests: ['culture', 'food', 'photography', 'heritage', 'city'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    avgDailyBudget: { min: 80, max: 200 },
    description: 'The City of Light offers world-class museums, cuisine, and romantic ambiance',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    rating: 4.8,
    popularActivities: ['museum tours', 'wine tasting', 'river cruises', 'cafe hopping'],
    travelPace: ['moderate', 'relaxed']
  },
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    interests: ['beach', 'nature', 'adventure', 'spiritual', 'photography'],
    budgetRange: ['budget', 'mid-range'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    avgDailyBudget: { min: 30, max: 100 },
    description: 'Tropical paradise with stunning beaches, rice terraces, and spiritual temples',
    highlights: ['Uluwatu Temple', 'Rice Terraces', 'Mount Batur', 'Seminyak Beach'],
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.7,
    popularActivities: ['surfing', 'yoga retreats', 'temple visits', 'snorkeling'],
    travelPace: ['relaxed', 'moderate']
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    interests: ['city', 'culture', 'food', 'shopping', 'heritage'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['spring', 'autumn'],
    avgDailyBudget: { min: 70, max: 180 },
    description: 'Futuristic metropolis blending tradition with cutting-edge technology',
    highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Tokyo Skytree', 'Tsukiji Market'],
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    rating: 4.9,
    popularActivities: ['ramen tours', 'anime districts', 'cherry blossoms', 'sumo wrestling'],
    travelPace: ['fast', 'moderate']
  },
  {
    id: 'iceland',
    name: 'Reykjavik, Iceland',
    interests: ['nature', 'adventure', 'photography', 'mountains'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['summer', 'winter'],
    avgDailyBudget: { min: 100, max: 250 },
    description: 'Land of fire and ice with breathtaking natural wonders',
    highlights: ['Blue Lagoon', 'Northern Lights', 'Golden Circle', 'Black Sand Beaches'],
    imageUrl: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800',
    rating: 4.8,
    popularActivities: ['glacier hiking', 'hot springs', 'aurora hunting', 'volcano tours'],
    travelPace: ['moderate', 'relaxed']
  },
  {
    id: 'rome',
    name: 'Rome, Italy',
    interests: ['heritage', 'culture', 'food', 'city', 'photography'],
    budgetRange: ['budget', 'mid-range', 'luxury'],
    bestSeasons: ['spring', 'autumn'],
    avgDailyBudget: { min: 60, max: 150 },
    description: 'Eternal City with ancient ruins, Renaissance art, and amazing cuisine',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    rating: 4.7,
    popularActivities: ['historical tours', 'pasta making', 'vespa rides', 'wine tasting'],
    travelPace: ['moderate', 'fast']
  },
  {
    id: 'maldives',
    name: 'Maldives',
    interests: ['beach', 'nature', 'adventure', 'photography'],
    budgetRange: ['luxury'],
    bestSeasons: ['winter', 'spring'],
    avgDailyBudget: { min: 200, max: 500 },
    description: 'Tropical island paradise with crystal-clear waters and luxury resorts',
    highlights: ['Overwater Bungalows', 'Coral Reefs', 'Bioluminescent Beach', 'Diving'],
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    rating: 4.9,
    popularActivities: ['scuba diving', 'snorkeling', 'spa treatments', 'sunset cruises'],
    travelPace: ['relaxed']
  },
  {
    id: 'new-york',
    name: 'New York City, USA',
    interests: ['city', 'culture', 'food', 'shopping', 'nightlife'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['spring', 'autumn'],
    avgDailyBudget: { min: 100, max: 300 },
    description: 'The city that never sleeps with iconic landmarks and diverse culture',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    rating: 4.8,
    popularActivities: ['broadway shows', 'museum hopping', 'rooftop bars', 'food tours'],
    travelPace: ['fast', 'moderate']
  },
  {
    id: 'santorini',
    name: 'Santorini, Greece',
    interests: ['beach', 'photography', 'food', 'heritage'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['spring', 'summer', 'autumn'],
    avgDailyBudget: { min: 80, max: 200 },
    description: 'Iconic white-washed buildings with stunning sunset views over the Aegean',
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Akrotiri', 'Wine Tours'],
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    rating: 4.9,
    popularActivities: ['sunset watching', 'wine tasting', 'boat tours', 'beach hopping'],
    travelPace: ['relaxed', 'moderate']
  },
  {
    id: 'dubai',
    name: 'Dubai, UAE',
    interests: ['city', 'shopping', 'adventure', 'luxury'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['winter', 'spring'],
    avgDailyBudget: { min: 90, max: 250 },
    description: 'Futuristic city in the desert with record-breaking architecture',
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    rating: 4.7,
    popularActivities: ['skyscraper visits', 'luxury shopping', 'desert adventures', 'beach clubs'],
    travelPace: ['moderate', 'fast']
  },
  {
    id: 'patagonia',
    name: 'Patagonia, Argentina',
    interests: ['nature', 'adventure', 'mountains', 'photography', 'wildlife'],
    budgetRange: ['mid-range', 'luxury'],
    bestSeasons: ['summer', 'autumn'],
    avgDailyBudget: { min: 80, max: 180 },
    description: 'Vast wilderness with glaciers, mountains, and pristine landscapes',
    highlights: ['Perito Moreno Glacier', 'Torres del Paine', 'Fitz Roy', 'Beagle Channel'],
    imageUrl: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800',
    rating: 4.9,
    popularActivities: ['trekking', 'glacier walking', 'wildlife watching', 'camping'],
    travelPace: ['moderate', 'fast']
  }
];

class AIRecommendationService {
  /**
   * Calculate match score between user preferences and destination
   */
  calculateMatchScore(destination, preferences) {
    let score = 0;
    let maxScore = 0;

    // Interest matching (40% weight)
    if (preferences.interests && preferences.interests.length > 0) {
      maxScore += 40;
      const matchingInterests = destination.interests.filter(interest =>
        preferences.interests.includes(interest)
      );
      score += (matchingInterests.length / preferences.interests.length) * 40;
    }

    // Budget matching (25% weight)
    if (preferences.budgetRange) {
      maxScore += 25;
      if (destination.budgetRange.includes(preferences.budgetRange)) {
        score += 25;
      }
    }

    // Budget per day matching (15% weight)
    if (preferences.budgetPerDay) {
      maxScore += 15;
      const userMin = preferences.budgetPerDay.min;
      const userMax = preferences.budgetPerDay.max;
      const destMin = destination.avgDailyBudget.min;
      const destMax = destination.avgDailyBudget.max;
      
      // Check if there's overlap in budget ranges
      if (!(userMax < destMin || userMin > destMax)) {
        score += 15;
      }
    }

    // Travel pace matching (10% weight)
    if (preferences.travelPace) {
      maxScore += 10;
      if (destination.travelPace.includes(preferences.travelPace)) {
        score += 10;
      }
    }

    // Season matching (10% weight)
    if (preferences.preferredSeasons && preferences.preferredSeasons.length > 0) {
      maxScore += 10;
      const matchingSeasons = destination.bestSeasons.filter(season =>
        preferences.preferredSeasons.includes(season)
      );
      if (matchingSeasons.length > 0) {
        score += (matchingSeasons.length / preferences.preferredSeasons.length) * 10;
      }
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  /**
   * Get personalized recommendations based on user preferences
   */
  getRecommendations(preferences, limit = 6) {
    const scoredDestinations = destinationsDatabase.map(destination => ({
      ...destination,
      matchScore: this.calculateMatchScore(destination, preferences),
      matchReasons: this.getMatchReasons(destination, preferences)
    }));

    // Sort by match score and rating
    scoredDestinations.sort((a, b) => {
      if (Math.abs(a.matchScore - b.matchScore) < 5) {
        return b.rating - a.rating;
      }
      return b.matchScore - a.matchScore;
    });

    return scoredDestinations.slice(0, limit);
  }

  /**
   * Generate human-readable reasons for the match
   */
  getMatchReasons(destination, preferences) {
    const reasons = [];

    // Interest matches
    if (preferences.interests && preferences.interests.length > 0) {
      const matching = destination.interests.filter(i =>
        preferences.interests.includes(i)
      );
      if (matching.length > 0) {
        reasons.push(`Perfect for ${matching.slice(0, 2).join(' and ')} enthusiasts`);
      }
    }

    // Budget match
    if (preferences.budgetRange && destination.budgetRange.includes(preferences.budgetRange)) {
      reasons.push(`Fits your ${preferences.budgetRange} budget`);
    }

    // Season match
    if (preferences.preferredSeasons && preferences.preferredSeasons.length > 0) {
      const matching = destination.bestSeasons.filter(s =>
        preferences.preferredSeasons.includes(s)
      );
      if (matching.length > 0) {
        reasons.push(`Best visited in ${matching[0]}`);
      }
    }

    // Travel pace
    if (preferences.travelPace && destination.travelPace.includes(preferences.travelPace)) {
      reasons.push(`Matches your ${preferences.travelPace} pace`);
    }

    return reasons.slice(0, 3);
  }

  /**
   * Get trending destinations (most popular)
   */
  getTrending(limit = 6) {
    return destinationsDatabase
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Search destinations by query
   */
  search(query, limit = 10) {
    const lowerQuery = query.toLowerCase();
    return destinationsDatabase
      .filter(dest =>
        dest.name.toLowerCase().includes(lowerQuery) ||
        dest.description.toLowerCase().includes(lowerQuery) ||
        dest.interests.some(i => i.includes(lowerQuery)) ||
        dest.highlights.some(h => h.toLowerCase().includes(lowerQuery))
      )
      .slice(0, limit);
  }

  /**
   * Get destination by ID
   */
  getDestinationById(id) {
    return destinationsDatabase.find(dest => dest.id === id);
  }

  /**
   * Get similar destinations
   */
  getSimilarDestinations(destinationId, limit = 4) {
    const destination = this.getDestinationById(destinationId);
    if (!destination) return [];

    const scored = destinationsDatabase
      .filter(d => d.id !== destinationId)
      .map(d => {
        const interestOverlap = d.interests.filter(i =>
          destination.interests.includes(i)
        ).length;
        const budgetMatch = d.budgetRange.some(b =>
          destination.budgetRange.includes(b)
        ) ? 1 : 0;
        
        return {
          ...d,
          similarityScore: interestOverlap + budgetMatch
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, limit);
  }
}

module.exports = new AIRecommendationService();