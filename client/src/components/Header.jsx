// client/src/components/Header.jsx - ENHANCED WITH PROFILE
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  // Don't show header on landing, login, register pages
  const hideHeader = ['/', '/login', '/register'].includes(location.pathname);
  if (hideHeader && !user) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition">
              <span className="text-white font-bold text-lg">TP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent hidden sm:block">
              Travel Planner
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/new-trip"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/new-trip')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                New Trip
              </Link>
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Profile Dropdown - Desktop */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaUser className="text-gray-400" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaCog className="text-gray-400" />
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600 w-full text-left"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {showMobileMenu ? (
                    <FaTimes size={20} className="text-gray-700" />
                  ) : (
                    <FaBars size={20} className="text-gray-700" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-in">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-lg font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/new-trip"
                className={`block px-4 py-3 rounded-lg font-medium transition ${
                  isActive('/new-trip')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                New Trip
              </Link>
              <Link
                to="/profile"
                className={`block px-4 py-3 rounded-lg font-medium transition ${
                  isActive('/profile')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Profile
              </Link>
              
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}