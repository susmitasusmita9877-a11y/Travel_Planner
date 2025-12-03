// client/src/components/NearbyPlaces.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaStore, 
  FaMapMarkerAlt, 
  FaStar,
  FaClock,
  FaPhone,
  FaDirections,
  FaUtensils,
  FaLandmark,
  FaCamera,
  FaMusic
} from 'react-icons/fa';

const PLACE_CATEGORIES = [
  { id: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> },
  { id: 'restaurants', label: 'Restaurants', icon: <FaUtensils /> },
  { id: 'attractions', label: 'Attractions', icon: <FaLandmark /> },
  { id: 'entertainment', label: 'Entertainment', icon: <FaMusic /> }
];

export default function NearbyPlaces({ destination, coordinates }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('shopping');
  const [radius, setRadius] = useState(5000); // 5km default
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (destination || coordinates) {
      fetchNearbyPlaces();
    }
  }, [destination, coordinates, selectedCategory, radius]);

  const fetchNearbyPlaces = async () => {
    setLoading(true);
    try {
      // In production, use Google Places API
      // const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
      // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${selectedCategory}&key=${API_KEY}`;
      
      // For now, using mock data
      const mockPlaces = generateMockPlaces(selectedCategory, destination);
      setPlaces(mockPlaces);
    } catch (err) {
      console.error('Fetch places error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPlaces = (category, location) => {
    const placesByCategory = {
      shopping: [
        'City Mall', 'Shopping Center', 'Boutique Street', 'Market Plaza',
        'Fashion District', 'Shopping Complex', 'Outlet Store', 'Local Bazaar'
      ],
      restaurants: [
        'Fine Dining Restaurant', 'Local Cuisine', 'Street Food Hub', 'Cafe Bistro',
        'Rooftop Restaurant', 'Family Diner', 'Food Court', 'Specialty Restaurant'
      ],
      attractions: [
        'Historic Monument', 'City Museum', 'Art Gallery', 'Botanical Garden',
        'Viewpoint', 'Cultural Center', 'Theme Park', 'Zoo'
      ],
      entertainment: [
        'Cinema Complex', 'Theater', 'Night Club', 'Live Music Venue',
        'Gaming Zone', 'Sports Bar', 'Comedy Club', 'Karaoke Lounge'
      ]
    };

    const names = placesByCategory[category] || [];
    
    return names.map((name, idx) => ({
      id: idx + 1,
      name,
      category,
      location,
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      reviews: Math.floor(Math.random() * 300) + 50,
      distance: (Math.random() * (radius / 1000)).toFixed(1),
      address: `${Math.floor(Math.random() * 500)} Main Street, ${location}`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      hours: idx % 2 === 0 ? 'Open • Closes 10 PM' : 'Open • Closes 9 PM',
      priceLevel: Math.floor(Math.random() * 3) + 1,
      image: `https://source.unsplash.com/800x600/?${category},${name.replace(/\s/g, '')}`,
      description: `Popular ${category} destination in ${location}. Highly rated by visitors.`,
      features: getFeaturesByCategory(category)
    }));
  };

  const getFeaturesByCategory = (category) => {
    const featureMap = {
      shopping: ['Credit Cards Accepted', 'Free Parking', 'Gift Wrapping', 'Returns Available'],
      restaurants: ['Reservations', 'Outdoor Seating', 'Delivery', 'Takeout'],
      attractions: ['Guided Tours', 'Audio Guides', 'Wheelchair Accessible', 'Photography Allowed'],
      entertainment: ['Online Tickets', 'Group Discounts', 'Parking Available', 'Food & Drinks']
    };
    return featureMap[category] || [];
  };

  const getDirections = (place) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
    window.open(url, '_blank');
  };

  const getPriceSymbol = (level) => {
    return '$'.repeat(level);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      shopping: <FaShoppingBag />,
      restaurants: <FaUtensils />,
      attractions: <FaLandmark />,
      entertainment: <FaMusic />
    };
    return iconMap[category] || <FaStore />;
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Explore Nearby</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {PLACE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                selectedCategory === cat.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.icon}
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="input-group">
          <label className="input-label">Search Radius</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="select"
          >
            <option value="1000">1 km</option>
            <option value="3000">3 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
          </select>
        </div>
      </div>

      {/* Places List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="skeleton h-40 w-full mb-3"></div>
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : places.length > 0 ? (
        <div>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900">
              {places.length} places found within {radius / 1000} km
            </h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {places.map((place) => (
              <div
                key={place.id}
                className="card hover-lift cursor-pointer"
                onClick={() => setSelectedPlace(place)}
              >
                {/* Place Image */}
                <div className="card-image mb-4">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/800x600/?${place.category}`;
                    }}
                  />
                </div>

                {/* Place Info */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-900">{place.name}</h5>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar size={14} />
                      <span className="text-sm font-medium text-gray-900">{place.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt size={12} />
                      <span>{place.distance} km away</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FaClock size={12} />
                      <span>{place.hours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {getPriceSymbol(place.priceLevel)}
                      </span>
                      <span>• {place.reviews} reviews</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(place);
                      }}
                      className="btn btn-primary text-sm flex-1"
                    >
                      <FaDirections />
                      Directions
                    </button>
                    <button className="btn btn-secondary text-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaStore size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">No places found</h4>
          <p className="text-gray-600">Try adjusting your search radius or category</p>
        </div>
      )}

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{selectedPlace.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      <span className="font-semibold text-gray-900">{selectedPlace.rating}</span>
                    </div>
                    <span className="text-gray-500">({selectedPlace.reviews} reviews)</span>
                    <span className="text-gray-500">• {getPriceSymbol(selectedPlace.priceLevel)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <p className="text-gray-600">{selectedPlace.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Address</div>
                        <div className="text-sm text-gray-600">{selectedPlace.address}</div>
                        <div className="text-xs text-primary-600 mt-1">
                          {selectedPlace.distance} km away
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <FaPhone className="text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Phone</div>
                        <div className="text-sm text-gray-600">{selectedPlace.phone}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-2">
                      <FaClock className="text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Hours</div>
                        <div className="text-sm text-gray-600">{selectedPlace.hours}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlace.features.map((feature, idx) => (
                      <span key={idx} className="badge badge-secondary">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => getDirections(selectedPlace)}
                    className="btn btn-primary flex-1"
                  >
                    <FaDirections />
                    Get Directions
                  </button>
                  <button className="btn btn-secondary">
                    <FaPhone />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}