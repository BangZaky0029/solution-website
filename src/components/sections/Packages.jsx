import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import PackageCard from '../cards/PackageCard';
import LoadingSpinner from '../common/LoadingSpinner';

const DURATION_TABS = [
  { label: '1 Bulan', days: 30, discount: null },
  { label: '3 Bulan', days: 90, discount: '20% OFF' },
  { label: '6 Bulan', days: 180, discount: '30% OFF' },
  { label: '1 Tahun', days: 365, discount: '40% OFF' },
];

const Packages = () => {
  const { data: packages, loading, error } = useFetch('/packages');
  const [activeDuration, setActiveDuration] = useState(365);

  const filteredPackages = packages?.filter(
    pkg => pkg.duration_days === activeDuration
  );

  return (
    <section id="pricing" className="pricing-section-refined">
      <div className="container-max">
        <div className="section-header-refined">
          <span className="section-badge">Harga Transparan</span>
          <h2>Pilih Paket Layanan Anda</h2>
          <p>Investasi cerdas untuk produktivitas tanpa batas. Pilih paket yang sesuai dengan skala kebutuhan Anda.</p>
        </div>

        <div className="pricing-tabs-container">
          <div className="pricing-tabs-refined">
            {DURATION_TABS.map(tab => (
              <button
                key={tab.days}
                onClick={() => setActiveDuration(tab.days)}
                className={`tab-btn-refined ${activeDuration === tab.days ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                {tab.discount && <span className="tab-discount-tag">{tab.discount}</span>}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="pricing-status-error">
            <p>Gagal memuat paket layanan. Silakan segarkan halaman.</p>
          </div>
        ) : (
          <div className="packages-grid-refined">
            {filteredPackages?.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name}
                price={pkg.price}
                duration_days={pkg.duration_days}
                description={pkg.description}
                isPopular={pkg.name.toLowerCase().includes('premium')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
