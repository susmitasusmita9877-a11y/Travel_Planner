// client/src/api/axios.js - FIXED VERSION
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log('Axios baseURL:', baseURL);

const api = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Axios: Added token to request:', config.url);
    } else {
      console.log('Axios: No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Axios response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Axios response error:', error.response?.status, error.response?.data);
    
    // If 401, clear token and redirect to login
    if (error.response?.status === 401) {
      console.log('Axios: 401 Unauthorized, clearing token');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;