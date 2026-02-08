import { Mail, Phone, KeyRound, ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { useToast } from '../../../../hooks/useToast';

const ProfileTab = ({ user, setShowResetModal, setShowDeleteModal, navigate }) => {
    const { showToast } = useToast();

    const handleComingSoon = () => {
        showToast('Fitur ini akan segera hadir!', 'info');
    };

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
                    <Button variant="outline" size="sm" onClick={handleComingSoon} className="text-xs px-3">
                        Ganti
                    </Button>
                </div>

                {/* WhatsApp */}
                <div className="flex justify-between items-center py-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">WhatsApp</p>
                        <p className="text-gray-900 font-medium">{user?.phone || '-'}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleComingSoon} className="text-xs px-3">
                        Ganti
                    </Button>
                </div>
            </div>

            {/* 2. KEAMANAN */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <KeyRound size={18} className="text-blue-500" /> Keamanan
                </h4>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-gray-900 font-bold text-sm">Kata Sandi</p>
                        <p className="text-xs text-gray-500 mt-1">Disarankan mengganti kata sandi secara berkala.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowResetModal(true)}
                        className="w-full sm:w-auto"
                    >
                        Reset Password
                    </Button>
                </div>
            </div>

            {/* 3. DANGER ZONE */}
            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6">
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
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full md:w-auto hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        Hapus Akun
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
