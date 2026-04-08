// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\pages\Auth\GoogleSuccess.jsx
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Pastikan hanya diproses 1 kali
    if (hasProcessed.current) return;

    const token = searchParams.get('token');

    if (token) {
      hasProcessed.current = true;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Update auth state
      getCurrentUser();

      showToast('✅ Login Google Berhasil!', 'success');

      // Redirect to profile
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 800);
    } else if (searchParams.has('error')) {
      hasProcessed.current = true;
      showToast('❌ Login Google Gagal', 'error');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, showToast, getCurrentUser]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <h3>Memproses Login Google...</h3>
          <p>Mohon tunggu sebentar, Anda akan segera dialihkan.</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSuccess;
