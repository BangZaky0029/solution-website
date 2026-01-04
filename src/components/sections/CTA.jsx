// =========================================
// FILE: src/components/sections/CTA.jsx
// =========================================

import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container-max text-center animate-fade-in">
        <h2 className="text-white mb-6">Siap Bergabung?</h2>
        <p className="text-white text-lg max-w-2xl mx-auto mb-8">
          Dapatkan akses penuh ke semua fitur dan tools kami. Mulai perjalanan Anda hari ini.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register">
            <Button variant="primary" size="lg" className="bg-white text-white hover:bg-gray-100">
              Daftar Gratis
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="secondary" size="lg" className="bg-white text-white hover:bg-gray-100">
              Lihat Paket
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;