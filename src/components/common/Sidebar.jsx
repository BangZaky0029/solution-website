// =========================================
// FILE: Sidebar.jsx - FIXED VERSION
// =========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, showLandingMenu }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleConfirmLogout = () => {
    console.log('========================================');
    console.log('🚪 LOGOUT - Sidebar Process Started');
    console.log('========================================');

    setIsLoggingOut(true);

    try {
      // Call logout
      logout();

      console.log('✅ Logout successful from sidebar');

      // Close modal and sidebar
      setShowLogoutModal(false);
      onClose();

      // Show toast - FORMAT YANG BENAR
      showToast('✅ Logout berhasil!', 'success');

      // Navigate to login
      setTimeout(() => {
        console.log('➡️ Navigating to /login from sidebar');
        navigate('/login', { replace: true });
        setIsLoggingOut(false);
      }, 500);

    } catch (error) {
      console.error('❌ Logout error from sidebar:', error);
      showToast('Terjadi kesalahan saat logout', 'error');
      setIsLoggingOut(false);
    }

    console.log('========================================');
    console.log('🏁 LOGOUT - Sidebar Process Completed');
    console.log('========================================');
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          {/* USER */}
          {isAuthenticated ? (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">{user?.name}</p>
                <p className="sidebar-user-email">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="sidebar-auth">
              <button
                className="btn btn-primary sidebar-auth-btn"
                onClick={() => handleNavClick('/login')}
              >
                Login
              </button>
              <button
                className="btn btn-outline sidebar-auth-btn"
                onClick={() => handleNavClick('/register')}
              >
                Register
              </button>
            </div>
          )}

          {/* MAIN MENU */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Main Menu</h4>

            <button
              className="sidebar-nav-item"
              onClick={() => handleNavClick('/')}
            >
              🏠 Home
            </button>

            {showLandingMenu && (
              <>
                <a href="#features" className="sidebar-nav-item" onClick={onClose}>
                  ✨ Features
                </a>
                <a href="#pricing" className="sidebar-nav-item" onClick={onClose}>
                  💰 Pricing
                </a>
                <a href="#faq" className="sidebar-nav-item" onClick={onClose}>
                  ❓ FAQ
                </a>
              </>
            )}
          </div>

          {/* INFO */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Information</h4>

            <button className="sidebar-nav-item" onClick={() => handleNavClick('/about')}>
              ℹ️ About
            </button>
            <button className="sidebar-nav-item" onClick={() => handleNavClick('/blog')}>
              📝 Blog
            </button>
            <button className="sidebar-nav-item" onClick={() => handleNavClick('/contact')}>
              📧 Contact
            </button>
          </div>

          {/* LEGAL */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">Legal</h4>

            <button className="sidebar-nav-item" onClick={() => handleNavClick('/privacy')}>
              🔒 Privacy
            </button>
            <button className="sidebar-nav-item" onClick={() => handleNavClick('/terms')}>
              📜 Terms
            </button>
            <button className="sidebar-nav-item" onClick={() => handleNavClick('/security')}>
              🛡️ Security
            </button>
          </div>

          {/* USER ACTION */}
          {isAuthenticated && (
            <div className="sidebar-section">
              <button
                className="sidebar-nav-item"
                onClick={() => handleNavClick('/profile')}
              >
                👤 Profile
              </button>

              <button
                className="sidebar-nav-item sidebar-logout"
                onClick={() => setShowLogoutModal(true)}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '⏳ Logging out...' : '🚪 Logout'}
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <p>© 2022 nuansasolution.id. | All rights reserved.</p>
          <p>v1.0.0</p>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      <ConfirmLogoutModal
        open={showLogoutModal}
        onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Sidebar;