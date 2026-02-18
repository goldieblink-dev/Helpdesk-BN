import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Configure axios defaults when token changes
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        // We set the header here for this request (and future ones if valid)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get(`${API_BASE_URL}/admin/verify-token`);

        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.admin);
        } else {
          // Token invalid
          setAuthToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, admin } = response.data;
        setAuthToken(token);
        setIsAuthenticated(true);
        setUser(admin);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal login. Periksa koneksi atau kredensial Anda.'
      };
    }
  };

  const logout = async () => {
    try {
      // Attempt to notify backend
      await axios.post(`${API_BASE_URL}/admin/logout`);
    } catch (error) {
      console.error("Logout error (ignoring):", error);
    } finally {
      // Always clear local state
      setAuthToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
