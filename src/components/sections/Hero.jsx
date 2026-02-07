
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import logo from '../../assets/images/nuansaLogo.png';
import { ChevronRight, Zap, Shield, CheckCircle } from 'lucide-react';

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero-section-modern">
      <div className="container-max">
        <div className="hero-grid">
          <div className="hero-content-modern animate-slide-up">
            <div className="hero-announcement">
              <span className="ann-badge">New</span>
              <span className="ann-text">Bonus Trial 3 Hari untuk Pengguna Baru! 🎁</span>
            </div>

            <h1>Platform Digital <span className="text-gradient">SOLUTION</span> Untuk Masa Depan.</h1>
            <p>Satu akun untuk semua kebutuhan tools produktivitas Anda. Kelola surat, invoicing, dan berbagai dokumen bisnis dalam satu platform terpadu yang aman dan efisien.</p>

            <div className="hero-actions-refined">
              {isAuthenticated ? (
                <>
                  <Link to="/features">
                    <button className="btn-hero-primary">
                      Akses Features <ChevronRight size={18} />
                    </button>
                  </Link>
                  <a href="#features" className="btn-hero-outline">
                    Telusuri Fitur
                  </a>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <button className="btn-hero-primary">
                      Mulai Sekarang <Zap size={18} fill="currentColor" />
                    </button>
                  </Link>
                  <Link to="/login" className="btn-hero-outline">
                    Masuk Akun
                  </Link>
                </>
              )}
            </div>

            <div className="hero-trust-badges">
              <div className="trust-item">
                <Shield size={16} className="text-blue-500" />
                <span>Secure Payment</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={16} className="text-blue-500" />
                <span>Verified Tools</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-refined animate-fade-in">
            <div className="visual-container">
              <div className="floating-card c1">
                <Zap size={24} color="#3b82f6" />
                <span>Fast Access</span>
              </div>
              <div className="floating-card c2">
                <Shield size={24} color="#10b981" />
                <span>Verified</span>
              </div>
              <img src={logo} alt="Nuansa Solution" className="hero-main-logo" />
              <div className="glow-effect"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
