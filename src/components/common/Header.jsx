// Header component - Clean production version

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
    setIsLoggingOut(true);

    try {
      logout();
      setShowLogoutConfirm(false);
      showToast('✅ Logout berhasil!', 'success');

      setTimeout(() => {
        navigate('/login', { replace: true });
        setIsLoggingOut(false);
      }, 500);

    } catch {
      showToast('Terjadi kesalahan saat logout', 'error');
      setIsLoggingOut(false);
    }
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

            <Link to="/features" className="header-nav-link">Features</Link>
            <Link to="/pricing" className="header-nav-link">Pricing</Link>

            <Link to="/faq" className="header-nav-link">FAQ</Link>
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