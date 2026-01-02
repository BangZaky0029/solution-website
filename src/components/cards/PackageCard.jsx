// =========================================
// FILE: src/components/cards/PackageCard.jsx - UPDATED
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
  features = [],
  isPopular = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPackage = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      // Cek apakah user sudah punya paket aktif
      const response = await api.get('/users/tokens');
      
      if (response.data && response.data.length > 0) {
        const activeToken = response.data.find(token => {
          const expiredDate = new Date(token.expired_at);
          return expiredDate > new Date();
        });

        if (activeToken) {
          alert('Paket anda sudah aktif. Silahkan hubungi admin jika ingin mengubah paket.');
          setIsLoading(false);
          return;
        }
      }

      // Jika tidak ada paket aktif, lanjut ke payment
      navigate(`/payment?packageId=${id}`);
    } catch (error) {
      console.error('Error checking package:', error);
      // Jika error (misalnya belum pernah beli), lanjut ke payment
      navigate(`/payment?packageId=${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse features jika masih string
  const featureList = typeof features === 'string' 
    ? JSON.parse(features || '[]') 
    : features;

  return (
    <div className={`
      bg-white rounded-lg overflow-hidden animate-slide-up transition
      ${isPopular ? 'border-2 border-blue-500 shadow-xl transform scale-105' : 'border border-gray-200 hover:shadow-lg'}
    `}>
      {isPopular && (
        <div className="bg-gradient-primary text-white text-center py-2 font-semibold text-sm">
          ⭐ PALING POPULER
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-dark mb-2">{name}</h3>
        
        <p className="text-muted text-sm mb-6">{description}</p>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-primary">{formatCurrency(price)}</span>
            <span className="text-muted text-sm">/ {duration_days} hari</span>
          </div>
        </div>

        <Button
          variant={isPopular ? 'primary' : 'outline'}
          size="lg"
          className="w-full mb-8"
          onClick={handleSelectPackage}
          loading={isLoading}
        >
          Pilih Paket
        </Button>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Termasuk:</p>
          
          {featureList && featureList.length > 0 ? (
            <ul className="space-y-3">
              {featureList.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-muted text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-muted text-sm">Akses penuh ke semua tools</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-muted text-sm">Support 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
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