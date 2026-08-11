import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('learnflow-token'));
  const [loading, setLoading] = useState(true); // initial auth check
  const [error, setError]     = useState(null);

  // Set or clear the auth token in axios defaults + localStorage
  const persistToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('learnflow-token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('learnflow-token');
      delete api.defaults.headers.common['Authorization'];
    }
    setToken(newToken);
  }, []);

  // On mount: validate stored token and hydrate user
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('learnflow-token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        setToken(storedToken);
      } catch {
        // Token invalid or expired — clear it
        persistToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [persistToken]);

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------
  const register = async (formData) => {
    setError(null);
    const { data } = await api.post('/auth/register', formData);
    persistToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (credentials) => {
    setError(null);
    const { data } = await api.post('/auth/login', credentials);
    persistToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed even if the request fails
    } finally {
      persistToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, isAuthenticated, register, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
