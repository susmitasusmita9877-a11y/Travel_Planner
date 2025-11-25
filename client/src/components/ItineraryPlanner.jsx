// Component for managing daily itinerary with drag-and-drop
import React, { useState } from 'react';
import { FaPlus, FaClock, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';

export default function ItineraryPlanner({ tripId, itinerary, onUpdate }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [newActivity, setNewActivity] = useState({
    time: '',
    title: '',
    location: '',
    description: '',
    duration: ''
  });

  const addActivity = () => {
    // Add activity to selected day
    const updated = [...itinerary];
    if (!updated[selectedDay - 1]) {
      updated[selectedDay - 1] = { day: selectedDay, activities: [] };
    }
    updated[selectedDay - 1].activities.push({ ...newActivity, id: Date.now() });
    onUpdate(updated);
    setNewActivity({ time: '', title: '', location: '', description: '', duration: '' });
  };

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedDay === day
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* Add Activity Form */}
      <div className="card bg-gray-50">
        <h4 className="font-semibold mb-4">Add Activity</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="time"
            value={newActivity.time}
            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
            className="input"
            placeholder="Time"
          />
          <input
            type="text"
            value={newActivity.title}
            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
            className="input"
            placeholder="Activity title"
          />
          <input
            type="text"
            value={newActivity.location}
            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
            className="input"
            placeholder="Location"
          />
          <input
            type="text"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            className="input"
            placeholder="Duration (e.g., 2 hours)"
          />
        </div>
        <textarea
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          className="textarea mt-3"
          placeholder="Description"
          rows={2}
        ></textarea>
        <button onClick={addActivity} className="btn btn-primary mt-3">
          <FaPlus /> Add Activity
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {itinerary[selectedDay - 1]?.activities?.map((activity, idx) => (
          <div key={activity.id} className="card flex gap-4">
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-sm font-medium text-primary-600">{activity.time}</div>
              <div className="text-xs text-gray-500">{activity.duration}</div>
            </div>
            <div className="flex-1">
              <h5 className="font-semibold">{activity.title}</h5>
              {activity.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <FaMapMarkerAlt size={12} />
                  {activity.location}
                </div>
              )}
              {activity.description && (
                <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
              )}
            </div>
            <button className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}