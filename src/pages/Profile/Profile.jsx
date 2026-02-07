
// =========================================
// FILE: src/pages/Profile/Profile.jsx - ENHANCED WITH CHAT ADMIN
// =========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import html2pdf from 'html2pdf.js';
import {
  getDaysRemaining,
  formatDate,
  getInitials,
  formatCurrency
} from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../services/api';
import '../../styles/Style_forWebsite/Profile.css';
import { mapFeatureIcon } from '../../utils/mapFeatureIcon';
import {
  Mail, Phone, Package, CreditCard,
  HelpCircle, ArrowRight, Download, Calendar,
  Clock, ShieldCheck, ExternalLink,
  AlertCircle, MessageCircle
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: userTokens, loading: tokensLoading } = useFetch('/users/tokens');
  const { packageInfo } = useFeatureAccess();
  const TOOL_BASE_URL = import.meta.env.VITE_TOOL_BASE_URL;

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [notification, setNotification] = useState(null);

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

  // ========================================
  // DIRECT PDF DOWNLOADER (AUTO DOWNLOAD)
  // ========================================
  const handleDownloadInvoice = (payment) => {
    setDownloadingId(payment.id);

    // Path logo menggunakan URL absolut dari origin saat ini
    const logoUrl = `${window.location.origin}/nuansaLogo.png`;

    const invoiceHTML = `
      <div style="font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; background: #fff; position: relative;">
          <style>
            .invoice-wrapper { position: relative; z-index: 1; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .brand-box img { height: 130px; width: auto; }
            .company-details { text-align: right; }
            .company-details h2 { margin: 0; color: #2E8FE8; font-size: 20px; font-weight: 700; }
            .company-details p { margin: 2px 0; font-size: 11px; color: #64748b; }
            
            .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .title-section h1 { margin: 0; font-size: 28px; font-weight: 700; color: #0f172a; text-transform: uppercase; }
            .title-section p { margin: 5px 0 0; color: #64748b; font-size: 12px; }
            
            .billing-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .info-card h3 { font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
            .info-card p { margin: 3px 0; font-size: 13px; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; color: #475569; font-size: 11px; text-transform: uppercase; padding: 10px; text-align: left; border-top: 1px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; }
            td { padding: 15px 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .text-right { text-align: right; }
            
            .summary-section { display: flex; justify-content: flex-end; }
            .total-table { width: 250px; }
            .total-table td { padding: 5px 10px; border: none; font-size: 13px; }
            .grand-total td { border-top: 2px solid #2E8FE8 !important; padding-top: 10px; font-size: 16px; font-weight: 700; color: #2E8FE8; }

            .stamp { 
              position: absolute; 
              top: 55%; 
              left: 50%; 
              transform: translate(-50%, -50%) rotate(-15deg); 
              border: 10px double #10b981; 
              color: #10b981; 
              font-weight: 900; 
              font-size: 64px; 
              padding: 20px 50px; 
              border-radius: 20px; 
              opacity: 0.1; 
              text-transform: uppercase; 
              white-space: nowrap;
              pointer-events: none;
              z-index: 0;
            }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; }
            .footer p { margin: 3px 0; font-size: 11px; color: #94a3b8; }
          </style>
          
          <div class="stamp">Lunas / Verified</div>
          
          <div class="invoice-wrapper">
            <div class="header">
              <div class="brand-box">
                <img src="${logoUrl}" alt="Nuansa Logo">
              </div>
              <div class="company-details">
                <h2>NUANSA SOLUTION</h2>
                <p>PT Nuansa Berkah Sejahtera</p>
                <p>Cibungbulang, Kab. Bogor, Jawa Barat</p>
                <p>www.nuansasolution.id</p>
              </div>
            </div>

            <div class="invoice-meta">
              <div class="title-section">
                <h1>Invoice</h1>
                <p>ID Transaksi: #${payment.id}</p>
              </div>
              <div style="text-align: right">
                <p style="margin:0; font-size: 12px; color: #64748b">Tanggal Terbit:</p>
                <p style="margin:0; font-size: 14px; font-weight: 600">${formatDate(payment.created_at)}</p>
              </div>
            </div>

            <div class="billing-info">
              <div class="info-card">
                <h3>Ditujukan Kepada:</h3>
                <p><strong>${user?.name}</strong></p>
                <p>${user?.email}</p>
                <p>${user?.phone || '-'}</p>
              </div>
              <div class="info-card">
                <h3>Metode Pembayaran:</h3>
                <p>Metode: <strong>${payment.method || 'Digital Payment'}</strong></p>
                <p>Status: <strong>Terverifikasi</strong></p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Deskripsi Layanan</th>
                  <th class="text-right">Durasi</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="font-weight: 600;">Langganan Paket ${payment.package_name}</div>
                    <div style="font-size: 11px; color: #64748b">Akses penuh ekosistem Gateway Nuansa Solution.</div>
                  </td>
                  <td class="text-right">${payment.duration_days || '-'} Hari</td>
                  <td class="text-right">${formatCurrency(payment.amount)}</td>
                </tr>
              </tbody>
            </table>

            <div class="summary-section">
              <table class="total-table">
                <tr>
                  <td>Subtotal</td>
                  <td class="text-right">${formatCurrency(payment.amount)}</td>
                </tr>
                <tr>
                  <td>Pajak (0%)</td>
                  <td class="text-right">Rp 0</td>
                </tr>
                <tr class="grand-total">
                  <td>Total Bayar</td>
                  <td class="text-right">${formatCurrency(payment.amount)}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Terima kasih telah menggunakan layanan <strong>Nuansa Solution</strong>.</p>
              <p>Dokumen ini adalah bukti pembayaran sah elektronik.</p>
            </div>
          </div>
      </div>
    `;

    // Konfigurasi html2pdf
    const options = {
      margin: 0,
      filename: `Invoice-${payment.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Buat elemen dummy di memori
    const container = document.createElement('div');
    container.innerHTML = invoiceHTML;

    // Eksekusi download
    html2pdf()
      .set(options)
      .from(container)
      .save()
      .then(() => {
        setDownloadingId(null);
        showToast('✅ Invoice berhasil diunduh');
      })
      .catch(() => {
        setDownloadingId(null);
        showToast('❌ Gagal mengunduh invoice', 'error');
      });
  };

  const handleOpenFeature = (feature) => {
    if (!feature?.code) {
      showToast('❌ Kode fitur tidak valid', 'error');
      return;
    }
    window.location.href = `${TOOL_BASE_URL}${feature.code}`;
  };

  if (tokensLoading || loadingPayments) return <LoadingSpinner />;

  return (
    <div className="profile-dashboard-wrapper animate-fade-in">
      {notification && (
        <div className={`custom-toast ${notification.type} animate-slide-down`}>
          {notification.message}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="profile-hero-section">
        <div className="container-max">
          <div className="dashboard-glass-card profile-main-header">
            <div className="profile-identity">
              <div className="profile-avatar-premium">
                {getInitials(user?.name || 'User')}
                <div className="online-indicator"></div>
              </div>
              <div className="profile-text-content">
                <h1>{user?.name}</h1>
                <div className="profile-meta-pills">
                  <div className="meta-pill"><Mail size={14} /> {user?.email}</div>
                  <div className="meta-pill"><Phone size={14} /> {user?.phone || 'No Phone'}</div>
                </div>
              </div>
            </div>
            <div className="profile-header-cta">
              <Button variant="primary" size="lg" className="pulse-btn" onClick={() => navigate('/payment')}>
                <ShieldCheck size={20} /> Upgrade Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="dashboard-content-section">
        <div className="container-max dashboard-grid">

          <div className="dashboard-main-area">
            {/* SUBSCRIPTION */}
            <div className="dashboard-card-refined subscription-card-premium">
              <div className="card-header-refined">
                <h3><Package size={20} /> Paket Aktif</h3>
                <span className="info-text-small">Kelola langganan Anda</span>
              </div>

              <div className="subscription-content">
                {userTokens && userTokens.length > 0 ? (
                  userTokens.filter(t => t.is_active === 1).map(token => {
                    const daysLeft = getDaysRemaining(token.expired_at);
                    const progress = Math.min(100, (daysLeft / 365) * 100);

                    return (
                      <div key={token.id} className="active-sub-item">
                        <div className="sub-branding">
                          <div className="sub-icon-box"><ShieldCheck size={32} /></div>
                          <div className="sub-info-main">
                            <h4>{token.package_name}</h4>
                            <p className="sub-expiry-text">Berakhir pada {formatDate(token.expired_at)}</p>
                          </div>
                          <div className="sub-status-badge">AKTIF</div>
                        </div>

                        <div className="sub-progress-area">
                          <div className="progress-labels">
                            <span>Masa Berlaku</span>
                            <span>{daysLeft} Hari Lagi</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>

                        <button className="extend-sub-link" onClick={() => navigate('/payment')}>
                          Perpanjang Masa Aktif <ArrowRight size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-sub-state">
                    <AlertCircle size={40} />
                    <p>Anda belum berlangganan paket apapun.</p>
                    <Button variant="outline" onClick={() => navigate('/payment')}>Lihat Paket Layanan</Button>
                  </div>
                )}
              </div>
            </div>

            {/* LAUNCHER */}
            <div className="dashboard-card-refined feature-launcher-card">
              <div className="card-header-refined">
                <h3><ShieldCheck size={20} /> Launcher Aplikasi</h3>
                <p className="section-subtitle">Klik fitur untuk mulai menggunakan</p>
              </div>

              {packageInfo?.active_features?.length > 0 ? (
                <div className="launcher-grid">
                  {packageInfo.active_features.map(feature => (
                    <div
                      key={feature.id}
                      className="launcher-item"
                      onClick={() => handleOpenFeature(feature)}
                    >
                      <div className="launcher-icon-circle">
                        {mapFeatureIcon(feature.code)}
                      </div>
                      <span className="launcher-name">{feature.name}</span>
                      <div className="launcher-hover-arrow"><ExternalLink size={12} /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="locked-features-state">
                  <div className="lock-icon-box">🔒</div>
                  <p>Fitur akan muncul di sini setelah Anda mengaktifkan paket Premium.</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDE AREA */}
          <div className="dashboard-side-area">
            <div className="dashboard-card-refined history-card-side">
              <div className="card-header-refined">
                <h3><CreditCard size={20} /> Riwayat Transaksi</h3>
              </div>

              <div className="history-timeline">
                {payments.length > 0 ? (
                  payments.slice(0, 4).map(payment => (
                    <div key={payment.id} className="timeline-item">
                      <div className="timeline-meta">
                        <p className="tm-package">{payment.package_name}</p>
                        <p className="tm-date">{formatDate(payment.created_at)}</p>
                      </div>
                      <div className="timeline-action">
                        <p className="tm-amount">{formatCurrency(payment.amount)}</p>
                        {payment.status === 'confirmed' ? (
                          <button
                            className="download-btn-mini"
                            onClick={() => handleDownloadInvoice(payment)}
                            disabled={downloadingId === payment.id}
                          >
                            <Download size={14} /> {downloadingId === payment.id ? 'Loading...' : 'Invoice'}
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2 items-end">
                            <span className="status-label pending">Proses</span>
                            <button
                              className="download-btn-mini"
                              style={{ borderColor: '#25D366', color: '#25D366' }}
                              onClick={() => handleChatAdmin(payment.id)}
                            >
                              <MessageCircle size={12} /> Chat Admin
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-history-text">Belum ada transaksi</p>
                )}
              </div>
            </div>

            <div className="premium-help-banner">
              <div className="help-icon-large">❓</div>
              <h4>Butuh Bantuan?</h4>
              <p>Alami kendala saat pembayaran atau akses fitur? Tim support kami siap membantu.</p>
              <div className="help-btn-group">
                <button className="help-btn white" onClick={() => navigate('/contact')}>Kontak CS</button>
                <button className="help-btn ghost" onClick={() => navigate('/faq')}>FAQ</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Profile;
