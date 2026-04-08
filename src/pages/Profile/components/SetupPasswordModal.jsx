import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
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
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Input, 2: Success

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setPassword('');
            setConfirmPassword('');
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || password.length < 6) {
            return setError('Password minimal 6 karakter');
        }
        if (password !== confirmPassword) {
            return setError('Konfirmasi password tidak cocok');
        }

        setLoading(true);
        setError('');
        try {
            const res = await setupPassword(password);
            if (res.success) {
                setStep(2);
                showToast('✅ Password berhasil dibuat!', 'success');
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setError(res.message || 'Gagal membuat password');
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
                    className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Buat Password Baru</h3>
                                <p className="text-xs text-gray-500 font-medium">Khusus Pengguna Google Login</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 md:p-10">
                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Sekarang Anda dapat menambahkan password ke akun Google Anda agar bisa login melalui Email & Password nantinya.
                                </p>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                            placeholder="Minimal 6 karakter"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                        placeholder="Ulangi password"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center border border-red-100 font-medium">
                                        {error}
                                    </div>
                                )}

                                <Button 
                                    type="submit" 
                                    loading={loading}
                                    className="w-full py-4 rounded-2xl font-bold shadow-lg shadow-blue-100"
                                >
                                    Siapkan Password Akun
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                    <CheckCircle size={40} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">Password Siap!</h4>
                                <p className="text-gray-500">Akun Anda sekarang lebih aman. Gunakan password ini untuk login manual di masa mendatang.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Keamanan Akun Terverifikasi</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SetupPasswordModal;
