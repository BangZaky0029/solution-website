// =========================================
// FILE: src/components/forms/PaymentForm.jsx - IMPROVED
// =========================================

import { useState } from 'react';
import { PAYMENT_METHODS } from '../../utils/constants';
import Button from '../common/Button';
import qrisImage from '../../assets/qrcode/qr.jpeg';
import './PaymentForm.css';

const PaymentForm = ({ 
  onSubmit, 
  loading = false, 
  selectedMethod = null,
  showWarning = false,
  onWarningAccept = null 
}) => {
  const [formData, setFormData] = useState({
    paymentMethod: selectedMethod || PAYMENT_METHODS.QRIS,
    email: '',
    phone: '',
    proofFile: null,
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, proofFile: 'Ukuran file tidak boleh lebih dari 5MB' }));
        setFilePreview(null);
        return;
      }

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, proofFile: 'Format file harus PNG, JPG, atau PDF' }));
        setFilePreview(null);
        return;
      }

      setFormData(prev => ({ ...prev, proofFile: file }));
      setErrors(prev => ({ ...prev, proofFile: '' }));
      
      // Preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview('📄');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email harus diisi';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone) newErrors.phone = 'Nomor telepon harus diisi';
    if (!formData.proofFile) newErrors.proofFile = 'Bukti transfer harus diunggah';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form-container">
      {/* Payment Method Section */}
      <div className="form-section">
        <div className="section-header">
          <h3>1. Pilih Metode Pembayaran</h3>
          <span className="step-indicator">Step 1 of 3</span>
        </div>

        <div className="payment-methods-grid">
          {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
            <label 
              key={key} 
              className={`payment-method-card ${formData.paymentMethod === value ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={formData.paymentMethod === value}
                onChange={handleChange}
                className="hidden-radio"
              />
              
              <div className="method-icon">
                {value === PAYMENT_METHODS.BCA ? '🏦' : '📱'}
              </div>
              
              <div className="method-details">
                <span className="method-name">{value}</span>
                <p className="method-desc">
                  {value === PAYMENT_METHODS.BCA
                    ? 'Transfer ke rekening BCA'
                    : 'Scan QR Code untuk pembayaran'}
                </p>
              </div>

              <div className="method-check">✓</div>
            </label>
          ))}
        </div>

        {/* Dynamic Bank Info */}
        {formData.paymentMethod === PAYMENT_METHODS.BCA && (
          <div className="bank-info-card animate-slide-up">
            <div className="info-header">
              <h4>📋 Informasi Rekening BCA</h4>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Atas Nama</span>
                <span className="value">PT Nuansa Berkah Sejahtera</span>
              </div>
              <div className="info-item">
                <span className="label">Bank</span>
                <span className="value">BCA</span>
              </div>
              <div className="info-item">
                <span className="label">Nomor Rekening</span>
                <span className="value copyable">
                  7000944844
                  <button 
                    type="button"
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText('7000944844');
                      alert('Nomor rekening disalin ke clipboard');
                    }}
                  >
                    📋
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}

        {formData.paymentMethod === PAYMENT_METHODS.QRIS && (
          <div className="qris-info-card animate-slide-up">
            <h4>📱 Scan QR Code untuk Pembayaran</h4>
            <div className="qris-image-container">
              <img src={qrisImage} alt="QRIS Nuansa" className="qris-image" />
              <p className="qris-hint">Gunakan aplikasi pembayaran Anda untuk scan QR Code</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="form-section">
        <div className="section-header">
          <h3>2. Data Pribadi</h3>
          <span className="step-indicator">Step 2 of 3</span>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            disabled={loading}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Nomor WhatsApp / Telepon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08123456789"
            disabled={loading}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
          <p className="form-hint">Kami akan menghubungi nomor ini untuk konfirmasi</p>
        </div>
      </div>

      {/* Proof Upload Section */}
      <div className="form-section">
        <div className="section-header">
          <h3>3. Upload Bukti Transfer</h3>
          <span className="step-indicator">Step 3 of 3</span>
        </div>

        <div className="form-group">
          <label htmlFor="proofFile">Bukti Transfer / Screenshot</label>
          
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="proofFile"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden-file-input"
            />

            {!formData.proofFile ? (
              <label htmlFor="proofFile" className="file-upload-area">
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                  <p className="upload-title">Klik untuk upload atau drag & drop</p>
                  <p className="upload-subtitle">PNG, JPG atau PDF (Max 5MB)</p>
                </div>
              </label>
            ) : (
              <div className="file-preview-area">
                <div className="file-preview-content">
                  {filePreview && typeof filePreview === 'string' && filePreview !== '📄' ? (
                    <img src={filePreview} alt="Preview" className="preview-image" />
                  ) : (
                    <div className="file-icon">{filePreview === '📄' ? '📄' : '✓'}</div>
                  )}
                  <div className="file-info">
                    <p className="file-name">{formData.proofFile.name}</p>
                    <p className="file-size">
                      {(formData.proofFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, proofFile: null }));
                    setFilePreview(null);
                  }}
                  className="remove-file-btn"
                  disabled={loading}
                >
                  ✕ Hapus
                </button>
              </div>
            )}
          </div>

          {errors.proofFile && <span className="error-message">{errors.proofFile}</span>}
          <p className="form-hint">
            Pastikan bukti transfer menunjukkan detail pembayaran dengan jelas
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={loading || !formData.proofFile}
        >
          {loading ? 'Memproses...' : '✓ Konfirmasi Pembayaran'}
        </Button>
        <p className="form-disclaimer">
          Dengan mengklik tombol di atas, Anda menyetujui syarat dan ketentuan pembayaran kami
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;