// =========================================
// FILE: src/hooks/useAuth.jsx - FIXED
// =========================================

import { useState, useEffect, useContext, createContext } from 'react';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      if (!authController.isAuthenticated()) {
        setLoading(false);
        return;
      }

      // ✅ FIXED: userController.getProfile sudah handle response structure
      const userData = await userController.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      authController.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authController.login(email, password);
      // ✅ FIXED: getProfile sudah handle response structure
      const userData = await userController.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    return authController.register(name, email, phone, password);
  };

  const logout = () => {
    authController.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};