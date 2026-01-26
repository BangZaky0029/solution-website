// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\components\common\Header.jsx
// Fixed - Better logout flow

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Sidebar from './Sidebar';
import logo from '../../assets/images/NS_blank_02.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const confirmLogout = () => {
    console.log('========================================');
    console.log('🚪 LOGOUT - Process started');
    console.log('========================================');

    setIsLoggingOut(true);
    
    try {
      // Call logout
      logout();
      
      console.log('✅ Logout successful');
      
      // Close modal
      setShowLogoutConfirm(false);
      
      // Show toast
      showToast('✅ Logout berhasil!', 'success');
      
      // Navigate to login after a short delay
      setTimeout(() => {
        console.log('➡️ Navigating to /login');
        navigate('/login', { replace: true });
        setIsLoggingOut(false);
      }, 500);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      showToast('Terjadi kesalahan saat logout', 'error');
      setIsLoggingOut(false);
    }

    console.log('========================================');
    console.log('🏁 LOGOUT - Process completed');
    console.log('========================================');
  };

  return (
    <>
      <header className="header-modern">
        <nav className="header-container">
          {/* LOGO */}
          <Link to="/" className="header-logo">
            <img src={logo} alt="Nuansa Solution" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="header-nav-desktop">
            <Link to="/" className="header-nav-link">Home</Link>

            {isHomePage && (
              <>
                <a href="#features" className="header-nav-link">Features</a>
                <a href="#pricing" className="header-nav-link">Pricing</a>
                <a href="#faq" className="header-nav-link">FAQ</a>
              </>
            )}
          </div>

          {/* AUTH */}
          <div className="header-auth-desktop">
            {isAuthenticated() ? (
              <div className="header-user-menu">
                <Link to="/profile" className="header-user-link">
                  <div className="header-user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="header-user-name">
                    {user?.name || 'User'}
                  </span>
                </Link>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowLogoutConfirm(true)}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Loading...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="header-hamburger"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        showLandingMenu={isHomePage}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin keluar?</p>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Memproses...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;