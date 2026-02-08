import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, CheckCircle, Smartphone, ArrowRight, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import '../../../styles/Style_forWebsite/Auth.css'; // Reuse Auth styles for consistency

const ResetPasswordModal = ({ isOpen, onClose, userPhone, user }) => {
    const [step, setStep] = useState(1); // 1: Confirm, 2: OTP, 3: New Password, 4: Success
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    // Timer for Resend OTP
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/password/forgot', { phone: userPhone });
            if (response.data.success) {
                setStep(2);
                setResendTimer(60); // 60 seconds cooldown
            } else {
                setError(response.data.message || 'Gagal mengirim OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengirim OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        setError('');
        try {
            // Use the specific Resend endpoint or logic
            const response = await api.post('/password/resend-otp', { phone: userPhone });
            if (response.data.success) {
                setResendTimer(60);
            } else {
                setError(response.data.message || 'Gagal mengirim ulang OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim ulang OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setError('Masukkan kode OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/password/verify-reset-otp', { phone: userPhone, otp });
            if (response.data.success) {
                setStep(3);
            } else {
                setError(response.data.message || 'OTP tidak valid');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verifikasi OTP gagal');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 8) {
            setError('Password minimal 8 karakter');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Konfirmasi password tidak cocok');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/password/reset', { phone: userPhone, newPassword });
            if (response.data.success) {
                setStep(4);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setError(response.data.message || 'Gagal mengubah password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score += 1;
        if (pass.match(/[A-Z]/)) score += 1;
        if (pass.match(/[0-9]/)) score += 1;
        if (pass.match(/[^A-Za-z0-9]/)) score += 1;
        return score; // 0-4
    };

    const strength = getPasswordStrength(newPassword);

    const getStrengthLabel = (score) => {
        switch (score) {
            case 0: return { label: 'Lemah', color: 'bg-gray-200', text: 'text-gray-400' };
            case 1: return { label: 'Lemah', color: 'bg-red-500', text: 'text-red-500' };
            case 2: return { label: 'Sedang', color: 'bg-yellow-500', text: 'text-yellow-500' };
            case 3: return { label: 'Kuat', color: 'bg-blue-500', text: 'text-blue-500' };
            case 4: return { label: 'Sangat Kuat', color: 'bg-green-500', text: 'text-green-500' };
            default: return { label: '', color: 'bg-gray-200', text: 'text-gray-400' };
        }
    };

    const strengthInfo = getStrengthLabel(strength);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                >
                    {/* Header - Minimalist */}
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 backdrop-blur rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 pt-10">
                        {step === 1 && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-sm border border-blue-100">
                                    <Smartphone size={40} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Lupa Password?</h4>
                                    <p className="text-gray-500 leading-relaxed">
                                        Jangan khawatir. Kami akan mengirimkan kode verifikasi (OTP) ke WhatsApp Anda.
                                    </p>
                                    <div className="mt-6 py-3 px-5 bg-blue-50 border border-blue-100 rounded-xl inline-flex items-center gap-2 text-blue-800 font-medium">
                                        <Smartphone size={16} />
                                        {userPhone}
                                    </div>
                                </div>

                                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center gap-2 border border-red-100"><span className="font-bold">!</span> {error}</div>}

                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Kirim Kode OTP'}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi OTP</h4>
                                    <p className="text-gray-500">Masukkan 6 digit kode yang dikirim ke <span className="font-semibold text-gray-700">{userPhone}</span></p>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="000 000"
                                            className="w-full h-16 text-center text-3xl font-bold tracking-[0.5em] text-gray-800 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-300 bg-gray-50 focus:bg-white"
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </div>

                                    {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center border border-red-100">{error}</div>}

                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otp.length < 6}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Verifikasi'}
                                    </button>

                                    <div className="text-center">
                                        <button
                                            onClick={handleResendOTP}
                                            disabled={resendTimer > 0 || loading}
                                            className="text-sm font-medium text-gray-500 disabled:opacity-50 hover:text-blue-600 transition-colors"
                                        >
                                            {resendTimer > 0 ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 size={14} className="animate-spin" /> Kirim ulang dalam {resendTimer}s
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1">
                                                    Tidak menerima kode? <span className="text-blue-600 font-semibold">Kirim Ulang</span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h4>
                                    <p className="text-gray-500">Buat password baru yang kuat untuk akun Anda.</p>
                                </div>

                                <div className="space-y-5">
                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Password Baru</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                className="w-full !pl-14 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800 font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        {/* Strength Meter */}
                                        {newPassword && (
                                            <div className="flex items-center gap-3 mt-2 px-1">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                                                        style={{ width: `${(strength / 4) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Konfirmasi Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <CheckCircle size={20} />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Ulangi password baru"
                                                className="w-full !pl-14 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800 font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl flex items-center gap-2 border border-red-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                                        {error}
                                    </div>}

                                    <button
                                        onClick={handleResetPassword}
                                        disabled={loading || strength < 2 || newPassword !== confirmPassword}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-200 hover:shadow-green-300 flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Simpan Password Baru'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center py-10 animate-fade-in">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                                >
                                    <CheckCircle size={48} className="text-green-600" />
                                </motion.div>
                                <h4 className="text-3xl font-bold text-gray-800 mb-2">Sukses!</h4>
                                <p className="text-gray-500 text-lg">Password Anda telah berhasil diperbarui.</p>
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-400">Modal akan tertutup otomatis...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ResetPasswordModal;
