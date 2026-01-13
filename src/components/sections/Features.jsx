// =========================================
// FILE: src/components/sections/Features.jsx - FIXED
// =========================================

import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { featureAccessService } from '../../services/featureAccessService';
import LoadingSpinner from '../common/LoadingSpinner';
import PremiumAccessModal from '../common/PremiumAccessModal';
import { mapFeatureIcon } from '../../utils/mapFeatureIcon';


const MAIN_SITE_URL = 'https://nuansasolution.id';

const Features = () => {
  const { data: features, loading, error } = useFetch('/feature');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  

  // State untuk manage feature access
  const [featureAccessStatus, setFeatureAccessStatus] = useState({});
  const [accessLoading, setAccessLoading] = useState(true);
  const [userPackageInfo, setUserPackageInfo] = useState(null);

  // Modal state
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
    if (!isAuthenticated) return 'locked';
    if (accessLoading) return 'loading';

    // Ambil status dari API
    return featureAccessStatus[featureCode] || 'premium';
  };

  // ========================================
  // HANDLE FEATURE CLICK
  // ========================================
  const handleFeatureClick = (feature) => {
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
  // GET BADGE INFO
  // ========================================
  const getBadgeInfo = (feature, accessStatus) => {
    if (feature.status === 'free') return { text: 'Gratis', color: 'free' };
    if (accessStatus === 'loading') return { text: 'Mengecek...', color: 'loading' };
    if (accessStatus === 'subscribed') return { text: '✓ Berlangganan', color: 'subscribed' };
    return { text: 'Premium', color: 'premium' };
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <section id="features" className="features-section">
      <div className="container-max">
        {/* HEADER */}
        <div className="features-header">
          <h2>Fitur-Fitur Unggulan</h2>
          <p>Akses berbagai tools untuk meningkatkan produktivitas Anda</p>

          {/* PACKAGE INFO */}
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

        {/* CONTENT */}
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
                  <div className="feature-card-icon">{mapFeatureIcon(feature.code || '')}</div>

                  <div className="feature-card-content">
                    <h3 className="feature-card-title">{feature.name}</h3>

                    <div className="feature-card-badges">
                      <span className={`feature-badge ${badgeInfo.color}`}>{badgeInfo.text}</span>
                      {(badgeInfo.color === 'premium' && !isAuthenticated) && (
                        <span className="badge-lock-hint">🔒 Login diperlukan</span>
                      )}
                    </div>

                    {feature.description && (
                      <p className="feature-description">{feature.description}</p>
                    )}
                  </div>

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

      {/* PREMIUM MODAL */}
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
