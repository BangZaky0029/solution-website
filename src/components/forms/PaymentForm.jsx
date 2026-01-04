// =========================================
// FILE: src/components/forms/PaymentForm.jsx
// =========================================

import { useState } from 'react';
import { PAYMENT_METHODS } from '../../utils/constants';
import Button from '../common/Button';
import qrisImage from '../../assets/qrcode/nuansaLogo.png';

const PaymentForm = ({ onSubmit, loading = false, selectedMethod = null }) => {
  const [formData, setFormData] = useState({
    paymentMethod: selectedMethod || PAYMENT_METHODS.QRIS,
    email: '',
    phone: '',
    proofFile: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, proofFile: 'Ukuran file tidak boleh lebih dari 5MB' }));
      } else {
        setFormData(prev => ({ ...prev, proofFile: file }));
        setErrors(prev => ({ ...prev, proofFile: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email harus diisi';
    if (!formData.phone) newErrors.phone = 'Nomor telepon harus diisi';
    if (!formData.proofFile) newErrors.proofFile = 'Bukti transfer harus diunggah';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-dark mb-3">Metode Pembayaran</label>
        <div className="space-y-3">
          {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
            <label key={key} className="payment-method cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={formData.paymentMethod === value}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <span className="font-semibold text-dark">{value}</span>
                <p className="text-xs text-muted">
                  {value === PAYMENT_METHODS.BCA
                    ? 'Transfer ke rekening BCA'
                    : 'Scan QR Code untuk pembayaran'}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Dynamic Info Based on Method */}
        {formData.paymentMethod === PAYMENT_METHODS.BCA && (
          <div className="bg-blue-50 rounded-lg p-4 mt-4 text-sm text-dark">
            <p><strong>Atas Nama:</strong> PT Nuansa Berkah Sejahtera</p>
            <p><strong>Bank:</strong> BCA</p>
            <p><strong>No. Rekening:</strong> 7000944844</p>
          </div>
        )}

        {formData.paymentMethod === PAYMENT_METHODS.QRIS && (
          <div className="bg-blue-50 rounded-lg p-4 mt-4 text-center">
            <img src={qrisImage} alt="QRIS Nuansa" className="mx-auto w-48 h-48 object-contain" />
            <p className="mt-2 text-sm text-muted">Scan QR Code untuk pembayaran</p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Anda</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          disabled={loading}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Nomor Telepon</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="08123456789"
          disabled={loading}
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="proofFile">Bukti Transfer</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            id="proofFile"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          <label htmlFor="proofFile" className="cursor-pointer">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-dark font-medium">
              {formData.proofFile ? formData.proofFile.name : 'Klik untuk upload atau drag & drop'}
            </p>
            <p className="text-xs text-muted mt-2">PNG, JPG atau PDF (Max 5MB)</p>
          </label>
        </div>
        {errors.proofFile && <span className="text-red-500 text-sm">{errors.proofFile}</span>}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Konfirmasi Pembayaran
      </Button>
    </form>
  );
};

export default PaymentForm;
