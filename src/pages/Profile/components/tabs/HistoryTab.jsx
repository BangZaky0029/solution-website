import { CreditCard, Download, MessageCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '../../../../utils/helpers';

const HistoryTab = ({ payments, handleDownloadInvoice, handleChatAdmin, downloadingId }) => {
    return (
        <div className="history-tab-content animate-fade-in">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-600" /> Riwayat Transaksi
                </h3>
            </div>

            <div className="space-y-4">
                {payments.length > 0 ? (
                    payments.map(payment => (
                        <div key={payment.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900">{payment.package_name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                        ${payment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {payment.status === 'confirmed' ? 'LUNAS' : 'PROSES'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs">{formatDate(payment.created_at)}</p>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>

                                {payment.status === 'confirmed' ? (
                                    <button
                                        onClick={() => handleDownloadInvoice(payment)}
                                        disabled={downloadingId === payment.id}
                                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <Download size={14} />
                                        {downloadingId === payment.id ? 'Loading...' : 'Invoice'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleChatAdmin(payment.id)}
                                        className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors border border-green-200"
                                    >
                                        <MessageCircle size={14} /> Chat Admin
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CreditCard size={24} className="opacity-50" />
                        </div>
                        <p className="text-sm">Belum ada riwayat transaksi</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryTab;
