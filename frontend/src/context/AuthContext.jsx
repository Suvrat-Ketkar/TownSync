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
      const response = await axios.get('http://localhost:3500/api/v1/auth/refresh-token', {
        withCredentials: true,
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('No refresh token found — likely a first-time visitor or not logged in.');
      } else {
        console.error('Failed to refresh access token:', error);
      }
      logout(false); // don't trigger server logout on 401
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
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
  };

  const logout = (notifyServer = true) => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  
    if (notifyServer) {
      axios.post('http://localhost:3500/api/v1/user-logout', {}, {
        withCredentials: true,
      }).catch(console.error);
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
