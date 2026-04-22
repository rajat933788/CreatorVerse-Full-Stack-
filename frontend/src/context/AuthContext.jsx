import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cv_token'); // JWT must stay in localStorage
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe() {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user); // all data comes from MongoDB
    } catch {
      localStorage.removeItem('cv_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token); // only token in localStorage
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token); // only token in localStorage
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('cv_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  // Update local state only (caller is responsible for saving to MongoDB via API)
  function updateProfile(updates) {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
