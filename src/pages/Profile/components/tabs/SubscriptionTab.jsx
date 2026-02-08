import { ShieldCheck, Package, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { getDaysRemaining, formatDate } from '../../../../utils/helpers';

const SubscriptionTab = ({ userTokens, navigate }) => {
    return (
        <div className="subscription-tab-content animate-fade-in">
            {/* Removed dashboard-card-refined wrapper as parent now handles card style */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package size={20} className="text-blue-600" /> Paket Aktif
                </h3>
                <p className="text-gray-500 text-sm mt-1">Daftar layanan premium yang sedang Anda gunakan.</p>
            </div>

            <div className="space-y-4">
                {userTokens && userTokens.length > 0 ? (
                    userTokens.filter(t => t.is_active === 1).map(token => {
                        const daysLeft = getDaysRemaining(token.expired_at);
                        const progress = Math.min(100, (daysLeft / 365) * 100);

                        return (
                            <div key={token.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"></div>
                                <div className="flex flex-col sm:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{token.package_name}</h4>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    AKTIF
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4 pl-14">
                                            Berakhir pada {formatDate(token.expired_at)}
                                        </p>

                                        <div className="pl-14">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Masa Berlaku</span>
                                                <span className="font-medium text-blue-600">{daysLeft} Hari Lagi</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={() => navigate('/pricing')}
                                            className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Perpanjang <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 px-4 rounded-3xl bg-gray-50 border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                            <Package size={40} opacity={0.8} />
                        </div>
                        <h4 className="text-gray-900 font-bold text-lg mb-2">Belum ada Paket Aktif</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                            Anda belum berlangganan layanan apapun. Mulai berlangganan untuk akses fitur premium.
                        </p>
                        <Button variant="primary" onClick={() => navigate('/pricing')} className="shadow-lg shadow-blue-200">
                            Lihat Paket Layanan
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionTab;
