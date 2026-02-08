import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2, Check, ArrowRight } from 'lucide-react';
import api from '../../../services/api';
import Button from '../../../components/common/Button';

// Styling for OTP input
const otpInputStyle = "w-12 h-12 text-center text-xl font-bold border rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all";

const DeleteAccountModal = ({ isOpen, onClose, userPhone, onLogout }) => {
    const [step, setStep] = useState(1); // 1: Warning, 2: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOtp(['', '', '', '', '', '']);
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    // Timer countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleRequestOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/request-delete-otp');
            if (response.data.success) {
                setStep(2);
                setTimer(60); // 1 minute (User Request)
            } else {
                setError(response.data.message || 'Gagal mengirim OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan sistem');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleDeleteAccount = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Masukkan 6 digit kode OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/delete-account', { otp: otpCode });
            if (response.data.success) {
                onLogout(); // Force logout
            } else {
                setError(response.data.message || 'OTP Salah atau Kadaluarsa');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus akun');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-red-50 p-6 border-b border-red-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                            <AlertTriangle size={24} /> Hapus Akun Permanen
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 1 ? (
                            // Step 1: Warning
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm text-red-700">
                                    <p className="font-bold mb-2">⚠️ PERINGATAN KERAS!</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Semua data profil Anda akan dihapus permanen.</li>
                                        <li>Paket aktif Anda akan hangus.</li>
                                        <li>Riwayat transaksi tidak dapat dipulihkan.</li>
                                        <li>Akses ke Dashboard akan hilang selamanya.</li>
                                        <li className="font-bold text-red-800">Kuota Free Trial HANGUS (Tidak bisa klaim lagi di nomor yang sama).</li>
                                    </ul>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    Jika Anda yakin ingin melanjutkan, kami akan mengirimkan kode konfirmasi ke WhatsApp <strong>{userPhone}</strong>.
                                </p>

                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" onClick={onClose} className="w-full">
                                        Batal
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleRequestOTP}
                                        loading={loading}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Kirim Kode OTP <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Step 2: OTP
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h4 className="text-lg font-bold text-gray-800">Masukkan Kode Konfirmasi</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kode telah dikirim ke WhatsApp Anda.
                                    </p>
                                </div>

                                <div className="flex justify-center gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            className={otpInputStyle}
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                                        <AlertTriangle size={16} className="inline mr-2" />
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 mt-6">
                                    <Button
                                        variant="danger"
                                        onClick={handleDeleteAccount}
                                        loading={loading}
                                        disabled={otp.join('').length !== 6}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                                    >
                                        <Trash2 size={20} className="mr-2" /> HAPUS AKUN SELAMANYA
                                    </Button>

                                    <div className="text-center">
                                        {timer > 0 ? (
                                            <p className="text-xs text-gray-400">Kirim ulang dalam {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                                        ) : (
                                            <button
                                                onClick={handleRequestOTP}
                                                disabled={loading}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Kirim Ulang Kode
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                                    >
                                        Kembali
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteAccountModal;
