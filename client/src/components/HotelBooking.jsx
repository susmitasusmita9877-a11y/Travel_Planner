// client/src/components/HotelBooking.jsx - FIXED VERSION
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
  FaDollarSign,
  FaExternalLinkAlt
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
      const mockHotels = generateMockHotels(searchParams.destination);
      
      let filtered = mockHotels;
      if (searchParams.priceRange !== 'all') {
        filtered = filtered.filter(h => h.priceCategory === searchParams.priceRange);
      }
      
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

    const hotelImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
      'https://images.unsplash.com/photo-1562133567-b6a0a9c2b4c7?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80'
    ];

    return hotelNames.map((name, idx) => ({
      id: idx + 1,
      name,
      location: location,
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 100,
      price: Math.floor(Math.random() * 10000) + 2500, // ₹2500-₹12500
      priceCategory: idx < 3 ? 'budget' : idx < 6 ? 'mid-range' : 'luxury',
      image: hotelImages[idx],
      amenities: [
        'Free WiFi',
        'Free Parking',
        idx > 3 ? 'Pool' : null,
        idx > 5 ? 'Spa' : null,
        'Restaurant',
        'Room Service'
      ].filter(Boolean),
      distance: (Math.random() * 5).toFixed(1),
      description: `Experience luxury and comfort at ${name}. Located in the heart of ${location}.`,
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location + ' ' + name)}`
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
    // Open booking site in new tab
    window.open(hotel.bookingUrl, '_blank');
  };

  const viewDetails = (hotel) => {
    setSelectedHotel(hotel);
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
                <option value="budget">Budget (₹2500-₹5000)</option>
                <option value="mid-range">Mid-range (₹5000-₹10000)</option>
                <option value="luxury">Luxury (₹10000+)</option>
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
              <div key={hotel.id} className="card hover-lift">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Hotel Image */}
                  <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                      }}
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
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
                          ₹{hotel.price}
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
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          Total for {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}:
                          <span className="font-semibold text-gray-900 ml-2">
                            ₹{(hotel.price * calculateNights()).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => viewDetails(hotel)}
                            className="btn btn-secondary text-sm"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => openBooking(hotel)}
                            className="btn btn-primary text-sm flex items-center gap-2"
                          >
                            Book Now <FaExternalLinkAlt size={12} />
                          </button>
                        </div>
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

      {/* Details Modal */}
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
                    ₹{selectedHotel.price}/night
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
                        ₹{(selectedHotel.price * calculateNights()).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => openBooking(selectedHotel)}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  Proceed to Booking <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}