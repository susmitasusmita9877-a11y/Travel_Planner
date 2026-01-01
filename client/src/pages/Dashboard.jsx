// client/src/pages/Dashboard.jsx - UPDATED WITH RUPEES
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  FaSuitcase, 
  FaCalendarAlt, 
  FaRunning, 
  FaDollarSign,
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
  FaFilter
} from "react-icons/fa";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    console.log("Dashboard mounted, user:", user);
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching trips...");
      const res = await api.get("/trips");
      console.log("Trips loaded:", res.data);
      setTrips(res.data || []);
    } catch (err) {
      console.error("fetchTrips error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newTrip) => {
    setCreateOpen(false);
    setTrips((prev) => [newTrip, ...prev]);
  };

  // Trip Status Helper
  const getTripStatus = (trip) => {
    if (!trip.startDate || !trip.endDate) return 'planning';
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    if (start <= now && end >= now) return 'active';
    if (end < now) return 'completed';
    return 'upcoming';
  };

  // Filter and Sort Logic
  const filteredTrips = trips
    .filter(trip => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          trip.title?.toLowerCase().includes(query) ||
          trip.destination?.toLowerCase().includes(query) ||
          trip.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(trip => {
      if (statusFilter !== 'all') {
        return getTripStatus(trip) === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      }
      if (sortBy === 'budget') {
        return (b.budget || 0) - (a.budget || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

  // Summary calculations
  const now = new Date();
  const totalTrips = trips.length;

  const upcomingTrips = trips.filter(
    (t) => t.startDate && new Date(t.startDate) > now
  ).length;

  const activeTrips = trips.filter(
    (t) =>
      t.startDate &&
      t.endDate &&
      new Date(t.startDate) <= now &&
      new Date(t.endDate) >= now
  ).length;

  const totalBudgetUsed = trips.reduce((sum, trip) => {
    const expensesTotal = (trip.expenses || []).reduce(
      (s, e) => s + (Number(e.amount) || 0),
      0
    );
    return sum + expensesTotal;
  }, 0);

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Trips</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button onClick={fetchTrips} className="btn btn-primary w-full">
              Try Again
            </button>
            <button onClick={() => navigate("/login")} className="btn btn-secondary w-full">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "Traveler"}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {totalTrips === 0 
                  ? "Ready to plan your first adventure?" 
                  : `You have ${upcomingTrips} upcoming trip${upcomingTrips !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <button
              onClick={() => navigate("/new-trip")}
              className="btn btn-primary flex items-center gap-2"
            >
              <FaPlus />
              Create New Trip
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Trips"
            value={totalTrips}
            icon={<FaSuitcase size={24} />}
            gradient="from-blue-500 to-blue-700"
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <SummaryCard
            title="Upcoming"
            value={upcomingTrips}
            icon={<FaCalendarAlt size={24} />}
            gradient="from-green-500 to-green-700"
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <SummaryCard
            title="Active"
            value={activeTrips}
            icon={<FaRunning size={24} />}
            gradient="from-yellow-500 to-yellow-600"
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <SummaryCard
            title="Total Spent"
            value={`₹${totalBudgetUsed.toLocaleString('en-IN')}`}
            icon={<FaDollarSign size={24} />}
            gradient="from-purple-500 to-purple-700"
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </section>

      {/* Trips Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Search and Filters */}
        {trips.length > 0 && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips by title, destination, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="planning">Planning</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="budget">Sort by Budget</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">×</button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2 capitalize">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-primary-900">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setSortBy('date');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
          {filteredTrips.length > 0 && trips.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {filteredTrips.length} of {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="skeleton h-48 w-full mb-4"></div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {searchQuery || statusFilter !== 'all' ? (
                <FaFilter size={48} className="text-gray-400" />
              ) : (
                <FaSuitcase size={48} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No trips found' : 'No trips yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start planning your next adventure today!'
              }
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/new-trip")}
                className="btn btn-primary"
              >
                Create Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTrips.map((trip) => (
              <TripCard 
                key={trip._id} 
                trip={trip} 
                onClick={() => navigate(`/trip/${trip._id}`)} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Trip Modal */}
      {createOpen && (
        <CreateTripModal
          onClose={() => setCreateOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}

/* Summary Card Component */
function SummaryCard({ title, value, icon, gradient, bgColor, iconColor }) {
  return (
    <div className="card hover-lift">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

/* Trip Card Component */
function TripCard({ trip, onClick }) {
  const imageUrl = trip.imageUrl || 
    `https://source.unsplash.com/800x600/?${encodeURIComponent(trip.destination || 'travel')}`;
  
  const now = new Date();
  let status = 'upcoming';
  let statusColor = 'badge-primary';
  
  if (trip.startDate && trip.endDate) {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    if (start <= now && end >= now) {
      status = 'active';
      statusColor = 'badge-success';
    } else if (end < now) {
      status = 'completed';
      statusColor = 'bg-gray-100 text-gray-700';
    }
  } else {
    status = 'planning';
    statusColor = 'bg-yellow-100 text-yellow-700';
  }

  return (
    <article 
      className="card cursor-pointer hover-lift group"
      onClick={onClick}
    >
      <div className="card-image mb-4">
        <img
          src={imageUrl}
          alt={trip.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://source.unsplash.com/800x600/?travel`;
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`badge ${statusColor} capitalize`}>
            {status}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition">
          {trip.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FaMapMarkerAlt size={14} />
          <span>{trip.destination}</span>
        </div>

        {trip.description && (
          <p className="text-sm text-gray-600 mb-3 truncate-2">
            {trip.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaClock size={12} />
            <span>
              {trip.startDate 
                ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Not set'
              }
            </span>
          </div>
          {trip.budget > 0 && (
            <div className="text-xs font-medium text-gray-700">
              ₹{trip.budget.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* Create Trip Modal */
function CreateTripModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.destination.trim()) {
      setError("Title and destination are required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/trips", {
        ...form,
        budget: form.budget ? Number(form.budget) : 0,
        travelers: form.travelers ? Number(form.travelers) : 1
      });
      onSuccess(res.data);
    } catch (err) {
      console.error("create trip", err);
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold">Create New Trip</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="input-group">
              <label className="input-label">Trip Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Summer in Goa"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Destination *</label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Goa, India"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Start Date</label>
              <input
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="date"
                className="input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">End Date</label>
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                type="date"
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Budget (₹)</label>
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                type="number"
                min="0"
                className="input"
                placeholder="e.g. 50000"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Number of Travelers</label>
              <input
                name="travelers"
                value={form.travelers}
                onChange={handleChange}
                type="number"
                min="1"
                className="input"
              />
            </div>
          </div>

          <div className="input-group mb-4">
            <label className="input-label">Cover Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              type="url"
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Provide a direct image URL
            </p>
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="textarea"
              placeholder="What makes this trip special?"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}