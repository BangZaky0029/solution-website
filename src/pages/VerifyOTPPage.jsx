// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\pages\VerifyOTPPage.jsx
// COMPLETE VERSION - OTP Display dengan Debug

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import { CheckCircle, Copy, Clock, AlertCircle, Shield } from 'lucide-react';
import '../styles/VerifyOTP.css';

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();
  const { showToast } = useToast();

  // Get data from navigation state
  const { email, otp: initialOtp, otpDuration = 30, userName } = location.state || {};

  // 🔥 DEBUG - Cek data yang diterima
  useEffect(() => {
    console.log('========================================');
    console.log('🔍 DEBUG - VerifyOTPPage State:');
    console.log('📧 Email:', email);
    console.log('🔐 OTP:', initialOtp);
    console.log('⏱️ Duration:', otpDuration);
    console.log('👤 Name:', userName);
    console.log('📦 Full State:', location.state);
    console.log('========================================');
  }, [location.state]);

  const [otp, setOtp] = useState(initialOtp || '');
  const [inputOtp, setInputOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(otpDuration);
  const [isExpired, setIsExpired] = useState(false);

  // Redirect jika tidak ada email
  useEffect(() => {
    if (!email) {
      console.error('❌ Email tidak ditemukan! Redirect ke register...');
      showToast('Sesi tidak valid. Silakan registrasi ulang.', 'error');
      navigate('/register');
    }
  }, [email, navigate, showToast]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      console.log('⏰ OTP EXPIRED!');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Copy OTP ke clipboard
  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      showToast('✅ OTP berhasil disalin!', 'success');
      console.log('📋 OTP copied:', otp);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('❌ Failed to copy OTP:', error);
      showToast('Gagal menyalin OTP', 'error');
    }
  };

  // Handle Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!inputOtp) {
      showToast('Masukkan kode OTP', 'error');
      return;
    }

    if (inputOtp.length !== 6) {
      showToast('OTP harus 6 digit', 'error');
      return;
    }

    if (isExpired) {
      showToast('OTP sudah kadaluarsa. Silakan minta OTP baru.', 'error');
      return;
    }

    console.log('🔐 Verifying OTP:', inputOtp);
    setLoading(true);
    
    try {
      await verifyOTP(email, inputOtp);
      console.log('✅ OTP Verification SUCCESS!');
      showToast('✅ Verifikasi berhasil! Silakan login.', 'success', 3000);

        if (location.state?.trialPackage) {
            const { packageName, durationDays } = location.state.trialPackage;
            setTimeout(() => {
                showToast(`🎉 Trial berhasil diaktifkan: ${packageName} (${durationDays} hari)`, 'success', 5000);
            }, 500);
        }

        // navigasi setelah toast muncul
        setTimeout(() => {
            navigate('/login');
        }, 2000); // 0.5s delay + 5s toast

    } catch (error) {
      console.error('❌ OTP Verification FAILED:', error);
      const message = error.response?.data?.message || 'Verifikasi gagal';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    console.log('🔄 Resending OTP for:', email);
    setResending(true);
    
    try {
      const response = await resendOTP(email);
      console.log('✅ Resend OTP SUCCESS:', response);
      
      // Update OTP baru
      setOtp(response.otp);
      setInputOtp('');
      setTimeLeft(response.otpDuration || 30);
      setIsExpired(false);
      
      showToast('🎉 OTP baru telah dibuat!', 'success');
    } catch (error) {
      console.error('❌ Resend OTP FAILED:', error);
      const message = error.response?.data?.message || 'Gagal mengirim OTP';
      showToast(message, 'error');
    } finally {
      setResending(false);
    }
  };

  // Format waktu countdown
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  // Jika tidak ada OTP dari backend (fallback)
  if (!otp && email) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Shield size={48} color="#ef4444" />
            <h1>OTP Tidak Ditemukan</h1>
            <p className="text-muted">
              Sepertinya ada masalah saat mendapatkan OTP dari server.
            </p>
          </div>

          <div className="alert alert-warning">
            <AlertCircle size={20} />
            <div>
              <strong>Debug Info:</strong>
              <ul>
                <li>Email: {email || 'Tidak ada'}</li>
                <li>OTP: {initialOtp || 'Tidak diterima dari backend'}</li>
                <li>State: {JSON.stringify(location.state)}</li>
              </ul>
            </div>
          </div>

          <button onClick={handleResend} className="btn-primary" disabled={resending}>
            {resending ? 'Mengirim...' : 'Minta OTP Baru'}
          </button>

          <div className="auth-footer">
            <Link to="/register" className="auth-link">← Kembali ke Registrasi</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Verifikasi OTP</h1>
          <p className="text-muted">
            Halo <strong>{userName || 'User'}</strong>, kode OTP Anda telah dibuat
          </p>
        </div>

        {/* 🔥 OTP Display Box - INI YANG PENTING */}
        <div className="otp-display-box">
          <div className="otp-header">
            <Clock size={20} />
            <span>Kode OTP Anda</span>
          </div>
          
          <div className="otp-code-container">
            <div className={`otp-code ${isExpired ? 'expired' : ''}`}>
              {otp || '******'}
            </div>
            
            {!isExpired && (
              <button
                onClick={handleCopyOTP}
                className="copy-button"
                disabled={!otp}
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied ? 'Disalin!' : 'Salin'}
              </button>
            )}
          </div>

          {/* Timer */}
          <div className={`otp-timer ${isExpired ? 'expired' : ''}`}>
            <Clock size={16} />
            <span>
              {isExpired ? 'OTP Kadaluarsa' : `Berlaku ${formatTime(timeLeft)}`}
            </span>
          </div>

          {isExpired && (
            <div className="otp-expired-alert">
              <AlertCircle size={16} />
              <span>OTP telah kadaluarsa. Silakan minta OTP baru.</span>
            </div>
          )}
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp">Masukkan Kode OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Masukkan 6 digit OTP"
              maxLength="6"
              disabled={loading || isExpired}
              className="otp-input"
              autoFocus
            />
            <p className="text-muted text-xs mt-2">
              Salin kode OTP di atas atau ketik manual
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading || isExpired || !inputOtp}
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
          </Button>
        </form>

        {/* Resend OTP */}
        <div className="resend-section">
          <p>Tidak menerima OTP atau sudah kadaluarsa?</p>
          <button
            onClick={handleResend}
            className="resend-button"
            disabled={resending}
          >
            {resending ? 'Mengirim...' : 'Minta OTP Baru'}
          </button>
        </div>

        <div className="auth-footer">
          <Link to="/register" className="auth-link">← Kembali ke Registrasi</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;