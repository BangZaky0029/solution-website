// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\pages\Auth\GoogleSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Update auth state
      checkAuth();

      showToast('✅ Login Google Berhasil!', 'success');

      // Redirect to profile
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 1000);
    } else {
      showToast('❌ Login Google Gagal: Token tidak ditemukan', 'error');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, showToast, checkAuth]);

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
