// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\pages\Auth\Register.jsx
// Fixed - No infinite redirect loop

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/forms/RegisterForm';
import '../../styles/Style_forWebsite/Auth.css';

const Register = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log('🔍 Register Page - Auth Check:');
    console.log('   Loading:', loading);
    console.log('   User:', user);
    console.log('   Has Redirected:', hasRedirected.current);

    // Only redirect if:
    // 1. Not loading
    // 2. User exists
    // 3. Haven't redirected yet
    if (!loading && user && !hasRedirected.current) {
      console.log('✅ User already logged in, redirecting to profile...');
      hasRedirected.current = true;
      navigate('/profile', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Buat Akun Baru</h2>
          <p className="text-muted">Daftar untuk mendapatkan akses ke semua fitur</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;