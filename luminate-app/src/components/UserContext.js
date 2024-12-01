import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    email: localStorage.getItem('userEmail') || '',
    token: localStorage.getItem('userToken') || '',
    isAuthenticated: !!localStorage.getItem('userToken'),
  });

  // Login Function
  const login = (email, token) => {
    localStorage.setItem('userEmail', email); // Store email in localStorage
    localStorage.setItem('userToken', token); // Store token in localStorage
    setAuthData({ email, token, isAuthenticated: true }); // Update context
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    setAuthData({ email: '', token: '', isAuthenticated: false }); // Clear context
  };

  // Auto-load user on app start
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setAuthData({ email, token, isAuthenticated: true });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authData, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
