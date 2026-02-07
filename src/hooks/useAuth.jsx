// Custom hook untuk authentication dengan proper token handling

import { createContext, useContext, useState, useEffect } from 'react';
import { authController } from '../controllers/authController';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await authController.me();
          setUser(response.user);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (name, email, phone, password) => {
    const response = await authController.register(name, email, phone, password);
    return response;
  };

  const verifyOTP = async (email, otp) => {
    const response = await authController.verifyOTP(email, otp);
    return response;
  };

  const resendOTP = async (email) => {
    const response = await authController.resendOTP(email);
    return response;
  };

  const login = async (email, password) => {
    const response = await authController.login(email, password);

    if (response.user) {
      setUser(response.user);
    }

    return response;
  };

  const logout = () => {
    authController.logout();
    setUser(null);
    localStorage.removeItem('rememberMe');
  };

  const isAuthenticated = () => {
    return authController.isAuthenticated();
  };

  const getCurrentUser = async () => {
    const response = await authController.me();
    setUser(response.user);
    return response.user;
  };

  const value = {
    user,
    loading,
    register,
    verifyOTP,
    resendOTP,
    login,
    logout,
    isAuthenticated,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};