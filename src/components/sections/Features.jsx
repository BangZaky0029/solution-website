// =========================================
// FILE: src/components/sections/Features.jsx - UPDATED
// =========================================

import { useFetch } from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const Features = () => {
  const { data: features, loading, error } = useFetch('/feature');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = async (feature) => {
    // Jika fitur free, langsung redirect
    if (feature.status === 'free') {
      window.location.href = feature.code;
      return;
    }

    // Jika premium, cek auth
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cek subscription
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/link/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ path: feature.code })
      });

      const result = await response.json();

      if (result.success && result.allowed) {
        window.location.href = feature.code;
      } else {
        alert(result.message || 'Anda belum berlangganan untuk fitur ini. Silakan upgrade paket Anda.');
        navigate('/payment');
      }
    } catch (err) {
      console.error('Error checking access:', err);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const getFeatureIcon = (name) => {
    const icons = {
      'Generator Surat Kuasa': '📄',
      'Kalkulator PPh': '🧮',
      'Kalkulator Pajak Properti': '🏠',
      'Surat Pernyataan': '📝',
      'Surat Permohonan': '✉️',
      'Surat Perintah Kerja': '🛠️',
      'Surat Jalan': '🚚',
      'Invoice': '🧾'
    };
    return icons[name] || '📋';
  };

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in">
          <h2>Fitur-Fitur Unggulan</h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            Akses berbagai tools untuk meningkatkan produktivitas Anda
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Gagal memuat fitur. Silakan coba lagi.</p>
          </div>
        ) : features && features.length > 0 ? (
          <div className="features-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-grid-button"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="feature-content">
                  <div className="feature-icon">{getFeatureIcon(feature.name)}</div>
                  <h3 className="feature-name">{feature.name}</h3>
                  <span className={`feature-status ${feature.status}`}>
                    {feature.status === 'free' ? 'Gratis' : 'Premium'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>Tidak ada fitur yang tersedia saat ini</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;