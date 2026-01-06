// =========================================
// FILE: src/components/sections/Features.jsx - UPDATED
// Features Section with Correct Access Logic
// =========================================

import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { featureAccessService } from '../../services/featureAccessService';
import LoadingSpinner from '../common/LoadingSpinner';
import PremiumAccessModal from '../common/PremiumAccessModal';

const MAIN_SITE_URL = 'https://nuansasolution.id';

const Features = () => {
  const { data: features, loading, error } = useFetch('/feature');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State untuk manage feature access
  const [featureAccessStatus, setFeatureAccessStatus] = useState({});
  const [accessLoading, setAccessLoading] = useState(true);
  const [userPackageInfo, setUserPackageInfo] = useState(null);

    // ✅ MODAL STATE (HARUS DI SINI)
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);


  // ========================================
  // FETCH FEATURE ACCESS DETAILS
  // ========================================
  useEffect(() => {
    const fetchAccessDetails = async () => {
      if (!isAuthenticated) {
        setAccessLoading(false);
        return;
      }

      try {
        setAccessLoading(true);

        // 1. Get feature access status
        const accessStatus = await featureAccessService.getFeatureAccessStatus();
        setFeatureAccessStatus(accessStatus);

        // 2. Get package info
        const accessDetails = await featureAccessService.getFeatureAccessDetails();
        setUserPackageInfo(accessDetails);

        console.log('Feature Access Status:', accessStatus);
        console.log('User Package Info:', accessDetails);
      } catch (err) {
        console.error('Error fetching access details:', err);
      } finally {
        setAccessLoading(false);
      }
    };

    fetchAccessDetails();
  }, [isAuthenticated]);

  // ========================================
  // GET FEATURE STATUS
  // ========================================
  const getFeatureAccessStatus = (featureCode) => {
    // Jika belum login
    if (!isAuthenticated) {
      return 'locked'; // Premium tidak bisa akses
    }

    // Jika sedang loading access details
    if (accessLoading) {
      return 'loading';
    }

    // Cek di access status
    const status = featureAccessStatus[featureCode];

    // Return status dari server
    // Possible values: 'free', 'subscribed', 'premium'
    return status || 'premium';
  };

  // ========================================
  // HANDLE FEATURE CLICK
  // ========================================
  const handleFeatureClick = async (feature) => {
  const accessStatus = getFeatureAccessStatus(feature.code);

  // FREE
  if (feature.status === 'free' || accessStatus === 'free') {
    window.location.href = `${MAIN_SITE_URL}${feature.code}/`;
    return;
  }

  // BELUM LOGIN
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  // SUBSCRIBED
  if (accessStatus === 'subscribed') {
    window.location.href = `${MAIN_SITE_URL}${feature.code}/`;
    return;
  }

  // PREMIUM → TAMPILKAN MODAL
  setSelectedFeature(feature);
  setShowModal(true);
};


  // ========================================
  // GET FEATURE ICON
  // ========================================
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

  // ========================================
  // GET BADGE INFO
  // ========================================
  const getBadgeInfo = (feature, accessStatus) => {
    if (feature.status === 'free') {
      return { text: 'Gratis', color: 'free' };
    }

    if (accessStatus === 'loading') {
      return { text: 'Mengecek...', color: 'loading' };
    }

    if (accessStatus === 'subscribed') {
      return { text: '✓ Berlangganan', color: 'subscribed' };
    }

    if (accessStatus === 'locked' || accessStatus === 'premium') {
      return { text: 'Premium', color: 'premium' };
    }

    return { text: 'Premium', color: 'premium' };
  };

  return (
    <section id="features" className="features-section">
      <div className="container-max">
        {/* ===== HEADER ===== */}
        <div className="features-header">
          <h2>Fitur-Fitur Unggulan</h2>
          <p>Akses berbagai tools untuk meningkatkan produktivitas Anda</p>

          {/* Package Info Badge */}
          {isAuthenticated && userPackageInfo && (
            <div className="package-info-badge animate-fade-in">
              <span className="badge-icon">📦</span>
              <div className="badge-content">
                <span className="badge-label">Paket Aktif:</span>
                <span className="badge-package">{userPackageInfo.package_name}</span>
              </div>
              {userPackageInfo.expired_at && (
                <span className="badge-expiry">
                  Berakhir: {new Date(userPackageInfo.expired_at).toLocaleDateString('id-ID')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        {loading || accessLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="features-error animate-slide-up">
            <p>❌ Gagal memuat fitur. Silakan coba lagi.</p>
          </div>
        ) : features && features.length > 0 ? (
          <div className="features-grid-modern">
            {features.map((feature) => {
              const accessStatus = getFeatureAccessStatus(feature.code);
              const badgeInfo = getBadgeInfo(feature, accessStatus);

              return (
                <div
                  key={feature.id}
                  className="feature-card-modern"
                  onClick={() => handleFeatureClick(feature)}
                >
                  {/* Icon */}
                  <div className="feature-card-icon">
                    {getFeatureIcon(feature.name)}
                  </div>

                  {/* Content */}
                  <div className="feature-card-content">
                    <h3 className="feature-card-title">{feature.name}</h3>

                    {/* Badge */}
                    <div className="feature-card-badges">
                      <span className={`feature-badge ${badgeInfo.color}`}>
                        {badgeInfo.text}
                      </span>

                      {/* Premium badge dengan lock icon */}
                      {(badgeInfo.color === 'premium' || badgeInfo.color === 'locked') && !isAuthenticated && (
                        <span className="badge-lock-hint">🔒 Login diperlukan</span>
                      )}
                    </div>

                    {/* Description */}
                    {feature.description && (
                      <p className="feature-description">{feature.description}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="feature-card-arrow">
                    {accessStatus === 'locked' ? '🔒' : '→'}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="features-empty animate-slide-up">
            <p>📭 Tidak ada fitur yang tersedia saat ini</p>
          </div>
        )}
      </div>
      <PremiumAccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpgrade={() => navigate('/payment')}
          featureName={selectedFeature?.name}
          packageName={userPackageInfo?.package_name}
        />
    </section>
  );
};

export default Features;