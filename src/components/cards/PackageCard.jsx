// =========================================
// FILE: src/components/cards/PackageCard.jsx
// FIXED VERSION (JSON DESCRIPTION PROPER)
// =========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import api from '../../services/api';

const PackageCard = ({
  id,
  name,
  price,
  duration_days,
  description,
  isPopular = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ==============================
  // HANDLE PILIH PAKET
  // ==============================
  const handleSelectPackage = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // Langsung arahkan ke payment tanpa cek token aktif
      navigate(`/payment?packageId=${id}`);
    } catch (error) {
      console.error('Error selecting package:', error);
      navigate(`/payment?packageId=${id}`);
    } finally {
      setIsLoading(false);
    }
  };


  // ==============================
  // PARSE DESCRIPTION JSON
  // ==============================
  const descriptionList =
    typeof description === 'string'
      ? JSON.parse(description || '[]')
      : description;

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden animate-slide-up transition
        ${
          isPopular
            ? 'border-2 border-blue-500 shadow-xl transform scale-105'
            : 'border border-gray-200 hover:shadow-lg'
        }
      `}
    >
      {isPopular && (
        <div className="bg-gradient-primary text-white text-center py-2 font-semibold text-sm">
          ⭐ PALING POPULER
        </div>
      )}

      <div className="p-8">
        {/* ============================= */}
        {/* TITLE */}
        {/* ============================= */}
        <h3 className="text-2xl font-bold text-dark mb-6">{name}</h3>

        {/* ============================= */}
        {/* PRICE */}
        {/* ============================= */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-primary">
              {formatCurrency(price)}
            </span>
            <span className="text-muted text-sm">
              / {duration_days} hari
            </span>
          </div>
        </div>

        {/* ============================= */}
        {/* BUTTON */}
        {/* ============================= */}
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          size="lg"
          className="w-full mb-8"
          onClick={handleSelectPackage}
          loading={isLoading}
        >
          Pilih Paket
        </Button>

        {/* ============================= */}
        {/* BENEFITS */}
        {/* ============================= */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Termasuk:
          </p>

          {descriptionList && descriptionList.length > 0 ? (
            <ul className="space-y-3">
              {descriptionList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-muted text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-muted text-sm">
                  Akses penuh ke semua tools
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-muted text-sm">
                  Support 24/7
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-muted text-sm">
                  Unlimited Usage
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
