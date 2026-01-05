// =========================================
// FILE: src/components/modals/UpgradeWarningModal.jsx - FIXED
// =========================================
import Button from '../common/Button';
import './UpgradeWarningModal.css';

const UpgradeWarningModal = ({ 
  isOpen, 
  currentPackage, 
  newPackage, 
  onConfirm, 
  onCancel,
  loading = false 
}) => {
  if (!isOpen) return null;

  // ✅ Validasi data dengan fallback
  const safeCurrentPackage = {
    name: currentPackage?.name || 'Paket Tidak Diketahui',
    expiredAt: currentPackage?.expiredAt || '-',
    daysLeft: currentPackage?.daysLeft !== undefined ? currentPackage.daysLeft : 0
  };

  const safeNewPackage = {
    name: newPackage?.name || 'Paket Baru',
    duration: newPackage?.duration || 0,
    price: newPackage?.price || 'Rp 0'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content upgrade-warning-modal animate-slide-up">
        {/* Header */}
        <div className="modal-header">
          <div className="warning-icon">⚠️</div>
          <h2>Konfirmasi Upgrade Paket</h2>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="info-card">
            <div className="info-section">
              <h4>Paket Aktif Saat Ini</h4>
              <div className="package-info current">
                <div className="package-name-badge">{safeCurrentPackage.name}</div>
                <p className="package-detail">
                  <strong>Berakhir:</strong> {safeCurrentPackage.expiredAt}
                </p>
                <p className="package-detail">
                  <strong>Sisa:</strong> {safeCurrentPackage.daysLeft} hari
                </p>
              </div>
            </div>

            <div className="upgrade-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="info-section">
              <h4>Paket Baru</h4>
              <div className="package-info new">
                <div className="package-name-badge new">{safeNewPackage.name}</div>
                <p className="package-detail">
                  <strong>Durasi:</strong> {safeNewPackage.duration} hari
                </p>
                <p className="package-detail">
                  <strong>Harga:</strong> {safeNewPackage.price}
                </p>
              </div>
            </div>
          </div>

          <div className="warning-message">
            <div className="warning-icon-small">ℹ️</div>
            <div className="warning-text">
              <p>
                <strong>Perhatian:</strong> Ketika Anda mengupgrade, paket aktif sebelumnya akan 
                <strong> dihapus dan diganti</strong> dengan paket baru. Sisa hari dari paket 
                lama tidak akan dikembalikan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Memproses...' : 'Lanjutkan Upgrade'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeWarningModal;