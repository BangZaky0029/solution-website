
// =========================================
// FILE: src/components/forms/PaymentForm.jsx - QR ENHANCED
// =========================================



import { useState, useEffect } from 'react';
import { PAYMENT_METHODS } from '../../utils/constants';
import Button from '../common/Button';
import qrisImage from '../../assets/qrcode/qr.jpeg';
import { Info, Copy, Check, UploadCloud, Smartphone, CreditCard, ShieldCheck, Download, ChevronRight, ChevronLeft, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PaymentForm.css';

const PaymentForm = ({
  onSubmit,
  loading = false,
  selectedMethod = null,
  user = null
}) => {
  const [formData, setFormData] = useState({
    paymentMethod: selectedMethod || PAYMENT_METHODS.QRIS,
    email: user?.email || '',
    phone: user?.phone || '',
    proofFile: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-fill effect when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

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

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email wajib diisi';
      if (!formData.phone) newErrors.phone = 'Nomor WhatsApp wajib diisi';
    }
    if (step === 3) { // Method is step 2, usually auto-selected or easy
      if (!formData.proofFile) newErrors.proofFile = 'Bukti transfer wajib diunggah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      onSubmit(formData);
    }
  };

  const steps = [
    { number: 1, title: 'Data Diri' },
    { number: 2, title: 'Metode' },
    { number: 3, title: 'Upload' }
  ];

  return (
    <form onSubmit={handleSubmit} className="payment-form-guided">
      {/* STEP INDICATOR */}
      <div className="flex justify-between mb-6 px-2 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded"></div>
        {steps.map((step) => (
          <div key={step.number} className={`flex flex-col items-center bg-white px-2 cursor-default`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                ${currentStep >= step.number ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
            >
              {currentStep > step.number ? <Check size={16} /> : step.number}
            </div>
            <span className={`text-xs mt-1 font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-section-card"
          >
            <div className="section-header-refined">
              <div className="step-badge">1</div>
              <div className="header-text">
                <h3>Konfirmasi Identitas</h3>
                <p>Data diambil dari profil akun Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="form-group-refined">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="text-blue-600" />
                  <span className="translate-y-[1px]">Email Terdaftar</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-not-allowed"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="form-group-refined">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Smartphone size={16} className="text-blue-600" />
                  <span className="translate-y-[1px]">WhatsApp Aktif</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 cursor-not-allowed"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">*Nomor ini akan menerima notifikasi aktivasi.</p>
              </div>
            </div>

            <div className="mt-6">
              <Button type="button" onClick={nextStep} variant="primary" className="w-full flex items-center justify-center gap-2">
                Lanjut Pilih Metode <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-section-card"
          >
            <div className="section-header-refined">
              <div className="step-badge">2</div>
              <div className="header-text">
                <h3>Metode Pembayaran</h3>
                <p>Pilih metode yang Anda inginkan</p>
              </div>
            </div>

            <div className="payment-methods-selector mb-6">
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
            <div className="payment-guide-panel mb-6">
              {formData.paymentMethod === PAYMENT_METHODS.BCA ? (
                <div className="bank-guide animate-fade-in">
                  <div className="guide-header">
                    <Info size={16} /> <span>Instruksi Transfer BCA</span>
                  </div>
                  <ol className="guide-steps text-sm">
                    <li>Transfer ke rekening <strong>7000944844</strong></li>
                    <li>Atas Nama: <strong>PT Nuansa Berkah Sejahtera</strong></li>
                    <li>Simpan bukti transfer</li>
                  </ol>
                  <div className="bank-details-box mt-3">
                    <div className="detail-row">
                      <span className="label text-xs">No. Rekening</span>
                      <div className="value-copy text-sm" onClick={() => handleCopy('7000944844')}>
                        <strong>7000 944 844</strong>
                        {copySuccess ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="qris-guide animate-fade-in">
                  <div className="guide-header">
                    <Smartphone size={16} /> <span>Scan QRIS</span>
                  </div>

                  <div className="qris-container-vertical">
                    <div className="qris-image-wrapper">
                      <img src={qrisImage} alt="QRIS Nuansa Solution" className="qris-visual-uncompressed max-h-48 object-contain" />
                    </div>
                    <button type="button" onClick={handleDownloadQR} className="btn-download-qr text-xs py-2 mt-2 w-full">
                      <Download size={14} /> Download QR Code
                    </button>
                    <div className="text-center text-xs text-muted mt-2">
                      Scan menggunakan GoPay, OVO, Dana, ShopeePay, atau Mobile Banking
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={prevStep} variant="outline" className="flex-1 flex items-center justify-center gap-2">
                <ChevronLeft size={18} /> Kembali
              </Button>
              <Button type="button" onClick={nextStep} variant="primary" className="flex-1 flex items-center justify-center gap-2">
                Lanjut Upload <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-section-card"
          >
            <div className="section-header-refined">
              <div className="step-badge">3</div>
              <div className="header-text">
                <h3>Unggah Bukti Transfer</h3>
                <p>Langkah terakhir untuk aktivasi</p>
              </div>
            </div>

            <div className="upload-container mb-6">
              <input type="file" id="proofFile" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="hidden-file-input" />

              {!formData.proofFile ? (
                <label htmlFor="proofFile" className="dropzone-area">
                  <UploadCloud size={32} className="upload-icon-anim" />
                  <div className="dropzone-text">
                    <strong>Pilih File Bukti</strong>
                    <span>Format: JPG, PNG, PDF</span>
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
                    <p className="file-name truncate max-w-[150px]">{formData.proofFile.name}</p>
                    <p className="file-size">{(formData.proofFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" className="btn-remove-file" onClick={() => { setFormData(p => ({ ...p, proofFile: null })); setFilePreview(null); }}>
                    Hapus
                  </button>
                </div>
              )}
              {errors.proofFile && <div className="error-alert-box mt-2">{errors.proofFile}</div>}
            </div>

            <div className="form-footer-action">
              <div className="security-guarantee mb-4 justify-center">
                <ShieldCheck size={16} />
                <span>Transaksi Aman & Terenkripsi</span>
              </div>
              <div className="flex gap-3">
                <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                  Kembali
                </Button>
                <Button type="submit" variant="primary" size="lg" className="flex-[2] btn-confirm-pay" loading={loading}>
                  Konfirmasi Pembayaran
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default PaymentForm;
