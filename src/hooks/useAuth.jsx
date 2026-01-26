// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\hooks\useAuth.js
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
          console.log('✅ User authenticated:', response.user);
        } catch (error) {
          console.error('❌ Auth check failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (name, email, phone, password) => {
    try {
      console.log('📝 Registering user:', { name, email, phone });
      const response = await authController.register(name, email, phone, password);
      console.log('✅ Register response:', response);
      return response; // Contains otp, otpExpiry, otpDuration
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      console.log('🔐 Verifying OTP for:', email);
      const response = await authController.verifyOTP(email, otp);
      console.log('✅ OTP verified:', response);
      return response;
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error;
    }
  };

  const resendOTP = async (email) => {
    try {
      console.log('🔄 Resending OTP for:', email);
      const response = await authController.resendOTP(email);
      console.log('✅ OTP resent:', response);
      return response; // Contains new otp, otpExpiry, otpDuration
    } catch (error) {
      console.error('❌ Resend OTP failed:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Logging in:', email);
      const response = await authController.login(email, password);
      
      console.log('✅ Login response:', response);
      
      // 🔥 CRITICAL: Set user state
      if (response.user) {
        setUser(response.user);
        console.log('✅ User state updated:', response.user);
      }
      
      // Token sudah disimpan di authController.login()
      console.log('✅ Token saved to localStorage');
      
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    
    // Clear token
    authController.logout();
    
    // Clear user state
    setUser(null);
    
    // Clear any other stored data
    localStorage.removeItem('rememberMe');
    
    console.log('✅ User logged out');
    console.log('✅ Token removed from localStorage');
    console.log('✅ User state cleared');
  };

  const isAuthenticated = () => {
    const hasToken = authController.isAuthenticated();
    console.log('🔍 Is authenticated:', hasToken);
    return hasToken;
  };

  const getCurrentUser = async () => {
    try {
      const response = await authController.me();
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('❌ Get current user failed:', error);
      throw error;
    }
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