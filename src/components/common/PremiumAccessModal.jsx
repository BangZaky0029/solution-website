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
          Fitur <strong>{featureName}</strong> terkunci atau memerlukan paket lebih tinggi.
        </p>

        {packageName && (
          <div className="modal-package-info">
            ℹ️ Paket aktif Anda: <strong>{packageName}</strong><br />
            <span style={{ fontSize: '0.9em', color: '#64748b' }}>(Belum mencakup fitur ini)</span>
          </div>
        )}

        <p className="modal-hint">
          Silakan cek opsi paket lainnya untuk membuka akses fitur ini.
        </p>

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
