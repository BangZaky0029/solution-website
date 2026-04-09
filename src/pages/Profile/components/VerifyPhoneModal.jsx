import { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyPhoneModal = ({ isOpen, onClose, userPhone }) => {
  const { requestPhoneVerify, verifyPhoneOTP } = useAuth();
  const { showToast } = useToast();
  
  const [step, setStep] = useState(1); // 1: Input Phone, 2: Input OTP
  const [phone, setPhone] = useState(userPhone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!phone) return showToast('Nomor WhatsApp diperlukan', 'error');

    setLoading(true);
    setError('');
    try {
      const res = await requestPhoneVerify(phone);
      if (res.success) {
        showToast('✅ Kode OTP telah dikirim ke WhatsApp Anda', 'success');
        setStep(2);
        setCountdown(90);
      } else {
        setError(res.message || 'Gagal mengirim OTP');
        showToast(res.message || 'Gagal mengirim OTP', 'error');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim OTP');
      showToast('Terjadi kesalahan saat mengirim OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return showToast('Masukkan 6 digit kode OTP', 'error');

    setLoading(true);
    setError('');
    try {
      const res = await verifyPhoneOTP(phone, otp);
      if (res.success) {
        showToast('🎉 WhatsApp berhasil diverifikasi!', 'success');
        onClose();
      } else {
        setError(res.message || 'OTP tidak valid');
        showToast(res.message || 'OTP tidak valid', 'error');
      }
    } catch (err) {
      setError('Gagal memverifikasi OTP');
      showToast('Gagal memverifikasi OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Verifikasi WhatsApp</h3>
              <p className="text-xs text-gray-500 font-medium">Langkah keamanan ekstra</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6 text-center">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Fitur keamanan seperti reset password dan hapus akun memerlukan nomor WhatsApp yang terverifikasi.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nomor WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <MessageSquare size={18} />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ paddingLeft: '64px' }}
                        className="w-full pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium placeholder:text-gray-300"
                        placeholder="Contoh: 0812XXXXXXXX"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100 flex items-start gap-3 my-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <p className="font-medium leading-relaxed">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-lg shadow-blue-100"
                    loading={loading}
                  >
                    Kirim Kode OTP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6 text-center">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Kami telah mengirimkan 6 digit kode verifikasi ke nomor <span className="font-bold text-gray-800">+{phone}</span> via WhatsApp.
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 text-center block">Kode OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-5 bg-gray-50 border border-gray-200 rounded-2xl text-center text-3xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="000000"
                      disabled={loading}
                    />
                  </div>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-400">Resend tersedia dalam <span className="text-blue-500 font-bold">{countdown}s</span></p>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
                      >
                        Kirim Ulang Kode
                      </button>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 !bg-emerald-500 hover:!bg-emerald-600 border-none"
                    loading={loading}
                  >
                    Verifikasi Sekarang
                  </Button>
                  
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Bukan nomor Anda? Ganti Nomor
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">End-to-End Encrypted Verification</span>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPhoneModal;
