// client/src/context/AuthContext.jsx - FIXED VERSION
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    console.log('AuthContext: Checking auth, token:', token ? 'exists' : 'missing');
    
    if (!token) {
      console.log('AuthContext: No token found, setting ready to true');
      setReady(true);
      return;
    }
    
    try {
      console.log('AuthContext: Fetching user data...');
      const res = await api.get('/auth/me');
      console.log('AuthContext: User data received:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('AuthContext: Failed to fetch user:', err);
      console.error('AuthContext: Error response:', err.response?.data);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      console.log('AuthContext: Setting ready to true');
      setReady(true);
    }
  };

  const setAuth = (token, userData) => {
    if (token) {
      localStorage.setItem('token', token);
      console.log('AuthContext: Token saved');
    }
    if (userData) {
      setUser(userData);
      console.log('AuthContext: User set:', userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('AuthContext: User logged out');
  };

  console.log('AuthContext render - user:', user, 'ready:', ready);

  return (
    <AuthContext.Provider value={{ user, setUser, setAuth, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};