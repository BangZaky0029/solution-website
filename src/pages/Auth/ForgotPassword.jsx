// =========================================
// FILE: src/pages/Auth/ForgotPassword.jsx - NEW
// Forgot Password Page
// =========================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import { passwordService } from '../../services/passwordService';
import '../../styles/Style_forWebsite/Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request'); // request | verify | reset
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRequestOTP = async (phone) => {
    setLoading(true);
    try {
      const response = await passwordService.requestReset(phone);

      if (response.success) {
        setPhoneNumber(phone);
        setStep('verify');
        
        addToast(
          response.otpSent 
            ? '✅ Kode OTP telah dikirim ke WhatsApp Anda'
            : `⚠️ ${response.message}`,
          response.otpSent ? 'success' : 'warning',
          5000
        );
      } else {
        addToast(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan';
      addToast(`❌ ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    try {
      const response = await passwordService.verifyResetOTP(phoneNumber, otp);

      if (response.success) {
        setStep('reset');
        addToast('✅ OTP berhasil diverifikasi', 'success');
      } else {
        addToast(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP tidak valid';
      addToast(`❌ ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    setLoading(true);
    try {
      const response = await passwordService.resetPassword(phoneNumber, newPassword);

      if (response.success) {
        addToast('🎉 Password berhasil diubah!', 'success', 4000);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        addToast(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal reset password';
      addToast(`❌ ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await passwordService.resendResetOTP(phoneNumber);

      if (response.success) {
        addToast(
          response.otpSent 
            ? '✅ Kode OTP baru telah dikirim'
            : `⚠️ ${response.message}`,
          response.otpSent ? 'success' : 'warning',
          5000
        );
      } else {
        addToast(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengirim ulang OTP';
      addToast(`❌ ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            {step === 'request' && 'Lupa Password?'}
            {step === 'verify' && 'Verifikasi OTP'}
            {step === 'reset' && 'Buat Password Baru'}
          </h2>
          <p className="text-muted">
            {step === 'request' && 'Masukkan nomor WhatsApp terdaftar Anda'}
            {step === 'verify' && 'Masukkan kode OTP yang dikirim ke WhatsApp'}
            {step === 'reset' && 'Masukkan password baru Anda'}
          </p>
        </div>

        <ForgotPasswordForm
          step={step}
          loading={loading}
          phoneNumber={phoneNumber}
          onRequestOTP={handleRequestOTP}
          onVerifyOTP={handleVerifyOTP}
          onResetPassword={handleResetPassword}
          onResendOTP={handleResendOTP}
        />

        <div className="auth-footer">
          <p>Ingat password Anda?</p>
          <Link to="/login" className="auth-link">Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;