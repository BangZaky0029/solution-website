// =========================================
// FILE: PaymentPage.jsx - FRONTEND PAGE FIXED
// Path: src/pages/Payment/PaymentPage.jsx
// =========================================

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { paymentController } from '../../controllers/paymentController';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/helpers';
import PaymentForm from '../../components/forms/PaymentForm';
import UpgradeWarningModal from '../../components/modals/UpgradeWarningModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/Style_forWebsite/Payment.css';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const packageId = searchParams.get('packageId');

  // ✅ Fetch package data
  const { data: packageData, loading: pkgLoading } = useFetch(
    packageId ? `/packages/${packageId}` : null
  );

  const [selectedMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ State untuk warning modal
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);
  const [activePackage, setActivePackage] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);

  // ============================
  // ✅ CEK PAKET AKTIF - SIMPLIFIED
  // ============================
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!packageId) {
      navigate('/');
      return;
    }

    checkActivePackage();
  }, [isAuthenticated, packageId, navigate]);

  // ✅ FIXED: Gunakan endpoint yang benar dari backend
  const checkActivePackage = async () => {
    try {
      // Panggil endpoint /payment/check-active-package
      const response = await paymentController.checkActivePackage();


      // Backend sekarang return: { success, hasActive, activePackage?, warning? }
      if (response.success && response.hasActive && response.activePackage) {
        setActivePackage({
          id: response.activePackage.token_id,
          package_id: response.activePackage.package_id,
          package_name: response.activePackage.package_name,
          activated_at: response.activePackage.activated_at,
          expired_at: response.activePackage.expired_at,
        });

      } else {
        setActivePackage(null);
      }
    } catch {
      setActivePackage(null);
    }
  };

  // ============================
  // ✅ HANDLE PAYMENT SUBMISSION
  // ============================
  const handlePaymentSubmit = async (formData) => {
    // Reset error
    setError('');

    // ✅ Jika ada paket aktif, tampilkan warning modal
    if (activePackage) {
      setPendingFormData(formData);
      setShowUpgradeWarning(true);
      return;
    }

    // Kalau tidak ada paket aktif, langsung proses pembayaran
    await processPayment(formData, false);
  };

  // ============================
  // ✅ HANDLE UPGRADE CONFIRMATION
  // ============================
  const handleUpgradeConfirm = async () => {
    if (pendingFormData) {
      await processPayment(pendingFormData, true);
      setShowUpgradeWarning(false);
      setPendingFormData(null);
    }
  };

  const handleUpgradeCancel = () => {
    setShowUpgradeWarning(false);
    setPendingFormData(null);
    setError('');
  };

  // ============================
  // ✅ PROCESS PAYMENT - FIXED
  // ============================
  const processPayment = async (formData, forceUpgrade = false) => {
    setLoading(true);
    setError('');

    try {
      // 1️⃣ Buat payment record
      const paymentResult = await paymentController.createPayment(
        packageId,
        formData.paymentMethod,
        forceUpgrade
      );


      // ✅ FIXED: Backend sekarang kirim success flag
      if (!paymentResult.success) {
        // Jika backend return hasActive (seharusnya tidak, karena sudah dicek di frontend)
        if (paymentResult.hasActive) {
          setError('Anda memiliki paket aktif. Silakan konfirmasi upgrade.');
          setLoading(false);
          return;
        }

        setError(paymentResult.message || 'Gagal membuat payment');
        setLoading(false);
        return;
      }

      // 2️⃣ Konfirmasi pembayaran dengan bukti
      const confirmResult = await paymentController.confirmPayment(
        paymentResult.payment_id,
        formData.email,
        formData.phone,
        formData.proofFile
      );


      // ✅ FIXED: Backend sekarang kirim success flag
      if (!confirmResult.success) {
        setError(confirmResult.message || 'Gagal mengonfirmasi pembayaran');
        setLoading(false);
        return;
      }

      // 3️⃣ Redirect ke halaman konfirmasi
      navigate('/payment-confirmation', {
        state: { paymentId: paymentResult.payment_id }
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // ✅ PREPARE MODAL DATA
  // ============================
  const getModalData = () => {
    if (!activePackage || !packageData) return null;

    const daysLeft = getDaysRemaining(activePackage.expired_at);

    return {
      currentPackage: {
        name: activePackage.package_name || 'Paket Tidak Diketahui',
        expiredAt: formatDate(activePackage.expired_at) || '-',
        daysLeft: daysLeft > 0 ? daysLeft : 0,
      },
      newPackage: {
        name: packageData.name || 'Paket Baru',
        duration: packageData.duration_days || 0,
        price: formatCurrency(packageData.price) || 'Rp 0',
      },
    };
  };

  // ============================
  // LOADING STATE
  // ============================
  if (pkgLoading) {
    return (
      <div className="payment-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="payment-container">
        <div className="error-container">
          <h2>Paket tidak ditemukan</h2>
          <p>Silakan kembali dan pilih paket yang valid</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const modalData = getModalData();

  // ============================
  // RENDER
  // ============================
  return (
    <>
      {/* ✅ Upgrade Warning Modal */}
      {modalData && (
        <UpgradeWarningModal
          isOpen={showUpgradeWarning}
          currentPackage={modalData.currentPackage}
          newPackage={modalData.newPackage}
          onConfirm={handleUpgradeConfirm}
          onCancel={handleUpgradeCancel}
          loading={loading}
        />
      )}

      <div className="payment-container">
        <div className="payment-wrapper">
          {/* LEFT: PAYMENT FORM */}
          <div className="payment-form-section">
            <div className="form-header">
              <h1>Konfirmasi Pembayaran</h1>
              <p>Lengkapi data pembayaran Anda untuk melanjutkan</p>
            </div>

            {/* ✅ Error Alert */}
            {error && (
              <div className="payment-error-alert animate-slide-down">
                <span className="error-icon">⚠️</span>
                <div>
                  <strong>Terjadi Kesalahan</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <PaymentForm
              onSubmit={handlePaymentSubmit}
              loading={loading}
              selectedMethod={selectedMethod}
            />
          </div>

          {/* RIGHT: PAYMENT SUMMARY */}
          <div className="payment-summary-section">
            <div className="summary-sticky">
              {/* Summary Header */}
              <div className="summary-header">
                <h2>Ringkasan Pembayaran</h2>
              </div>

              {/* Package Info */}
              {packageData && (
                <>
                  <div className="summary-content">
                    {/* Package Card */}
                    <div className="summary-card package-summary-card">
                      <h3 className="card-title">📦 Paket</h3>
                      <p className="package-name">{packageData.name}</p>
                      <div className="package-meta">
                        <div className="meta-item">
                          <span className="meta-label">Durasi</span>
                          <span className="meta-value">{packageData.duration_days} hari</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Harga</span>
                          <span className="meta-value">
                            {formatCurrency(packageData.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ✅ Active Package Warning */}
                    {activePackage && (
                      <div className="summary-card upgrade-info-card">
                        <h3 className="card-title">⚠️ Paket Aktif</h3>
                        <p className="active-package-name">{activePackage.package_name}</p>
                        <div className="package-meta">
                          <div className="meta-item">
                            <span className="meta-label">Berakhir</span>
                            <span className="meta-value">
                              {formatDate(activePackage.expired_at)}
                            </span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Sisa Hari</span>
                            <span className="meta-value">
                              {getDaysRemaining(activePackage.expired_at)} hari
                            </span>
                          </div>
                        </div>
                        <div className="upgrade-notice">
                          <p>Paket lama akan dihapus setelah Anda upgrade</p>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {packageData.description && (
                      <div className="summary-card features-card">
                        <h3 className="card-title">✨ Fitur Termasuk</h3>
                        <ul className="features-list">
                          {typeof packageData.description === 'string'
                            ? JSON.parse(packageData.description).map((feature, idx) => (
                              <li key={idx}>
                                <span className="check-icon">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))
                            : [
                              'Akses penuh ke semua tools',
                              'Support 24/7',
                              'Unlimited Usage',
                            ].map((feature, idx) => (
                              <li key={idx}>
                                <span className="check-icon">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Total Price */}
                  <div className="summary-total">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>{formatCurrency(packageData.price)}</span>
                    </div>
                    <div className="total-row">
                      <span>PPN (0%)</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="total-divider"></div>
                    <div className="total-row final">
                      <span>Total Pembayaran</span>
                      <span className="total-amount">
                        {formatCurrency(packageData.price)}
                      </span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="security-badge">
                    <span className="badge-icon">🔒</span>
                    <div className="badge-text">
                      <strong>Aman & Terpercaya</strong>
                      <p>Transaksi Anda dilindungi dengan enkripsi tingkat bank</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;