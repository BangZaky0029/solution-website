
import { useState, useEffect, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { featureAccessService } from '../../services/featureAccessService';
import LoadingSpinner from '../common/LoadingSpinner';
import PremiumAccessModal from '../common/PremiumAccessModal';
import { mapFeatureIcon } from '../../utils/mapFeatureIcon';
import { Search, Filter, Grid, LayoutGrid } from 'lucide-react';

const MAIN_SITE_URL = 'https://nuansasolution.id';

const CATEGORIES = [
  { id: 'all', name: 'Semua Fitur', icon: <LayoutGrid size={18} /> },
  { id: 'legal', name: 'Legal & Surat', icon: '📜' },
  { id: 'bisnis', name: 'Bisnis & Invoicing', icon: '💼' },
  { id: 'keuangan', name: 'Keuangan', icon: '💰' },
  { id: 'umum', name: 'Lainnya', icon: '✨' }
];

const Features = () => {
  const { data: features, loading, error } = useFetch('/feature');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featureAccessStatus, setFeatureAccessStatus] = useState({});
  const [accessLoading, setAccessLoading] = useState(true);
  const [userPackageInfo, setUserPackageInfo] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const fetchAccessDetails = async () => {
      if (!isAuthenticated) {
        setAccessLoading(false);
        return;
      }
      try {
        setAccessLoading(true);
        const accessStatus = await featureAccessService.getFeatureAccessStatus();
        setFeatureAccessStatus(accessStatus);
        const accessDetails = await featureAccessService.getFeatureAccessDetails();
        setUserPackageInfo(accessDetails);
      } catch {
        // Silent error handling
      } finally {
        setAccessLoading(false);
      }
    };
    fetchAccessDetails();
  }, [isAuthenticated]);

  // Fungsi untuk menentukan kategori fitur berdasarkan kodenya
  const getCategoryByCode = (code = '') => {
    const c = code.toLowerCase();
    if (c.includes('kuasa') || c.includes('pernyataan') || c.includes('perjanjian') || c.includes('permohonan')) return 'legal';
    if (c.includes('invoice') || c.includes('penawaran') || c.includes('perintah') || c.includes('jalan')) return 'bisnis';
    if (c.includes('calculator') || c.includes('slip-gaji')) return 'keuangan';
    return 'umum';
  };

  // Filter Logic
  const filteredFeatures = useMemo(() => {
    if (!features) return [];
    return features.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || getCategoryByCode(f.code) === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [features, searchQuery, activeCategory]);

  const getFeatureAccessStatus = (featureCode) => {
    if (!isAuthenticated) return 'locked';
    if (accessLoading) return 'loading';
    return featureAccessStatus[featureCode] || 'premium';
  };

  const handleFeatureClick = (feature) => {
    const accessStatus = getFeatureAccessStatus(feature.code);
    if (feature.status === 'free' || accessStatus === 'free') {
      window.location.href = `${MAIN_SITE_URL}${feature.code}/`;
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (accessStatus === 'subscribed') {
      window.location.href = `${MAIN_SITE_URL}${feature.code}/`;
      return;
    }
    setSelectedFeature(feature);
    setShowModal(true);
  };

  const getBadgeInfo = (feature, accessStatus) => {
    if (feature.status === 'free') return { text: 'Gratis', color: 'free' };
    if (accessStatus === 'loading') return { text: 'Mengecek...', color: 'loading' };
    if (accessStatus === 'subscribed') return { text: '✓ Aktif', color: 'subscribed' };
    return { text: 'Premium', color: 'premium' };
  };

  return (
    <section id="features" className="features-section-refined">
      <div className="container-max">
        <div className="features-header-refined">
          <div className="badge-intro">✨ POWERFUL TOOLS</div>
          <h2>Eksplorasi Fitur Unggulan</h2>
          <p>Tingkatkan produktivitas dengan berbagai pilihan tools yang telah kami kurasi khusus untuk Anda.</p>

          {isAuthenticated && userPackageInfo && (
            <div className="user-access-banner animate-fade-in">
              <div className="access-info">
                <span className="access-label">Paket Anda:</span>
                <span className="access-value">{userPackageInfo.package_name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="features-controls">
          <div className="search-box-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Cari fitur (contoh: Surat Kuasa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-refined"
            />
          </div>

          <div className="category-filter-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span className="chip-icon">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading || accessLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="features-status-box error">
            <p>Gagal memuat daftar fitur. Periksa koneksi internet Anda.</p>
          </div>
        ) : filteredFeatures.length > 0 ? (
          <div className="features-grid-refined">
            {filteredFeatures.map((feature) => {
              const accessStatus = getFeatureAccessStatus(feature.code);
              const badgeInfo = getBadgeInfo(feature, accessStatus);

              return (
                <div
                  key={feature.id}
                  className={`feature-card-refined ${badgeInfo.color}`}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div className="card-top">
                    <div className="feature-icon-wrapper">
                      {mapFeatureIcon(feature.code || '')}
                    </div>
                    <span className={`status-badge ${badgeInfo.color}`}>
                      {badgeInfo.text}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="feature-title">{feature.name}</h3>
                    <p className="feature-desc">
                      {feature.description || 'Optimalkan pekerjaan Anda dengan fitur efisien ini.'}
                    </p>
                  </div>

                  <div className="card-footer">
                    <span className="action-text">
                      {accessStatus === 'locked' ? 'Buka Kunci Fitur' : 'Gunakan Sekarang'}
                    </span>
                    <div className="arrow-circle">
                      {accessStatus === 'locked' ? '🔒' : '→'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="features-status-box empty">
            <div className="empty-icon">🔍</div>
            <p>Fitur "{searchQuery}" tidak ditemukan dalam kategori ini.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn-reset">
              Lihat Semua Fitur
            </button>
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
