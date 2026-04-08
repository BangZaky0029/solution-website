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
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm relative overflow-hidden">
                {!isVerified && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center p-6">
                    <div className="text-center bg-white shadow-xl border border-gray-100 p-6 rounded-3xl max-w-xs animate-bounce-subtle">
                      <ShieldCheck size={32} className="mx-auto text-blue-500 mb-2" />
                      <p className="text-sm font-bold text-gray-900 mb-1">Fitur Keamanan Terkunci</p>
                      <p className="text-xs text-gray-500 mb-4">Verifikasi WhatsApp Anda untuk mengakses Reset Password dan Penghapusan Akun.</p>
                      <Button size="sm" onClick={() => setShowVerifyModal(true)} className="w-full text-xs py-2">Verifikasi Sekarang</Button>
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
            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 relative overflow-hidden">
                {!isVerified && <div className="absolute inset-0 bg-gray-50/40 backdrop-blur-[1px] z-10"></div>}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-red-700 font-bold mb-1">Hapus Akun</h3>
                            <p className="text-sm text-red-600/80 leading-relaxed">
                                Tindakan ini permanen dan tidak dapat dibatalkan.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="danger"
                        onClick={() => isVerified && setShowDeleteModal(true)}
                        className={`w-full md:w-auto hover:bg-red-600 hover:text-white transition-all shadow-sm rounded-xl px-6 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Hapus Akun
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
