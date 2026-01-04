// =========================================
// FILE: src/components/common/Header.jsx
// =========================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import "@/styles/Style_forWebsite/Home.css";
import logo from '../../assets/images/NS_blank_02.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <nav className="container-max flex justify-between items-center h-20">
        <Link to="https://nuansasolution.id/" target="_blank">
          <img src={logo} alt="Nuansasolution" className="w-32 mb-1" />
        </Link>

        <div className="hidden md:flex gap-8">
          <Link to="/" className="text-muted hover:text-dark transition">
            Home
          </Link>
          <a href="#features" className="text-muted hover:text-dark transition">
            Features
          </a>
          <a href="#pricing" className="text-muted hover:text-dark transition">
            Pricing
          </a>
          <a href="#faq" className="text-muted hover:text-dark transition">
            FAQ
          </a>
        </div>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm font-medium hover:text-blue-600 transition">
                {user?.name || 'Profile'}
              </Link>
              <button onClick={handleLogout} className="btn btn-primary text-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-max py-4 flex flex-col gap-4">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
