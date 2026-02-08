// VerifyOTPPage - WhatsApp OTP Only Version
// OTP is sent via WhatsApp, so we don't display the code in UI

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/common/Button';
import { CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import '../styles/VerifyOTP.css';

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();
  const { showToast } = useToast();

  const { email, otpDuration = 300, userName, phone } = location.state || {};

  const [inputOtp, setInputOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(otpDuration);
  const [isExpired, setIsExpired] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      showToast('Sesi tidak valid. Silakan registrasi ulang.', 'error');
      navigate('/register');
    }
  }, [email, navigate, showToast]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
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

    setLoading(true);

    try {
      await verifyOTP(email, inputOtp);
      showToast('✅ Verifikasi berhasil! Silakan login.', 'success', 3000);

      if (location.state?.trialStatus === 'granted' && location.state?.trialPackage) {
        const { packageName, durationDays } = location.state.trialPackage;
        setTimeout(() => {
          showToast(`🎉 Trial berhasil diaktifkan: ${packageName} (${durationDays} hari)`, 'success', 5000);
        }, 500);
      } else if (location.state?.trialStatus === 'denied') {
        setTimeout(() => {
          showToast(`⚠️ Free Trial TIDAK DIAKTIFKAN karena akun Anda pernah dihapus sebelumnya.`, 'warning', 6000);
        }, 500);
      }

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      const message = error.response?.data?.message || 'Verifikasi gagal';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setResending(true);

    try {
      const response = await resendOTP(email);
      setInputOtp('');
      setTimeLeft(response.otpDuration || 300);
      setIsExpired(false);

      if (response.otpSent) {
        showToast('📱 OTP baru telah dikirim ke WhatsApp Anda!', 'success');
      } else {
        showToast('🎉 OTP baru telah dibuat! Cek WhatsApp Anda.', 'success');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengirim OTP';
      showToast(message, 'error');
    } finally {
      setResending(false);
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${seconds}s`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="whatsapp-badge">
            <MessageCircle size={32} />
          </div>
          <h1>Verifikasi OTP</h1>
          <p className="text-muted">
            Halo <strong>{userName || 'User'}</strong>!
          </p>
        </div>

        {/* WhatsApp Info Box */}
        <div className="otp-info-box">
          <div className="info-icon">
            <CheckCircle size={24} color="#22c55e" />
          </div>
          <div className="info-content">
            <p className="info-title">Kode OTP telah dikirim ke WhatsApp</p>
            <p className="info-phone">{phone || 'Nomor WhatsApp terdaftar'}</p>
          </div>
        </div>

        {/* Timer */}
        <div className={`otp-timer-box ${isExpired ? 'expired' : ''}`}>
          <Clock size={18} />
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
              autoComplete="one-time-code"
            />
            <p className="text-muted text-xs mt-2">
              Cek pesan WhatsApp Anda untuk kode OTP
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
            {resending ? 'Mengirim...' : 'Kirim Ulang OTP'}
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