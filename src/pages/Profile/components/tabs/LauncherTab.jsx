import { ShieldCheck, ExternalLink } from 'lucide-react';
import { mapFeatureIcon } from '../../../../utils/mapFeatureIcon';

const LauncherTab = ({ packageInfo, handleOpenFeature, TOOL_BASE_URL }) => {
    return (
        <div className="launcher-tab-content animate-fade-in">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600" /> Launcher Aplikasi
                </h3>
                <p className="text-gray-500 text-sm mt-1">Akses cepat ke aplikasi premium Anda.</p>
            </div>

            {packageInfo?.active_features?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {packageInfo.active_features.map(feature => (
                        <div
                            key={feature.id}
                            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1"
                            onClick={() => handleOpenFeature(feature)}
                        >
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {mapFeatureIcon(feature.code)}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm group-hover:text-indigo-700">{feature.name}</span>
                            <div className="text-gray-300 group-hover:text-indigo-400 transition-colors"><ExternalLink size={14} /></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-4 rounded-3xl bg-gray-50 border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="max-w-xs mx-auto">
                        <p className="text-gray-900 font-bold mb-1">Akses Terkunci</p>
                        <p className="text-gray-500 text-sm">
                            Fitur aplikasi akan muncul di sini setelah Anda memiliki paket aktif.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LauncherTab;
