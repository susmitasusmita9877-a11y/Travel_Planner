// client/src/pages/NewTrip.jsx - FIXED WITH IMAGE PREVIEW
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NewTrip() {
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
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  // Update image preview when imageUrl or destination changes
  useEffect(() => {
    if (form.imageUrl && form.imageUrl.trim()) {
      setImagePreview(form.imageUrl);
    } else if (form.destination && form.destination.trim()) {
      setImagePreview(`https://source.unsplash.com/800x400/?${encodeURIComponent(form.destination)}`);
    } else {
      setImagePreview("https://source.unsplash.com/800x400/?travel");
    }
  }, [form.imageUrl, form.destination]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.destination.trim()) {
      setError("Title and destination are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        destination: form.destination.trim(),
        description: form.description,
        imageUrl: form.imageUrl,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget ? Number(form.budget) : 0,
        travelers: form.travelers ? Number(form.travelers) : 1
      };
      await api.post("/trips", payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Create trip failed", err);
      setError(err.response?.data?.message || "Failed to create trip. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: preview */}
          <div className="p-6 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Create Trip</h2>
            <p className="text-sm opacity-90 mb-4">Add your trip details and make it beautiful.</p>
            <div className="mt-auto">
              <div className="rounded-md shadow overflow-hidden w-full h-48 bg-white/10">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://source.unsplash.com/800x400/?travel";
                  }}
                />
              </div>
              {form.title && (
                <div className="mt-4 bg-white/10 rounded-lg p-3">
                  <h3 className="font-semibold text-lg">{form.title}</h3>
                  {form.destination && (
                    <p className="text-sm opacity-90">📍 {form.destination}</p>
                  )}
                  {form.startDate && form.endDate && (
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(form.startDate).toLocaleDateString()} - {new Date(form.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-white bg-red-500 px-3 py-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Title *
                </label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g., Summer in Bali" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input 
                  name="destination" 
                  value={form.destination} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g., Bali, Indonesia" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="What makes this trip special?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input 
                  name="imageUrl" 
                  value={form.imageUrl} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="https://example.com/image.jpg" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use Unsplash image based on destination
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input 
                    name="startDate" 
                    value={form.startDate} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input 
                    name="endDate" 
                    value={form.endDate} 
                    onChange={handleChange} 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (USD)
                  </label>
                  <input 
                    name="budget" 
                    value={form.budget} 
                    onChange={handleChange} 
                    type="number" 
                    min="0" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="1000" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travelers
                  </label>
                  <input 
                    name="travelers" 
                    value={form.travelers} 
                    onChange={handleChange} 
                    type="number" 
                    min="1" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => navigate("/dashboard")} 
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}