// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\components\forms\LoginForm.jsx
// Enhanced with Better Navigation & Debugging

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateForm } from '../../utils/validation';
import { getErrorMessage } from '../../utils/helpers';
import Button from '../common/Button';
import { Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react';
import '../../styles/Style_forWebsite/Auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('========================================');
    console.log('🔐 LOGIN FORM - Submit started');
    console.log('📧 Email:', formData.email);
    console.log('========================================');

    // Validasi form
    const validationErrors = validateForm(formData, ['email', 'password']);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show first error
      const firstError = Object.values(validationErrors)[0];
      showToast(firstError, 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Calling login API...');
      const response = await login(formData.email, formData.password);
      
      console.log('✅ Login API response:', response);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      console.log('🔍 Token in localStorage:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (!token) {
        console.error('❌ Token not saved to localStorage!');
        showToast('Login gagal: Token tidak tersimpan', 'error');
        setLoading(false);
        return;
      }
      
      // Simpan remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        console.log('💾 Remember me saved');
      }
      
      console.log('✅ Login successful! Showing toast...');
      showToast('✅ Login berhasil! Selamat datang kembali.', 'success');
      
      console.log('🔄 Navigating to /profile in 500ms...');
      setTimeout(() => {
        console.log('➡️ Executing navigate to /profile');
        navigate('/profile', { replace: true });
      }, 500);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error details:', err.response?.data);
      
      const msg = getErrorMessage(err);
      showToast(msg, 'error');
      
      // Handle specific errors
      if (msg.includes('tidak ditemukan')) {
        setErrors({ email: msg });
      } else if (msg.includes('Password')) {
        setErrors({ password: msg });
      }
    } finally {
      setLoading(false);
      console.log('========================================');
      console.log('🏁 LOGIN FORM - Process completed');
      console.log('========================================');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h3>Selamat Datang Kembali! 👋</h3>
        <p>Silakan login untuk melanjutkan</p>
      </div>

      {/* Email Field */}
      <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
        <label htmlFor="email">Email</label>
        <div className="input-wrapper with-icon">
          <Mail size={20} className="input-icon" />
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
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <span className="error-message">
            <AlertCircle size={14} /> {errors.email}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
        <label htmlFor="password">Password</label>
        <div className="input-wrapper with-icon password-wrapper">
          <Lock size={20} className="input-icon" />
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
            autoComplete="current-password"
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
        {errors.password && (
          <span className="error-message">
            <AlertCircle size={14} /> {errors.password}
          </span>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="form-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <span>Ingat saya</span>
        </label>
        <Link to="/forgot-password" className="forgot-link">
          Lupa password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full submit-button"
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Login'}
      </Button>

      {/* Divider */}
      <div className="divider">
        <span>atau</span>
      </div>

      <div className="auth-footer">
        <p>Belum punya akun?</p>
        <Link to="/register" className="auth-link">Daftar sekarang</Link>
      </div>
    </form>
  );
};

export default LoginForm;