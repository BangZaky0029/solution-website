// =========================================
// FILE: src/components/forms/ForgotPasswordForm.jsx - NEW
// Multi-step Forgot Password Form
// =========================================

import { useState } from 'react';
import { validatePhone, validateOTP, getPasswordStrength } from '../../utils/validation';
import Button from '../common/Button';
import PhoneInput from '../common/PhoneInput';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const ForgotPasswordForm = ({
  step,
  loading,
  phoneNumber,
  onRequestOTP,
  onVerifyOTP,
  onResetPassword,
  onResendOTP,
  serverError // 🆕 External error prop
}) => {
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '', color: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'newPassword') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  // Step 1: Request OTP
  const handleRequestSubmit = (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Nomor WhatsApp tidak valid' });
      return;
    }

    onRequestOTP(formData.phone);
  };

  // Step 2: Verify OTP
  const handleVerifySubmit = (e) => {
    e.preventDefault();

    if (!validateOTP(formData.otp)) {
      setErrors({ otp: 'OTP harus 6 digit angka' });
      return;
    }

    onVerifyOTP(formData.otp);
  };

  // Step 3: Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.newPassword || formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password minimal 8 karakter';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onResetPassword(formData.newPassword);
  };

  return (
    <>
      {/* STEP 1: Request OTP */}
      {step === 'request' && (
        <form onSubmit={handleRequestSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="phone">Nomor WhatsApp</label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              disabled={loading}
              error={errors.phone}
            />
            {errors.phone && (
              <span className="error-message">
                <AlertCircle size={14} /> {errors.phone}
              </span>
            )}
            {serverError && ( // 🆕 Show server error (Fixed position)
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}
            <p className="text-muted text-sm mt-2">
              Masukkan nomor WhatsApp yang terdaftar pada akun Anda
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
          </Button>
        </form>
      )}

      {/* STEP 2: Verify OTP */}
      {step === 'verify' && (
        <form onSubmit={handleVerifySubmit} className="auth-form">
          <div className="alert alert-info">
            <AlertCircle size={20} />
            <span>Kode OTP telah dikirim ke WhatsApp: {phoneNumber}</span>
          </div>

          <div className="form-group">
            <label htmlFor="otp">Kode OTP (6 Digit)</label>
            <input
              type="text"
              id="otp"
              name="otp"
              maxLength="6"
              value={formData.otp}
              onChange={handleChange}
              placeholder="000000"
              disabled={loading}
              className="text-center text-2xl tracking-widest"
            />
            {errors.otp && (
              <span className="error-message">
                <AlertCircle size={14} /> {errors.otp}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mb-3"
            loading={loading}
            disabled={loading || formData.otp.length !== 6}
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
          </Button>

          <button
            type="button"
            onClick={onResendOTP}
            disabled={loading}
            className="text-blue-600 font-semibold text-sm hover:underline w-full"
          >
            Kirim Ulang Kode OTP
          </button>
        </form>
      )}

      {/* STEP 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">Password Baru</label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength.level}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}

            {errors.newPassword && (
              <span className="error-message">
                <AlertCircle size={14} /> {errors.newPassword}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className="error-message">
                <AlertCircle size={14} /> {errors.confirmPassword}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Mengubah Password...' : 'Ubah Password'}
          </Button>
        </form>
      )}
    </>
  );
};

export default ForgotPasswordForm;