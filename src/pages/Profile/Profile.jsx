// =========================================
// FILE: src/pages/Profile/Profile.jsx - REFACTORED (Tabbed UI)
// =========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import '../../styles/Style_forWebsite/Profile.css';
import {
  User, Package, ShieldCheck, CreditCard, Menu, X, Mail, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Tab Components
import ProfileTab from './components/tabs/ProfileTab';
import SubscriptionTab from './components/tabs/SubscriptionTab';
import LauncherTab from './components/tabs/LauncherTab';
import HistoryTab from './components/tabs/HistoryTab';

// Import Modals (still needed at top level for state uplifting if desired, or passed down)
import ResetPasswordModal from './components/ResetPasswordModal';
import DeleteAccountModal from './components/DeleteAccountModal';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { data: userTokens, loading: tokensLoading } = useFetch('/users/tokens');
  const { packageInfo } = useFeatureAccess();
  const TOOL_BASE_URL = import.meta.env.VITE_TOOL_BASE_URL;

  const [activeTab, setActiveTab] = useState('profile');
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await api.get('/payment/user/payments');
        if (response.data.success) {
          setPayments(response.data.data || []);
        }
      } catch {
        // silent error
      } finally {
        setLoadingPayments(false);
      }
    };
    if (isAuthenticated) fetchPayments();
  }, [isAuthenticated]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChatAdmin = (paymentId) => {
    const phoneNumber = '6288294096100';
    const message = encodeURIComponent(
      `Halo Admin Nuansa SOLUTION,\n\nSaya ingin konfirmasi pembayaran saya yang sedang dalam proses. \n\n🆔 *ID Transaksi:* #${paymentId}\n\nMohon bantuannya untuk dipercepat aktivasinya. Terima kasih!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleDownloadInvoice = (payment) => {
    setDownloadingId(payment.id);
    const logoUrl = `${window.location.origin}/nuansaLogo.png`;

    const invoiceHTML = `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; background: #fff; position: relative;">
          <style>
             /* ... (Keep existing invoice styles) ... */
             .invoice-wrapper { position: relative; z-index: 1; }
             .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
             .brand-box img { height: 130px; width: auto; }
             /* Simplified for brevity in this refactor, but kept structure */
             .company-details { text-align: right; }
             .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
             table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
             th { background: #f8fafc; padding: 10px; text-align: left; }
             td { padding: 15px 10px; border-bottom: 1px solid #f1f5f9; }
             .text-right { text-align: right; }
             .grand-total td { font-weight: 700; color: #2E8FE8; font-size: 16px; }
             .stamp { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); border: 5px solid #10b981; color: #10b981; font-size: 48px; font-weight: bold; opacity: 0.1; padding: 10px 40px; border-radius: 10px; }
          </style>
          
          <div class="stamp">LUNAS</div>
          <div class="invoice-wrapper">
            <div class="header">
               <div class="brand-box"><img src="${logoUrl}" /></div>
               <div class="company-details">
                 <h2>NUANSA SOLUTION</h2>
                 <p>PT Nuansa Berkah Sejahtera</p>
               </div>
            </div>
            <div class="invoice-meta">
               <div><h1>INVOICE</h1><p>#${payment.id}</p></div>
               <div style="text-align:right"><p>${formatDate(payment.created_at)}</p></div>
            </div>
            
             <div style="margin-bottom: 30px;">
               <p><strong>Kepada:</strong> ${user?.name}</p>
               <p>${user?.email}</p>
             </div>

            <table>
              <thead><tr><th>Deskripsi</th><th class="text-right">Harga</th></tr></thead>
              <tbody>
                <tr>
                   <td>Langganan ${payment.package_name} (${payment.duration_days} Hari)</td>
                   <td class="text-right">${formatCurrency(payment.amount)}</td>
                </tr>
              </tbody>
              <tfoot>
                 <tr class="grand-total"><td>Total</td><td class="text-right">${formatCurrency(payment.amount)}</td></tr>
              </tfoot>
            </table>
          </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = invoiceHTML;

    html2pdf().from(container).save(`Invoice-${payment.id}.pdf`)
      .then(() => { setDownloadingId(null); showToast('✅ Invoice berhasil diunduh'); })
      .catch(() => { setDownloadingId(null); showToast('❌ Gagal download', 'error'); });
  };

  const handleOpenFeature = (feature) => {
    if (!feature?.code) return showToast('❌ Kode fitur tidak valid', 'error');
    window.location.href = `${TOOL_BASE_URL}${feature.code}`;
  };

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: <User size={18} /> },
    { id: 'subscription', label: 'Paket Aktif', icon: <Package size={18} /> },
    { id: 'launcher', label: 'Launcher', icon: <ShieldCheck size={18} /> },
    { id: 'history', label: 'Riwayat', icon: <CreditCard size={18} /> },
  ];

  if (tokensLoading || loadingPayments) return <LoadingSpinner />;

  return (
    <div className="profile-dashboard-wrapper animate-fade-in min-h-screen bg-gray-50/50">
      {notification && (
        <div className={`custom-toast ${notification.type} animate-slide-down`}>
          {notification.message}
        </div>
      )}

      <div className="container-max mx-auto px-6 !pt-24 mt-10 pb-12 md:pt-40 md:mt-0 md:pb-24 max-w-md md:max-w-6xl">

        {/* 1. HERO SECTION (Refactored for Clean Mobile Look) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 text-center md:text-left relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>

            {/* Text Content */}
            <div className="flex-1 w-full">
              <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">{user?.name}</h1>

              {/* Clean Contact Info (No Pills) */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="leading-none">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="leading-none">{user?.phone}</span>
                  </div>
                )}
              </div>

              {/* Stacked Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {/* Check if user has active subscription */}
                {userTokens && userTokens.some(t => t.is_active === 1) ? (
                  <button
                    className="w-full md:w-auto px-6 py-3 bg-green-100 text-green-700 rounded-2xl font-bold shadow-sm cursor-default flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} /> Subscriber
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-blue-200 shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Upgrade Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>

        {/* 2. MOBILE TABS (Text + Underline Style) */}
        <div className="md:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-md -mx-6 px-6 pt-0 pb-0 mb-8 border-b border-gray-100">
          <div className="flex justify-between overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2 py-4 text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-500 hover:text-gray-800'}`}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* 3. DESKTOP SIDEBAR TABS */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sticky top-32">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0">
            <div className="animate-fade-in bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">

              {activeTab === 'profile' && (
                <ProfileTab
                  user={user}
                  setShowResetModal={setShowResetModal}
                  setShowDeleteModal={setShowDeleteModal}
                  navigate={navigate}
                />
              )}

              {activeTab === 'subscription' && (
                <SubscriptionTab
                  userTokens={userTokens}
                  navigate={navigate}
                />
              )}

              {activeTab === 'launcher' && (
                <LauncherTab
                  packageInfo={packageInfo}
                  handleOpenFeature={handleOpenFeature}
                  TOOL_BASE_URL={TOOL_BASE_URL}
                />
              )}

              {activeTab === 'history' && (
                <HistoryTab
                  payments={payments}
                  handleDownloadInvoice={handleDownloadInvoice}
                  handleChatAdmin={handleChatAdmin}
                  downloadingId={downloadingId}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* MODALS */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        userPhone={user?.phone}
        user={user}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userPhone={user?.phone}
        onLogout={logout}
      />

    </div>
  );
};

export default Profile;
