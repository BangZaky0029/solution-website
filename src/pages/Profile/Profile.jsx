
// =========================================
// FILE: src/pages/Profile/Profile.jsx - CLEANED & ENHANCED INVOICE
// =========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
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
  AlertCircle
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
      } catch (err) {
        console.error('Error fetching payments:', err);
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

  // ========================================
  // PROFESSIONAL INVOICE GENERATOR (PDF PRINT)
  // ========================================
  const handleDownloadInvoice = (payment) => {
    setDownloadingId(payment.id);
    
    const printWindow = window.open('', '_blank');
    
    // Path logo menggunakan URL absolut dari origin saat ini
    const logoUrl = `${window.location.origin}/NS_blank_02.png`;
    
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice #${payment.id} - Nuansa Solution</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 0; background: #fff; }
            .invoice-wrapper { padding: 50px; max-width: 800px; margin: 0 auto; position: relative; }
            
            /* KOP SURAT */
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 40px; }
            .brand-box { display: flex; flex-direction: column; gap: 10px; }
            .brand-box img { height: 70px; width: auto; object-fit: contain; }
            .company-details { text-align: right; }
            .company-details h2 { margin: 0; color: #2E8FE8; font-size: 22px; font-weight: 700; }
            .company-details p { margin: 2px 0; font-size: 12px; color: #64748b; line-height: 1.5; }
            
            /* INVOICE TITLE & INFO */
            .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .title-section h1 { margin: 0; font-size: 32px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: -1px; }
            .title-section p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
            
            .billing-info { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .info-card h3 { font-size: 12px; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; letter-spacing: 1px; }
            .info-card p { margin: 4px 0; font-size: 14px; line-height: 1.6; }
            .info-card strong { color: #0f172a; }

            /* TABLE STYLE */
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 12px 15px; text-align: left; border-top: 1px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; }
            td { padding: 18px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
            .text-right { text-align: right; }
            
            /* TOTALS */
            .summary-section { display: flex; justify-content: flex-end; }
            .total-table { width: 300px; }
            .total-table td { padding: 8px 15px; border: none; font-size: 14px; }
            .grand-total { border-top: 2px solid #2E8FE8 !important; }
            .grand-total td { padding-top: 15px; font-size: 18px; font-weight: 700; color: #2E8FE8; }

            /* STAMP */
            .stamp { position: absolute; top: 180px; right: 60px; border: 4px double #10b981; color: #10b981; font-weight: 800; font-size: 20px; padding: 8px 20px; border-radius: 8px; transform: rotate(-15deg); opacity: 0.3; text-transform: uppercase; }

            /* FOOTER */
            .footer { margin-top: 80px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; }
            .footer p { margin: 4px 0; font-size: 12px; color: #94a3b8; }
            .footer strong { color: #64748b; }

            @media print {
              body { padding: 0; }
              .invoice-wrapper { padding: 40px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <div class="stamp">Lunas / Verified</div>
            
            <div class="header">
              <div class="brand-box">
                <img src="${logoUrl}" alt="Nuansa Logo">
              </div>
              <div class="company-details">
                <h2>NUANSA SOLUTION</h2>
                <p>PT Nuansa Berkah Sejahtera</p>
                <p>Cibungbulang, Kab. Bogor, Jawa Barat</p>
                <p>www.nuansasolution.id</p>
                <p>support@nuansasolution.id</p>
              </div>
            </div>

            <div class="invoice-meta">
              <div class="title-section">
                <h1>Invoice</h1>
                <p>ID Transaksi: #${payment.id}</p>
              </div>
              <div style="text-align: right">
                <p style="margin:0; font-size: 14px; color: #64748b">Tanggal Terbit:</p>
                <p style="margin:0; font-size: 16px; font-weight: 600">${formatDate(payment.created_at)}</p>
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
                    <div style="font-weight: 600; margin-bottom: 4px;">Langganan Paket ${payment.package_name}</div>
                    <div style="font-size: 12px; color: #64748b">Akses penuh ke seluruh ekosistem fitur Gateway Nuansa Solution.</div>
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
                  <td>Pajak (PPN 0%)</td>
                  <td class="text-right">Rp 0</td>
                </tr>
                <tr class="grand-total">
                  <td>Total Bayar</td>
                  <td class="text-right">${formatCurrency(payment.amount)}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Terima kasih telah mempercayakan kebutuhan digital Anda kepada <strong>Nuansa Solution</strong>.</p>
              <p>Dokumen ini merupakan bukti pembayaran sah yang diterbitkan secara elektronik.</p>
            </div>
          </div>

          <script>
            window.onload = function() { 
              setTimeout(() => {
                window.print(); 
                window.onafterprint = () => window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    setDownloadingId(null);
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
                            <Download size={14} /> Invoice
                          </button>
                        ) : (
                          <span className="status-label pending">Proses</span>
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
