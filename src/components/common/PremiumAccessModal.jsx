import { createPortal } from 'react-dom';
import './PremiumAccessModal.css';

const PremiumAccessModal = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
  packageName
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="modal-backdrop" onClick={onClose} />

      <div
        className="modal-container animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">🔒</div>

        <h3 className="modal-title">Akses Terbatas</h3>

        <p className="modal-description">
          Fitur <strong>{featureName}</strong> tidak tersedia pada paket yang
          sedang Anda gunakan.
        </p>

        {packageName && (
          <div className="modal-package-info">
            📦 Paket aktif Anda:
            <strong> {packageName}</strong>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Tutup
          </button>

          <button className="btn btn-primary" onClick={onUpgrade}>
            🚀 Upgrade Paket
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PremiumAccessModal;
