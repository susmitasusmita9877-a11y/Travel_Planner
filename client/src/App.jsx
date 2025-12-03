// client/src/App.jsx - COMPLETE VERSION WITH ALL NEW ROUTES
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Analytics from "./pages/Analytics";
import UserPreferences from "./pages/UserPreferences";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/new-trip" 
          element={
            <ProtectedRoute>
              <NewTrip />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/trip/:id" 
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/trip/:id/edit" 
          element={
            <ProtectedRoute>
              <EditTrip />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* NEW ROUTES */}
        <Route 
          path="/discover" 
          element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute>
              <UserPreferences />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}