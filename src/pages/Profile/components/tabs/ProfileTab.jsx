import { Mail, Phone, KeyRound, ShieldCheck, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { useToast } from '../../../../hooks/useToast';

const ProfileTab = ({ user, setShowResetModal, setShowDeleteModal, setShowVerifyModal, navigate }) => {
    const { showToast } = useToast();

    const handleComingSoon = () => {
        showToast('Fitur ini akan segera hadir!', 'info');
    };

    const isVerified = user?.is_phone_verified === 1;
    const hasPassword = !!user?.password;

    return (
        <div className="profile-tab-content animate-fade-in">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pengaturan Akun</h3>
                <p className="text-gray-500 text-sm">Kelola informasi pribadi dan keamanan akun Anda.</p>
            </div>

            {/* 1. INFORMASI PRIBADI */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-500" /> Informasi Pribadi
                </h4>

                {/* Email */}
                <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="flex justify-between items-center py-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">WhatsApp</p>
                            {isVerified ? (
                                <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                    <CheckCircle2 size={10} /> Terverifikasi
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                    <AlertCircle size={10} /> Belum Terverifikasi
                                </span>
                            )}
                        </div>
                        <p className="text-gray-900 font-medium">{user?.phone || '-'}</p>
                    </div>
                    <Button variant={isVerified ? "outline" : "primary"} size="sm" onClick={() => setShowVerifyModal(true)} className="text-xs px-4 rounded-xl">
                        {isVerified ? "Ganti" : "Verifikasi Sekarang"}
                    </Button>
                </div>
            </div>

            {/* 2. KEAMANAN */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 mb-6 shadow-sm relative overflow-hidden group">
                {!isVerified && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="text-center bg-white/95 shadow-2xl border border-blue-50 p-6 md:p-8 rounded-[32px] max-w-[280px] md:max-w-xs transform transition-transform group-hover:scale-[1.02]">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm border border-blue-100">
                        <ShieldCheck size={32} />
                      </div>
                      <h5 className="text-base font-bold text-gray-900 mb-2">Fitur Keamanan Terkunci</h5>
                      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                        Verifikasi WhatsApp Anda untuk membuka akses **Reset Password** dan **Penghapusan Akun**.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => setShowVerifyModal(true)} 
                        className="w-full py-3 text-xs font-bold rounded-xl shadow-lg shadow-blue-100"
                      >
                        Verifikasi Sekarang
                      </Button>
                    </div>
                  </div>
                )}

                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <KeyRound size={18} className="text-blue-500" /> Keamanan
                </h4>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-gray-900 font-bold text-sm">
                          {hasPassword ? "Reset Password" : "Buat Password Akun"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hasPassword 
                            ? "Disarankan mengganti kata sandi secara berkala." 
                            : "Akun Google Anda belum memiliki password manual."}
                        </p>
                    </div>
                    <Button
                        variant={hasPassword ? "outline" : "primary"}
                        onClick={() => hasPassword ? setShowResetModal(true) : setShowSetupModal(true)}
                        className="w-full sm:w-auto rounded-xl px-6"
                    >
                        {hasPassword ? "Reset Password" : "Mulai Buat Password"}
                    </Button>
                </div>
            </div>

            {/* 3. DANGER ZONE */}
            <div className="bg-red-50/30 rounded-[32px] border border-red-100 p-6 md:p-8 relative overflow-hidden group">
                {!isVerified && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10"></div>}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-sm">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-red-700 font-bold mb-1 text-base">Hapus Akun</h3>
                            <p className="text-xs text-red-600/70 leading-relaxed max-w-sm">
                                Tindakan ini bersifat permanen. Seluruh data, histori, dan paket aktif Anda akan dihapus selamanya.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="danger"
                        onClick={() => isVerified && setShowDeleteModal(true)}
                        className={`w-full md:w-auto hover:bg-red-600 hover:text-white transition-all shadow-md rounded-xl px-8 font-bold text-sm ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Hapus Akun
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
