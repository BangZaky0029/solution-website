import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CheckCircle, Loader2, Eye, EyeOff, Check, AlertCircle, Circle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../components/common/Button';

const SetupPasswordModal = ({ isOpen, onClose }) => {
    const { setupPassword } = useAuth();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Input, 2: Success

    // Password strength state
    const [strength, setStrength] = useState({
        score: 0, // 0-3
        label: 'Kosong',
        color: 'bg-gray-200',
        requirements: {
            length: false,
            number: false,
            special: false
        }
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setShowConfirmPassword(false);
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    const validatePassword = (pw) => {
        const requirements = {
            length: pw.length >= 8,
            number: /[0-9]/.test(pw),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pw)
        };

        let score = 0;
        if (requirements.length) score++;
        if (requirements.number) score++;
        if (requirements.special) score++;

        let label = 'Sangat Lemah';
        let color = 'bg-red-400';

        if (score === 1) {
            label = 'Lemah';
            color = 'bg-orange-400';
        } else if (score === 2) {
            label = 'Sedang';
            color = 'bg-amber-400';
        } else if (score === 3) {
            label = 'Kuat';
            color = 'bg-emerald-500';
        }

        if (pw.length === 0) {
            label = 'Kosong';
            color = 'bg-gray-200';
            score = 0;
        }

        setStrength({ score, label, color, requirements });
    };

    const isMatch = password && confirmPassword && password === confirmPassword;
    const canSubmit = strength.score >= 2 && isMatch && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (strength.score < 2) {
            return setError('Password terlalu lemah. Minimal memenuhi 2 kriteria.');
        }
        if (!isMatch) {
            return setError('Konfirmasi password tidak cocok');
        }

        setLoading(true);
        setError('');
        try {
            const res = await setupPassword(password);
            if (res.success) {
                setStep(2);
                showToast('🎉 Password berhasil dibuat!', 'success');
            } else {
                setError(res.message || 'Gagal membuat password');
                showToast(res.message || 'Gagal membuat password', 'error');
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-white/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Lock size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Keamanan Akun</h3>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Setup Password Manual</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 md:p-10">
                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center mb-2">
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Tambahkan password agar Anda dapat login langsung menggunakan email di masa mendatang.
                                    </p>
                                </div>

                                {/* Main Password */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password Baru</label>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${strength.color.replace('bg-', 'text-').replace('500', '600')} ${strength.color.replace('bg-', 'bg-')}/10`}>
                                            {strength.label}
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium transition-all"
                                            placeholder="Buat password kuat..."
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Strength Meter Bar */}
                                    <div className="flex gap-1.5 px-1 mt-2">
                                        {[1, 2, 3].map((lvl) => (
                                            <div
                                                key={lvl}
                                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${strength.score >= lvl ? strength.color : 'bg-gray-100'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Confirmation */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ulangi Password</label>
                                        {confirmPassword && (
                                            <span className={`text-[10px] font-bold flex items-center gap-1 ${isMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {isMatch ? <><Check size={10} strokeWidth={3} /> Cocok</> : <><X size={10} strokeWidth={3} /> Tidak Cocok</>}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${confirmPassword ? (isMatch ? 'text-emerald-500' : 'text-red-400') : 'text-gray-400 group-focus-within:text-blue-500'}`}>
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-11 pr-12 py-4 rounded-2xl outline-none font-medium transition-all border ${confirmPassword ? (isMatch ? 'bg-emerald-50/30 border-emerald-200 focus:ring-emerald-500' : 'bg-red-50/30 border-red-200 focus:ring-red-500') : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-blue-500'}`}
                                            placeholder="Ulangi password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Requirements List */}
                                <div className="grid grid-cols-2 gap-y-2 px-1 py-1">
                                    <div className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${strength.requirements.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {strength.requirements.length ? <Check size={12} strokeWidth={3} /> : <Circle size={12} strokeWidth={3} />}
                                        Min. 8 Karakter
                                    </div>
                                    <div className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${strength.requirements.number ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {strength.requirements.number ? <Check size={12} strokeWidth={3} /> : <Circle size={12} strokeWidth={3} />}
                                        Angka (0-9)
                                    </div>
                                    <div className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${strength.requirements.special ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {strength.requirements.special ? <Check size={12} strokeWidth={3} /> : <Circle size={12} strokeWidth={3} />}
                                        Simbol (!@#)
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
                                    >
                                        <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-red-600 font-bold leading-relaxed">{error}</p>
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    loading={loading}
                                    disabled={!canSubmit}
                                    className="w-full py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group transition-all"
                                >
                                    Selesaikan Pengaturan <CheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
                                </Button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-6"
                            >
                                <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-lg shadow-emerald-50">
                                    <CheckCircle size={48} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">Keamanan Ditingkatkan!</h4>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    Password Anda telah berhasil dibuat. Simpan baik-baik password ini untuk kenyamanan akses Akun Nuansa Anda.
                                </p>
                                <Button onClick={onClose} className="w-full py-4 rounded-2xl font-bold">
                                    Selesai
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SetupPasswordModal;

