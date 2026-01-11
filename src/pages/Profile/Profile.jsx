// =========================================
// FILE: src/pages/Profile/Profile.jsx - UPDATED
// =========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import {
  getSubscriptionStatus,
  getDaysRemaining,
  formatDate,
  getInitials
} from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../services/api';
import '../../styles/Style_forWebsite/Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: userTokens, loading: tokensLoading } = useFetch('/users/tokens');
  const { packageInfo, accessStatus, loading: accessLoading } = useFeatureAccess();

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [notification, setNotification] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);

  // Redirect jika belum login
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // =========================
  // FETCH PAYMENT HISTORY
  // =========================
  // Di bagian fetchPayments, sudah benar karena menggunakan api.get langsung
  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await api.get('/payment/user/payments');

        // ✅ FIXED: Handle response structure properly
        if (!response.data.success) {
          throw new Error(response.data.message || 'Gagal memuat pembayaran');
        }

        const paymentsData = response.data.data || [];
        setPayments(paymentsData);

        // ... rest of the code
      } catch (err) {
        console.error('Error fetching payments:', err);
        showNotification('❌ Gagal memuat riwayat pembayaran', 'error');
      } finally {
        setLoadingPayments(false);
      }
    };

    if (isAuthenticated) fetchPayments();
  }, [isAuthenticated]);

  // =========================
  // NOTIFICATION HELPER
  // =========================
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // =========================
  // DOWNLOAD INVOICE
  // =========================
  const handleDownloadInvoice = async (paymentId) => {
    try {
      setDownloadingInvoice(paymentId);
      const response = await api.get(`/payment/${paymentId}/invoice`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showNotification('✅ Invoice berhasil diunduh', 'success');
    } catch (err) {
      console.error(err);
      showNotification('❌ Gagal mengunduh invoice', 'error');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  // =========================
  // GET FEATURE ICON
  // =========================
  const getFeatureIcon = (featureName) => {
    const icons = {
      'Generator Surat Kuasa': '📄',
      'Surat Pernyataan': '📝',
      'Surat Permohonan': '✉️',
      'Kalkulator PPh': '🧮',
      'Kalkulator Pajak Properti': '🏠',
      'Surat Perintah Kerja': '🛠️',
      'Surat Jalan': '🚚',
      'Invoice': '🧾'
    };
    return icons[featureName] || '📋';
  };

  if (tokensLoading || loadingPayments) return <LoadingSpinner />;

  return (
    <div className="profile-container">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type} animate-slide-down`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* ===== PROFILE HEADER ===== */}
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(user?.name || 'User')}</div>
        <div className="profile-info">
          <h2>{user?.name || 'User'}</h2>
          <p className="text-muted">{user?.email}</p>
          <p className="text-muted">{user?.phone}</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/payment')}>
          ➕ Upgrade / Perpanjang
        </Button>
      </div>

      {/* ===== ACTIVE PACKAGE SECTION ===== */}
      <div className="profile-section">
        <h3 className="section-title">📦 Paket Aktif Saat Ini</h3>
        <div className="profile-grid">
          {userTokens && userTokens.length > 0 ? (
            userTokens
              .filter(token => token.is_active === 1)
              .map(token => {
                const status = getSubscriptionStatus(token.package_name, token.expired_at);
                const daysLeft = getDaysRemaining(token.expired_at);

                return (
                  <div key={token.id} className={`package-card ${status === 'active' ? 'active' : ''}`}>
                    <div className={`package-status ${status}`}>
                      {status === 'active' ? '✓ Aktif' : '⚠️ Berakhir'}
                    </div>

                    <h3 className="text-2xl font-bold text-dark mb-4">
                      {token.package_name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-xs text-muted">Tanggal Aktivasi</p>
                        <p className="text-sm font-semibold text-dark">
                          {formatDate(token.activated_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Tanggal Berakhir</p>
                        <p className="text-sm font-semibold text-dark">
                          {formatDate(token.expired_at)}
                        </p>
                      </div>

                      {status === 'active' && (
                        <div>
                          <p className="text-xs text-muted">Sisa Hari</p>
                          <p className="text-lg font-bold text-blue-600">
                            ⏱️ {daysLeft} hari
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="primary" 
                      className="w-full mb-4" 
                      onClick={() => navigate('/payment')}
                    >
                      Perpanjang / Upgrade
                    </Button>
                  </div>
                );
              })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted mb-4 text-lg">📭 Belum ada paket berlangganan</p>
              <Button variant="primary" onClick={() => navigate('/payment')}>
                Pilih Paket Sekarang
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ===== ACCESSIBLE FEATURES SECTION ===== */}
      {packageInfo && !accessLoading && (
        <div className="profile-section">
          <h3 className="section-title">✨ Fitur yang Dapat Diakses</h3>
          
          {packageInfo.active_features && packageInfo.active_features.length > 0 ? (
            <div className="features-access-grid">
              {packageInfo.active_features.map(feature => (
                <div key={feature.id} className="feature-access-card">
                  <div className="feature-access-icon">
                    {getFeatureIcon(feature.name)}
                  </div>
                  <div className="feature-access-content">
                    <h4 className="feature-access-name">{feature.name}</h4>
                    <span className="feature-access-badge">✓ Tersedia</span>
                  </div>
                  <div className="feature-access-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              <p>Paket Anda tidak memiliki akses ke fitur khusus</p>
            </div>
          )}
        </div>
      )}

      {/* ===== PAYMENT HISTORY SECTION ===== */}
      <div className="profile-section">
        <h3 className="section-title">💳 Riwayat Pembayaran</h3>
        <div className="payment-history">
          {payments.length > 0 ? (
            payments.map(payment => (
              <div key={payment.id} className="payment-item">
                <div className="payment-info">
                  <h4>{payment.package_name}</h4>
                  <p>{formatDate(payment.created_at)}</p>
                </div>

                <div className="payment-details">
                  <span className={`payment-status ${payment.status}`}>
                    {payment.status === 'pending' && '⏳ Pending'}
                    {payment.status === 'confirmed' && '✓ Terverifikasi'}
                    {payment.status === 'rejected' && '✕ Ditolak'}
                  </span>

                  <p className="text-lg font-bold text-dark">
                    Rp {payment.amount?.toLocaleString('id-ID')}
                  </p>

                  {payment.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={downloadingInvoice === payment.id}
                      onClick={() => handleDownloadInvoice(payment.id)}
                      className="mt-2 w-full"
                    >
                      {downloadingInvoice === payment.id
                        ? '📥 Mengunduh...'
                        : '📥 Download Invoice'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted">
              <p>📭 Belum ada riwayat pembayaran</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== HELP SECTION ===== */}
      <div className="profile-section bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="section-title">❓ Butuh Bantuan?</h3>
        <p className="text-muted mb-4">
          Jika Anda memiliki pertanyaan tentang paket atau fitur, jangan ragu untuk menghubungi kami.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => navigate('/contact')}>
            📧 Hubungi Kami
          </Button>
          <Button variant="outline" onClick={() => navigate('/faq')}>
            ❓ FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;