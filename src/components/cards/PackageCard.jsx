// =========================================
// FILE: src/components/cards/PackageCard.jsx
// =========================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';

const DISCOUNT_BY_DAYS = {
  30: 0,
  90: 0.2,
  180: 0.3,
  365: 0.4,
};

const PackageCard = ({
  id,
  name,
  price, // diasumsikan: harga FINAL dari API untuk durasi tsb
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
      navigate(`/payment?packageId=${id}`);
    } catch (error) {
      console.error('Error selecting package:', error);
      navigate(`/payment?packageId=${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================
  // PARSE DESCRIPTION JSON (AMAN)
  // ==============================
  const descriptionList = useMemo(() => {
    if (Array.isArray(description)) return description;

    if (typeof description === 'string') {
      try {
        const parsed = JSON.parse(description || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing description:', error);
        return [];
      }
    }

    return [];
  }, [description]);

  // ==============================
  // PRICE LOGIC: original (coret) + final (diskon)
  // ==============================
  const discountRate = DISCOUNT_BY_DAYS[duration_days] ?? 0;

  const finalPrice = Number(price) || 0;

  const originalPrice = useMemo(() => {
    if (!discountRate) return finalPrice;

    // original = final / (1 - discount)
    const denom = 1 - discountRate;
    if (denom <= 0) return finalPrice;

    // pembulatan biar rapi
    return Math.round(finalPrice / denom);
  }, [finalPrice, discountRate]);

  const showDiscount = discountRate > 0 && originalPrice > finalPrice;

  const discountLabel = `${Math.round(discountRate * 100)}% OFF`;

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
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-2xl font-bold text-dark">{name}</h3>

          {showDiscount && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600 whitespace-nowrap">
              {discountLabel}
            </span>
          )}
        </div>

        {/* ============================= */}
        {/* PRICE */}
        {/* ============================= */}
        <div className="mb-6">
          {showDiscount && (
            <div className="text-sm text-gray-400 line-through mb-1">
              {formatCurrency(originalPrice)}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-primary">
              {formatCurrency(finalPrice)}
            </span>
            <span className="text-muted text-sm">/ {duration_days} hari</span>
          </div>

          {showDiscount && (
            <div className="text-xs text-gray-500 mt-2">
              Hemat {formatCurrency(originalPrice - finalPrice)}
            </div>
          )}
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
                <span className="text-muted text-sm">Support 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-muted text-sm">Unlimited Usage</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
