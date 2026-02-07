
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import { Check } from 'lucide-react';

const DISCOUNT_BY_DAYS = {
  30: 0,
  90: 0.2,
  180: 0.3,
  365: 0.4,
};

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

  const handleSelectPackage = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      navigate(`/payment?packageId=${id}`);
    } catch {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const descriptionList = useMemo(() => {
    if (Array.isArray(description)) return description;
    if (typeof description === 'string') {
      try {
        const parsed = JSON.parse(description || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [description]);

  const discountRate = DISCOUNT_BY_DAYS[duration_days] ?? 0;
  const finalPrice = Number(price) || 0;
  const originalPrice = discountRate ? Math.round(finalPrice / (1 - discountRate)) : finalPrice;
  const hasDiscount = discountRate > 0;

  return (
    <div className={`pkg-card-refined ${isPopular ? 'popular' : ''} animate-slide-up`}>
      {isPopular && (
        <div className="popular-badge-refined">
          <span>Paling Populer</span>
        </div>
      )}

      <div className="pkg-header">
        <h3 className="pkg-name">{name}</h3>
        {hasDiscount && (
          <span className="pkg-discount-badge">{Math.round(discountRate * 100)}% Hemat</span>
        )}
      </div>

      <div className="pkg-price-box">
        {hasDiscount && (
          <span className="pkg-price-old">{formatCurrency(originalPrice)}</span>
        )}
        <div className="pkg-price-main">
          <span className="price-val">{formatCurrency(finalPrice)}</span>
          <span className="price-dur">/ {duration_days} hari</span>
        </div>
      </div>

      <div className="pkg-divider"></div>

      <div className="pkg-features">
        <p className="features-label">Fitur & Manfaat:</p>
        <ul className="features-list-refined">
          {descriptionList.length > 0 ? (
            descriptionList.map((item, index) => (
              <li key={index}>
                <div className="check-icon-box">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li><div className="check-icon-box"><Check size={14} strokeWidth={3} /></div><span>Akses penuh ke semua fitur</span></li>
          )}
        </ul>
      </div>

      <div className="pkg-action">
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          className="w-full pkg-btn"
          onClick={handleSelectPackage}
          loading={isLoading}
        >
          Pilih Paket
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
