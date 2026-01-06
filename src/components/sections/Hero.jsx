// =========================================
// FILE: src/components/sections/Hero.jsx
// =========================================

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import logo from '../../assets/images/nuansaLogo.png';

const Hero = () => {
  const { isAuthenticated } = useAuth();  

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text animate-fade-in">
          <h1>Platform Pembayaran Terpadu untuk Tools Modern</h1>
          <p>Kelola akses tools dan features Anda dengan mudah. Sistem berlangganan yang fleksibel dan terpercaya.</p>
          
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <a href="#pricing">
                  <Button variant="primary" size="lg">
                    Upgrade Sekarang →
                  </Button>
                </a>
                <Link to="/profile">
                  <Button variant="outline" size="lg">
                    Lihat Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Mulai Gratis →
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center animate-slide-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-8 w-580 h-580 flex items-center justify-center text-white text-6xl">
              <img src={logo} alt="Nuansasolution" className="w-712 mb-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

