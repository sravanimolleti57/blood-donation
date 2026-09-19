import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Helper to extract detailed error messages from Axios exceptions
  const extractErrorMessage = (error, defaultMsg) => {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
      return 'Network Error: Unable to reach BloodConnect backend. Please verify your frontend VITE_API_URL deployment configuration.';
    }
    if (error.response && error.response.status === 404) {
      return '404 Not Found: The API endpoint URL could not be found on the server.';
    }
    if (error.response && error.response.status === 500) {
      return '500 Server Error: Internal error processing request on backend.';
    }
    return error.message || defaultMsg;
  };

  // On initial startup, check token & fetch current user profile from server
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await API.get('/auth/me');
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();

    // Session expired event handler
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      const message = extractErrorMessage(error, 'Invalid email or password');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      const message = extractErrorMessage(error, 'Registration failed. Please check form details.');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user profile in state
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Get fresh profile from server
  const getCurrentUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
  };

  // Admin Login function
  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/admin/login', { email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Admin login failed' };
    } catch (error) {
      const message = extractErrorMessage(error, 'Invalid admin credentials');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
