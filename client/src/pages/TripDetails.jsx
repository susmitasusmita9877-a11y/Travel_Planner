// client/src/pages/TripDetails.jsx - UPDATED WITH NEW FEATURES
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  FaHotel, 
  FaShoppingBag, 
  FaCloudSun,
  FaListUl,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash
} from "react-icons/fa";

// Import new components
import HotelBooking from "../components/HotelBooking";
import NearbyPlaces from "../components/NearbyPlaces";
import EnhancedWeather from "../components/EnhancedWeather";

const CHECK_CATEGORIES = ["Packing", "Documents", "Tasks"];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", destination: "", description: "", imageUrl: "" });

  // checklist state
  const [newCheckText, setNewCheckText] = useState("");
  const [newCheckCategory, setNewCheckCategory] = useState(CHECK_CATEGORIES[0]);

  // expense state
  const [expenseForm, setExpenseForm] = useState({ category: "Transportation", name: "", amount: "", date: "" });

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line
  }, [id]);

  async function fetchTrip() {
    setLoading(true);
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
      setEditForm({
        title: res.data.title || "",
        destination: res.data.destination || "",
        description: res.data.description || "",
        imageUrl: res.data.imageUrl || ""
      });
    } catch (err) {
      console.error("fetchTrip", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  // generic save helper (sends only changed fields)
  async function saveTrip(partial) {
    try {
      const res = await api.put(`/trips/${id}`, partial);
      setTrip(res.data);
    } catch (err) {
      console.error("saveTrip error", err);
      alert("Save failed");
    }
  }

  // Edit modal actions
  function openEdit() {
    setEditOpen(true);
  }
  async function saveEdit() {
    const payload = {
      title: editForm.title,
      destination: editForm.destination,
      description: editForm.description,
      imageUrl: editForm.imageUrl
    };
    await saveTrip(payload);
    setEditOpen(false);
  }

  // Checklist actions
  function addChecklist() {
    const text = newCheckText.trim();
    if (!text) return;
    const list = [...(trip.checklist || []), { category: newCheckCategory, text, done: false }];
    saveTrip({ checklist: list });
    setNewCheckText("");
  }

  function toggleChecklist(index) {
    const list = (trip.checklist || []).map((it, i) => i === index ? { ...it, done: !it.done } : it);
    saveTrip({ checklist: list });
  }

  function deleteChecklist(index) {
    const list = (trip.checklist || []).filter((_, i) => i !== index);
    saveTrip({ checklist: list });
  }

  // Expense actions
  function addExpense() {
    const amount = parseFloat(expenseForm.amount || 0);
    if (!expenseForm.name.trim() || !expenseForm.category || !amount) return alert("Enter valid expense name and amount");
    const ex = {
      category: expenseForm.category,
      name: expenseForm.name.trim(),
      amount,
      description: expenseForm.description || "",
      date: expenseForm.date || new Date().toISOString().slice(0,10)
    };
    const list = [...(trip.expenses || []), ex];
    saveTrip({ expenses: list });
    setExpenseForm({ category: "Transportation", name: "", amount: "", description: "", date: "" });
  }

  function deleteExpense(index) {
    const list = (trip.expenses || []).filter((_, i) => i !== index);
    saveTrip({ expenses: list });
  }

  async function deleteTrip() {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await api.delete(`/trips/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("deleteTrip", err);
      alert("Failed to delete");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!trip) return <div className="p-6">Trip not found</div>;

  // derived values
  const totalExpenses = (trip.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
  const budget = Number(trip.budget || 0);
  const percentUsed = budget ? Math.round((totalExpenses / budget) * 100) : 0;
  const percentSafe = Math.max(0, Math.min(100, percentUsed));

  const tabs = [
    { id: "Overview", icon: <FaCalendarAlt />, label: "Overview" },
    { id: "Checklist", icon: <FaListUl />, label: "Checklist" },
    { id: "Budget", icon: <FaDollarSign />, label: "Budget" },
    { id: "Hotels", icon: <FaHotel />, label: "Hotels" },
    { id: "Explore", icon: <FaShoppingBag />, label: "Explore" },
    { id: "Weather", icon: <FaCloudSun />, label: "Weather" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {trip.destination}
                </span>
                {trip.startDate && trip.endDate && (
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={openEdit} className="btn btn-secondary">
                <FaEdit /> Edit
              </button>
              <button onClick={deleteTrip} className="btn btn-danger">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
                <p className="text-gray-700 mb-6">{trip.description || "No description"}</p>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                    <div className="font-semibold text-gray-900">
                      {trip.startDate && trip.endDate 
                        ? `${Math.max(0, Math.round((new Date(trip.endDate)-new Date(trip.startDate))/(1000*60*60*24)))} days` 
                        : "—"}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Travelers</div>
                    <div className="font-semibold text-gray-900">{trip.travelers || 1}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Budget</div>
                    <div className="font-semibold text-gray-900">${budget || 0}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Tasks Done</div>
                    <div className="font-semibold text-gray-900">
                      {(trip.checklist||[]).filter(i=>i.done).length}/{(trip.checklist||[]).length}
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="font-medium text-gray-700">Budget Used</div>
                    <div className="font-semibold text-gray-900">${totalExpenses} / ${budget || 0}</div>
                  </div>
                  <div className="progress-container">
                    <div
                      className={`progress-bar ${
                        percentSafe > 80 ? "progress-danger" : 
                        percentSafe > 50 ? "progress-warning" : 
                        "progress-success"
                      }`}
                      style={{ width: `${percentSafe}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{percentSafe}% used</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Checklist" && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Checklist</h2>

              <div className="mb-6 flex gap-3">
                <input
                  value={newCheckText}
                  onChange={(e)=>setNewCheckText(e.target.value)}
                  className="input flex-1"
                  placeholder="New checklist item"
                />
                <select
                  value={newCheckCategory}
                  onChange={(e)=>setNewCheckCategory(e.target.value)}
                  className="select"
                >
                  {CHECK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={addChecklist} className="btn btn-primary">
                  Add
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {CHECK_CATEGORIES.map(cat => {
                  const list = (trip.checklist||[]).filter(i=>i.category===cat);
                  return (
                    <div key={cat} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{cat}</h4>
                          <div className="text-sm text-gray-500">
                            {list.filter(i=>i.done).length}/{list.length} done
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {list.length === 0 && <div className="text-gray-500 text-sm">No items</div>}
                        {list.map((it, idx) => {
                          const globalIndex = (trip.checklist||[]).findIndex(x => x === it);
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded">
                              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={it.done}
                                  onChange={()=>toggleChecklist(globalIndex)}
                                  className="w-4 h-4"
                                />
                                <span className={it.done ? "line-through text-gray-500" : "text-gray-900"}>
                                  {it.text}
                                </span>
                              </label>
                              <button
                                onClick={()=>deleteChecklist(globalIndex)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "Budget" && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Budget & Expenses</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-4">Add Expense</h4>
                  <div className="space-y-3">
                    <select
                      className="select"
                      value={expenseForm.category}
                      onChange={(e)=>setExpenseForm({...expenseForm, category: e.target.value})}
                    >
                      <option>Transportation</option>
                      <option>Food</option>
                      <option>Accommodation</option>
                      <option>Misc</option>
                    </select>
                    <input
                      className="input"
                      placeholder="Expense name"
                      value={expenseForm.name}
                      onChange={(e)=>setExpenseForm({...expenseForm, name: e.target.value})}
                    />
                    <input
                      className="input"
                      placeholder="Amount"
                      value={expenseForm.amount}
                      onChange={(e)=>setExpenseForm({...expenseForm, amount: e.target.value})}
                      type="number"
                    />
                    <input
                      className="input"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e)=>setExpenseForm({...expenseForm, date: e.target.value})}
                    />
                    <button onClick={addExpense} className="btn btn-success w-full">
                      Add Expense
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Summary</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-semibold text-gray-900">${totalExpenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-semibold text-gray-900">${budget || 0}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-sm text-gray-600 mb-2">Breakdown by Category</div>
                      {["Transportation","Food","Accommodation","Misc"].map(cat => {
                        const sum = (trip.expenses||[])
                          .filter(e=>e.category===cat)
                          .reduce((s,e)=>s+Number(e.amount||0),0);
                        if (sum === 0) return null;
                        return (
                          <div key={cat} className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-700">{cat}</span>
                            <span className="text-sm font-medium text-gray-900">${sum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">All Expenses</h4>
                <div className="space-y-2">
                  {(trip.expenses || []).length === 0 && (
                    <div className="text-gray-500 text-center py-8">No expenses yet</div>
                  )}
                  {(trip.expenses || []).map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{ex.name}</div>
                        <div className="text-sm text-gray-500">
                          {ex.category} • {ex.date || ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-gray-900">${ex.amount}</div>
                        <button
                          onClick={()=>deleteExpense(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Hotels" && (
            <HotelBooking
              destination={trip.destination}
              checkIn={trip.startDate}
              checkOut={trip.endDate}
            />
          )}

          {activeTab === "Explore" && (
            <NearbyPlaces destination={trip.destination} />
          )}

          {activeTab === "Weather" && (
            <EnhancedWeather destination={trip.destination} />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="modal-overlay" onClick={()=>setEditOpen(false)}>
          <div className="modal-content max-w-2xl" onClick={(e)=>e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Edit Trip</h3>
              <div className="space-y-4">
                <input
                  className="input"
                  value={editForm.title}
                  onChange={(e)=>setEditForm({...editForm, title: e.target.value})}
                  placeholder="Trip title"
                />
                <input
                  className="input"
                  value={editForm.destination}
                  onChange={(e)=>setEditForm({...editForm, destination: e.target.value})}
                  placeholder="Destination"
                />
                <input
                  className="input"
                  value={editForm.imageUrl}
                  onChange={(e)=>setEditForm({...editForm, imageUrl: e.target.value})}
                  placeholder="Image URL"
                />
                <textarea
                  className="textarea"
                  rows={4}
                  value={editForm.description}
                  onChange={(e)=>setEditForm({...editForm, description: e.target.value})}
                  placeholder="Description"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="btn btn-secondary" onClick={()=>setEditOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}