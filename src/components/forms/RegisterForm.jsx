// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\components\forms\RegisterForm.jsx
// Enhanced with OTP display on frontend

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateForm, validatePhone, getPasswordStrength } from '../../utils/validation';
import { getErrorMessage } from '../../utils/helpers';
import Button from '../common/Button';
import PhoneInput from '../common/PhoneInput';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '', color: '' });
  const [focusedField, setFocusedField] = useState('');
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData, ['name', 'email', 'phone', 'password']);
    
    // Additional phone validation
    if (!validatePhone(formData.phone)) {
      validationErrors.phone = 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxx atau +628xxx';
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
    }

    // Check if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show first error as toast
      const firstError = Object.values(validationErrors)[0];
      showToast(firstError, 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await register(
        formData.name, 
        formData.email, 
        formData.phone, 
        formData.password
      );
      
      // Success
      const { trialPackage } = response;

      if (trialPackage) {
        showToast(
          `🎉 Trial berhasil diaktifkan: ${trialPackage.packageName} (${trialPackage.durationDays} hari)`,
          'success',
          5000
        );
      } else {
        showToast('🎉 Registrasi berhasil! Silakan verifikasi OTP!', 'success', 4000);
      }

      
      // 🔥 PASS OTP KE HALAMAN VERIFY-OTP
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { 
            email: formData.email,
            otp: response.otp,
            otpExpiry: response.otpExpiry,
            otpDuration: response.otpDuration || 30,
            userName: formData.name,
            trialPackage: response.trialPackage // 🔥 Tambahkan ini
          } 
        });
      }, 500);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, 'error');
      
      // Handle specific errors
      if (errorMessage.includes('Email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.includes('WhatsApp') || errorMessage.includes('nomor')) {
        setErrors({ phone: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Trial Info Banner */}
      <div className="trial-banner">
        <div className="trial-content">
          <span className="trial-icon">🎁</span>
          <div>
            <p className="trial-title">Bonus Trial 3 Hari!</p>
            <p className="trial-subtitle">Dapatkan akses gratis semua fitur premium</p>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
        <label htmlFor="name">Nama Lengkap</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            placeholder="John Doe"
            disabled={loading}
            className={errors.name ? 'error' : ''}
          />
        </div>
        {errors.name && (
          <span className="error-message">
            <XCircle size={14} /> {errors.name}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
        <label htmlFor="email">Email</label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            placeholder="your@email.com"
            disabled={loading}
            className={errors.email ? 'error' : ''}
          />
        </div>
        {errors.email && (
          <span className="error-message">
            <XCircle size={14} /> {errors.email}
          </span>
        )}
      </div>

      {/* Phone Field with PhoneInput Component */}
      <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}>
        <label htmlFor="phone">Nomor WhatsApp</label>
        <PhoneInput
          value={formData.phone}
          onChange={handlePhoneChange}
          disabled={loading}
          error={errors.phone}
          placeholder="8123456789"
        />
        {errors.phone && (
          <span className="error-message">
            <XCircle size={14} /> {errors.phone}
          </span>
        )}
        <p className="text-muted text-xs mt-2">
          Format: 08xxx atau +628xxx. Nomor ini akan digunakan untuk verifikasi OTP.
        </p>
      </div>

      {/* Password Field with Strength Indicator */}
      <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
        <label htmlFor="password">Password</label>
        <div className="input-wrapper password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            placeholder="••••••••"
            disabled={loading}
            className={errors.password ? 'error' : ''}
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
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${passwordStrength.level}%`,
                  backgroundColor: passwordStrength.color,
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <span className="strength-text" style={{ color: passwordStrength.color }}>
              {passwordStrength.text}
            </span>
          </div>
        )}
        
        {errors.password && (
          <span className="error-message">
            <XCircle size={14} /> {errors.password}
          </span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
        <label htmlFor="confirmPassword">Konfirmasi Password</label>
        <div className="input-wrapper password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField('')}
            placeholder="••••••••"
            disabled={loading}
            className={errors.confirmPassword ? 'error' : ''}
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
        
        {/* Password Match Indicator */}
        {formData.confirmPassword && (
          <div className="password-match">
            {formData.password === formData.confirmPassword ? (
              <span className="match-success">
                <CheckCircle size={14} /> Password cocok
              </span>
            ) : (
              <span className="match-error">
                <XCircle size={14} /> Password tidak cocok
              </span>
            )}
          </div>
        )}
        
        {errors.confirmPassword && (
          <span className="error-message">
            <XCircle size={14} /> {errors.confirmPassword}
          </span>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full submit-button"
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Daftar & Aktifkan Trial'}
      </Button>

      <div className="auth-footer">
        <p>Sudah punya akun?</p>
        <Link to="/login" className="auth-link">Login sekarang</Link>
      </div>
    </form>
  );
};

export default RegisterForm;