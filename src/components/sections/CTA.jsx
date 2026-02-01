
// =========================================
// FILE: src/components/sections/CTA.jsx - REFINED
// =========================================

import { Link } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/components/CTA.css'; // Import style terpisah

const CTA = () => {
  return (
    <section className="cta-section-refined">
      <div className="container-max">
        <div className="cta-glass-card animate-fade-in">
          <div className="cta-content">
            <h2 className="cta-title">Siap Bergabung dengan Masa Depan?</h2>
            <p className="cta-description">
              Dapatkan akses penuh ke semua fitur dan tools produktivitas kami. 
              Mulai perjalanan efisiensi bisnis Anda bersama <strong>Gateway SOLUTION</strong> hari ini.
            </p>

            <div className="cta-actions">
              <Link to="/register">
                <Button variant="primary" size="lg" className="cta-btn-main">
                  Daftar Gratis Sekarang
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" size="lg" className="cta-btn-alt">
                  Lihat Paket Layanan
                </Button>
              </a>
            </div>
          </div>
          
          <div className="cta-decoration">
            <div className="blob b1"></div>
            <div className="blob b2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
