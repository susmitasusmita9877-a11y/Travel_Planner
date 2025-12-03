// client/src/components/HotelBooking.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaHotel, 
  FaStar, 
  FaMapMarkerAlt, 
  FaWifi, 
  FaParking, 
  FaSwimmingPool,
  FaUtensils,
  FaSearch,
  FaDollarSign
} from 'react-icons/fa';

export default function HotelBooking({ destination, checkIn, checkOut }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    destination: destination || '',
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    guests: 2,
    priceRange: 'all',
    rating: 0
  });
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    if (destination) {
      searchHotels();
    }
  }, [destination]);

  const searchHotels = async () => {
    setLoading(true);
    try {
      // Simulated hotel data - In production, integrate with real hotel APIs like:
      // - Booking.com API
      // - Expedia API
      // - Hotels.com API
      // - Amadeus Hotel Search API
      
      const mockHotels = generateMockHotels(searchParams.destination);
      
      // Filter by price range
      let filtered = mockHotels;
      if (searchParams.priceRange !== 'all') {
        filtered = filtered.filter(h => h.priceCategory === searchParams.priceRange);
      }
      
      // Filter by rating
      if (searchParams.rating > 0) {
        filtered = filtered.filter(h => h.rating >= searchParams.rating);
      }
      
      setHotels(filtered);
    } catch (err) {
      console.error('Hotel search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHotels = (location) => {
    const hotelNames = [
      'Grand Palace Hotel', 'Sunset Resort', 'City Center Inn',
      'Luxury Suites', 'Beachfront Villa', 'Mountain View Lodge',
      'Urban Boutique Hotel', 'Paradise Resort & Spa', 'Heritage Hotel'
    ];

    return hotelNames.map((name, idx) => ({
      id: idx + 1,
      name,
      location: location,
      rating: (3 + Math.random() * 2).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 100,
      price: Math.floor(Math.random() * 200) + 50,
      priceCategory: idx < 3 ? 'budget' : idx < 6 ? 'mid-range' : 'luxury',
      image: `https://source.unsplash.com/800x600/?hotel,${name.replace(/\s/g, '')}`,
      amenities: [
        'Free WiFi',
        'Free Parking',
        idx > 3 ? 'Pool' : null,
        idx > 5 ? 'Spa' : null,
        'Restaurant',
        'Room Service'
      ].filter(Boolean),
      distance: (Math.random() * 5).toFixed(1),
      description: `Experience luxury and comfort at ${name}. Located in the heart of ${location}.`
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHotels();
  };

  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 0;
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const openBooking = (hotel) => {
    setSelectedHotel(hotel);
    // In production, integrate with booking API or redirect to booking page
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaHotel className="text-primary-600" />
          Search Hotels
        </h3>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Destination</label>
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                className="input"
                placeholder="Enter city or location"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Guests</label>
              <input
                type="number"
                min="1"
                max="10"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                className="input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Check-in</label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                className="input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Check-out</label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                className="input"
                min={searchParams.checkIn}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Price Range</label>
              <select
                value={searchParams.priceRange}
                onChange={(e) => setSearchParams({ ...searchParams, priceRange: e.target.value })}
                className="select"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget ($50-$100)</option>
                <option value="mid-range">Mid-range ($100-$200)</option>
                <option value="luxury">Luxury ($200+)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Minimum Rating</label>
              <select
                value={searchParams.rating}
                onChange={(e) => setSearchParams({ ...searchParams, rating: Number(e.target.value) })}
                className="select"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            <FaSearch />
            Search Hotels
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="skeleton w-48 h-32"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-6 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hotels.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">
              {hotels.length} hotels found
            </h4>
            {calculateNights() > 0 && (
              <div className="text-sm text-gray-600">
                {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="card hover-lift cursor-pointer" onClick={() => openBooking(hotel)}>
                <div className="flex gap-4">
                  {/* Hotel Image */}
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/800x600/?hotel';
                      }}
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold text-lg text-gray-900">{hotel.name}</h5>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt size={12} />
                          <span>{hotel.location} • {hotel.distance} km from center</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                          <FaStar />
                          <span className="font-semibold text-gray-900">{hotel.rating}</span>
                          <span className="text-xs text-gray-500">({hotel.reviews} reviews)</span>
                        </div>
                        <div className="text-2xl font-bold text-primary-600">
                          ${hotel.price}
                        </div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {hotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="badge badge-secondary text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {calculateNights() > 0 && (
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          Total for {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}:
                          <span className="font-semibold text-gray-900 ml-2">
                            ${hotel.price * calculateNights()}
                          </span>
                        </div>
                        <button className="btn btn-primary text-sm">
                          Book Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaHotel size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">No hotels found</h4>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedHotel && (
        <div className="modal-overlay" onClick={() => setSelectedHotel(null)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedHotel.name}</h3>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{selectedHotel.rating}</span>
                    <span className="text-gray-500">({selectedHotel.reviews} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    ${selectedHotel.price}/night
                  </div>
                </div>

                <p className="text-gray-600">{selectedHotel.description}</p>

                <div>
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity, idx) => (
                      <span key={idx} className="badge badge-secondary">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {calculateNights() > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span>Check-in:</span>
                      <span className="font-semibold">{searchParams.checkIn}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Check-out:</span>
                      <span className="font-semibold">{searchParams.checkOut}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Guests:</span>
                      <span className="font-semibold">{searchParams.guests}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-primary-600">
                        ${selectedHotel.price * calculateNights()}
                      </span>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary w-full">
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}