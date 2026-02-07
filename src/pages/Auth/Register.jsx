// Register Page - Clean production version

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
    // Redirect if already logged in
    if (!loading && user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/profile', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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