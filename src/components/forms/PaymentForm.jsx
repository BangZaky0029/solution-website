
// =========================================
// FILE: src/components/forms/PaymentForm.jsx - QR ENHANCED
// =========================================

import { useState } from 'react';
import { PAYMENT_METHODS } from '../../utils/constants';
import Button from '../common/Button';
import qrisImage from '../../assets/qrcode/qr.jpeg';
import { Info, Copy, Check, UploadCloud, Smartphone, CreditCard, ShieldCheck, Download } from 'lucide-react';
import './PaymentForm.css';

const PaymentForm = ({ 
  onSubmit, 
  loading = false, 
  selectedMethod = null 
}) => {
  const [formData, setFormData] = useState({
    paymentMethod: selectedMethod || PAYMENT_METHODS.QRIS,
    email: '',
    phone: '',
    proofFile: null,
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrisImage;
    link.download = 'QRIS-Nuansa-Solution.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, proofFile: 'Ukuran file tidak boleh lebih dari 5MB' }));
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, proofFile: 'Format file harus PNG, JPG, atau PDF' }));
        return;
      }

      setFormData(prev => ({ ...prev, proofFile: file }));
      setErrors(prev => ({ ...prev, proofFile: '' }));
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => setFilePreview(event.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview('📄');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.phone) newErrors.phone = 'Nomor WhatsApp wajib diisi';
    if (!formData.proofFile) newErrors.proofFile = 'Silakan unggah bukti transfer untuk konfirmasi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form-guided">
      {/* STEP 1: METODE */}
      <div className="form-section-card animate-slide-up">
        <div className="section-header-refined">
          <div className="step-badge">1</div>
          <div className="header-text">
            <h3>Pilih Metode Pembayaran</h3>
            <p>Metode digital otomatis untuk proses lebih cepat</p>
          </div>
        </div>

        <div className="payment-methods-selector">
          {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
            <label key={key} className={`method-pill ${formData.paymentMethod === value ? 'active' : ''}`}>
              <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="hidden-radio" />
              <div className="method-pill-content">
                {value === PAYMENT_METHODS.BCA ? <CreditCard size={20} /> : <Smartphone size={20} />}
                <span>{value}</span>
                {formData.paymentMethod === value && <Check size={14} className="check-icon" />}
              </div>
            </label>
          ))}
        </div>

        {/* PAYMENT GUIDE PANEL */}
        <div className="payment-guide-panel">
          {formData.paymentMethod === PAYMENT_METHODS.BCA ? (
            <div className="bank-guide animate-fade-in">
              <div className="guide-header">
                <Info size={16} /> <span>Instruksi Transfer BCA</span>
              </div>
              <ol className="guide-steps">
                <li>Transfer sesuai nominal ke rekening <strong>7000944844</strong></li>
                <li>Atas Nama: <strong>PT Nuansa Berkah Sejahtera</strong></li>
                <li>Simpan bukti transfer berupa Screenshot atau Foto struk</li>
              </ol>
              <div className="bank-details-box">
                <div className="detail-row">
                  <span className="label">No. Rekening</span>
                  <div className="value-copy" onClick={() => handleCopy('7000944844')}>
                    <strong>7000 944 844</strong>
                    {copySuccess ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="qris-guide animate-fade-in">
              <div className="guide-header">
                <Smartphone size={16} /> <span>Instruksi Scan QRIS</span>
              </div>
              
              <div className="qris-container-vertical">
                <div className="qris-image-wrapper">
                  <img src={qrisImage} alt="QRIS Nuansa Solution" className="qris-visual-uncompressed" />
                  <button type="button" onClick={handleDownloadQR} className="btn-download-qr">
                    <Download size={18} /> Simpan / Download QR
                  </button>
                </div>

                <div className="qris-steps-box">
                  <div className="q-step"><span>1</span> <p>Buka Aplikasi M-Banking atau E-Wallet Anda</p></div>
                  <div className="q-step"><span>2</span> <p>Pilih menu Scan / Bayar dan arahkan ke QR di atas</p></div>
                  <div className="q-step"><span>3</span> <p>Masukkan nominal sesuai paket dan selesaikan bayar</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: DATA */}
      <div className="form-section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="section-header-refined">
          <div className="step-badge">2</div>
          <div className="header-text">
            <h3>Konfirmasi Identitas</h3>
            <p>Data ini digunakan untuk aktivasi akun & invoice</p>
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group-refined">
            <label>Email Terdaftar</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="err-msg">{errors.email}</span>}
          </div>
          <div className="form-group-refined">
            <label>WhatsApp Aktif</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0812..." className={errors.phone ? 'error' : ''} />
            {errors.phone && <span className="err-msg">{errors.phone}</span>}
          </div>
        </div>
      </div>

      {/* STEP 3: BUKTI */}
      <div className="form-section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-header-refined">
          <div className="step-badge">3</div>
          <div className="header-text">
            <h3>Unggah Bukti Transfer</h3>
            <p>Pastikan gambar jernih & nominal terlihat jelas</p>
          </div>
        </div>

        <div className="upload-container">
          <input type="file" id="proofFile" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="hidden-file-input" />
          
          {!formData.proofFile ? (
            <label htmlFor="proofFile" className="dropzone-area">
              <UploadCloud size={40} className="upload-icon-anim" />
              <div className="dropzone-text">
                <strong>Klik untuk memilih file</strong>
                <span>PNG, JPG, PDF (Maks. 5MB)</span>
              </div>
            </label>
          ) : (
            <div className="preview-selected-file">
              <div className="preview-thumb">
                {typeof filePreview === 'string' && filePreview !== '📄' ? (
                  <img src={filePreview} alt="Preview" />
                ) : (
                  <div className="file-placeholder">📄</div>
                )}
              </div>
              <div className="preview-info">
                <p className="file-name">{formData.proofFile.name}</p>
                <p className="file-size">{(formData.proofFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" className="btn-remove-file" onClick={() => { setFormData(p => ({...p, proofFile: null})); setFilePreview(null); }}>
                Ganti File
              </button>
            </div>
          )}
          {errors.proofFile && <div className="error-alert-box">{errors.proofFile}</div>}
        </div>
      </div>

      {/* FINAL ACTION */}
      <div className="form-footer-action animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="security-guarantee">
          <ShieldCheck size={16} />
          <span>Keamanan transaksi Anda terjamin 100%</span>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full btn-confirm-pay" loading={loading}>
          <Check size={20} /> Konfirmasi Pembayaran Sekarang
        </Button>
        <p className="terms-hint">Proses verifikasi manual membutuhkan waktu sekitar 1-5 menit pada jam operasional.</p>
      </div>
    </form>
  );
};

export default PaymentForm;
