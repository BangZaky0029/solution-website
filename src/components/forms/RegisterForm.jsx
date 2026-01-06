// =========================================
// FILE: src/components/forms/RegisterForm.jsx - ENHANCED
// =========================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateForm, validatePhone } from '../../utils/validation';
import { getErrorMessage } from '../../utils/helpers';
import Button from '../common/Button';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Fungsi untuk menghitung kekuatan password
  const calculatePasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (checks.length) strength += 20;
    if (checks.uppercase) strength += 20;
    if (checks.lowercase) strength += 20;
    if (checks.numbers) strength += 20;
    if (checks.special) strength += 20;

    if (strength <= 40) {
      return { level: strength, text: 'Lemah', color: '#ef4444' };
    } else if (strength <= 70) {
      return { level: strength, text: 'Cukup Kuat', color: '#f59e0b' };
    } else {
      return { level: strength, text: 'Kuat', color: '#10b981' };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Update password strength saat user mengetik password
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, ['name', 'email', 'phone', 'password']);
    
    if (!validatePhone(formData.phone)) {
      validationErrors.phone = 'Nomor telepon tidak valid';
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData.name, formData.email, formData.phone, formData.password);
      
      addToast('🎉 Registrasi berhasil! Trial 3 hari diaktifkan!', 'success', 4000);
      
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email } });
      }, 500);
    } catch (error) {
      addToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Trial Info Banner with enhanced animation */}
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
          />
        </div>
        {errors.email && (
          <span className="error-message">
            <XCircle size={14} /> {errors.email}
          </span>
        )}
      </div>

      {/* Phone Field */}
      <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}>
        <label htmlFor="phone">Nomor WhatsApp</label>
        <div className="input-wrapper">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField('')}
            placeholder="08123456789"
            disabled={loading}
          />
        </div>
        {errors.phone && (
          <span className="error-message">
            <XCircle size={14} /> {errors.phone}
          </span>
        )}
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