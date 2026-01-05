import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
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
  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await api.get('/payment/user/payments');

        // ✅ VALIDASI RESPONSE
        if (!response.data.success) {
          throw new Error(response.data.message || 'Gagal memuat pembayaran');
        }

        const paymentsData = response.data.data || [];

        setPayments(paymentsData);

        // ✅ Notifikasi otomatis payment confirmed terbaru
        const confirmedPayments = paymentsData
          .filter(p => p.status === 'confirmed')
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        if (confirmedPayments.length > 0) {
          showNotification(
            `Selamat! Paket ${confirmedPayments[0].package_name} Anda telah aktif.`,
            'success'
          );
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        showNotification('Gagal memuat riwayat pembayaran', 'error');
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

      showNotification('Invoice berhasil diunduh', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Gagal mengunduh invoice', 'error');
    } finally {
      setDownloadingInvoice(null);
    }
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

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(user?.name || 'User')}</div>
        <div className="profile-info">
          <h2>{user?.name || 'User'}</h2>
          <p className="text-muted">{user?.email}</p>
          <p className="text-muted">{user?.phone}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/payment')}>
          Pilih Paket / Upgrade
        </Button>
      </div>

      {/* Active Packages */}
      <div className="profile-section">
        <h3 className="section-title">Paket Aktif</h3>
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
                      {status === 'active' ? '✓ Aktif' : '⚠ Berakhir'}
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
                            {daysLeft} hari
                          </p>
                        </div>
                      )}
                    </div>

                    <Button variant="primary" className="w-full" onClick={() => navigate('/payment')}>
                      Perpanjang / Upgrade
                    </Button>
                  </div>
                );
              })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted mb-4">Anda belum memiliki paket berlangganan</p>
              <Button variant="primary" onClick={() => navigate('/payment')}>
                Pilih Paket Sekarang
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="profile-section">
        <h3 className="section-title">Riwayat Pembayaran</h3>
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
              Belum ada riwayat pembayaran
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
