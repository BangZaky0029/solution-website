// =========================================
// FILE: src/components/sections/Packages.jsx
// =========================================

import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import PackageCard from '../cards/PackageCard';
import LoadingSpinner from '../common/LoadingSpinner';

const DURATION_TABS = [
  { label: '1 Bulan', days: 30, discountRate: 0 },
  { label: '3 Bulan', days: 90, discountRate: 0.2, badge: '20% OFF' },
  { label: '6 Bulan', days: 180, discountRate: 0.3, badge: '30% OFF' },
  { label: '1 Tahun', days: 365, discountRate: 0.4, badge: '40% OFF' },
];

const Packages = () => {
  const { data: packages, loading, error } = useFetch('/packages');
  const [activeDuration, setActiveDuration] = useState(365);

  const filteredPackages = packages?.filter(
    pkg => pkg.duration_days === activeDuration
  );

  return (
    <section id="pricing" className="packages-section py-24">
      <div className="container-max">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Pilih Paket Layanan Anda</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Dapatkan akses ke berbagai dokumen legal dan layanan konsultasi
            sesuai kebutuhan Anda
          </p>
        </div>

        {/* ================= DURATION TABS ================= */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {DURATION_TABS.map(tab => {
            const isActive = activeDuration === tab.days;

            return (
              <button
                key={tab.days}
                onClick={() => setActiveDuration(tab.days)}
                className={`
                  relative px-6 py-3 rounded-full font-semibold text-sm transition-all
                  ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {tab.label}

                {tab.badge && (
                  <span
                    className={`
                      ml-2 px-3 py-1 rounded-full text-xs font-bold
                      ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-green-100 text-green-600'
                      }
                    `}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Gagal memuat paket. Silakan coba lagi.</p>
          </div>
        ) : filteredPackages && filteredPackages.length > 0 ? (
          <div className="packages-grid">
            {filteredPackages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name}
                price={pkg.price}
                duration_days={pkg.duration_days}
                description={pkg.description}
                isPopular={index === 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>Paket tidak tersedia untuk durasi ini</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
