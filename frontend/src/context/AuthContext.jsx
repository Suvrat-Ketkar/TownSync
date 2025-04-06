import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Invalid user JSON in localStorage:", storedUser);
      console.error(e);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.get('/api/v1/auth/refresh-token', {
        withCredentials: true, // include cookies in request
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout(); // clear all on failure
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken(); // try to silently log in
      } catch (err) {
        console.error('Silent login failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', tokens.accessToken);
    // no need to store refreshToken
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    // optional: logout request to server
    axios.get('/api/v1/auth/logout', { withCredentials: true }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
