// =========================================
// FILE: PaymentPage.jsx - OPTIMIZED (Animations)
// Path: src/pages/Payment/PaymentPage.jsx
// =========================================

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
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
  const { isAuthenticated, user } = useAuth();
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

  const checkActivePackage = async () => {
    try {
      const response = await paymentController.checkActivePackage();

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
    setError('');

    if (activePackage) {
      setPendingFormData(formData);
      setShowUpgradeWarning(true);
      return;
    }

    await processPayment(formData, false);
  };

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

      if (!paymentResult.success) {
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
      <div className="payment-container flex items-center justify-center min-h-[60vh]">
        {/* Simple Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <LoadingSpinner />
          <p className="mt-4 text-gray-500 font-medium">Memuat Detail Paket...</p>
        </motion.div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="payment-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-container p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Paket tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Silakan kembali dan pilih paket yang valid</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Kembali ke Home
          </button>
        </motion.div>
      </div>
    );
  }

  const modalData = getModalData();

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
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

      <motion.div
        className="payment-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="payment-wrapper">
          {/* LEFT: PAYMENT FORM */}
          <motion.div className="payment-form-section" variants={itemVariants}>
            <div className="form-header">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Konfirmasi Pembayaran
              </motion.h1>
              <p>Lengkapi data pembayaran Anda untuk melanjutkan</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="payment-error-alert"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                >
                  <span className="error-icon">⚠️</span>
                  <div>
                    <strong>Terjadi Kesalahan</strong>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PaymentForm
              onSubmit={handlePaymentSubmit}
              loading={loading}
              selectedMethod={selectedMethod}
              user={isAuthenticated ? user : null} // Pass user data
            />
          </motion.div>

          {/* RIGHT: PAYMENT SUMMARY */}
          <motion.div className="payment-summary-section" variants={itemVariants}>
            <div className="summary-sticky">
              <div className="summary-header">
                <h2>Ringkasan Pembayaran</h2>
              </div>

              {packageData && (
                <div className="summary-content">
                  <motion.div
                    className="summary-card package-summary-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
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
                  </motion.div>

                  {activePackage && (
                    <motion.div
                      className="summary-card upgrade-info-card"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="card-title">⚠️ Paket Aktif</h3>
                      <p className="active-package-name">{activePackage.package_name}</p>
                      <div className="package-meta">
                        {/* ... meta items ... */}
                        <div className="meta-item">
                          <span className="meta-label">Berakhir</span>
                          <span className="meta-value">{formatDate(activePackage.expired_at)}</span>
                        </div>
                      </div>
                      <div className="upgrade-notice">
                        <p>Paket lama akan dihapus setelah Anda upgrade</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Total Price */}
                  <div className="summary-total mt-4">
                    <div className="total-row final">
                      <span>Total Pembayaran</span>
                      <motion.span
                        className="total-amount"
                        key={packageData.price}
                        initial={{ scale: 1.2, color: "#2563eb" }}
                        animate={{ scale: 1, color: "#1f2937" }}
                      >
                        {formatCurrency(packageData.price)}
                      </motion.span>
                    </div>
                  </div>

                  {/* Security Badge - Static but present */}
                  <div className="security-badge mt-6">
                    <span className="badge-icon">🔒</span>
                    <div className="badge-text">
                      <strong>Aman & Terpercaya</strong>
                      <p>Transaksi Anda dilindungi dengan enkripsi tingkat bank</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PaymentPage;