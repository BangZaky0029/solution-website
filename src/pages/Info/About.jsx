// =========================================
// FILE: src/pages/Info/About.jsx
// =========================================

import '../../styles/Style_forWebsite/Info.css';

const About = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container-max">
          <h1 className="info-hero-title">Tentang Gateway NUANSA</h1>
          <p className="info-hero-subtitle">
            Platform pembayaran terpadu untuk akses tools dan features modern
          </p>
        </div>
      </div>

      <div className="info-content">
        <div className="container-max">
          <section className="info-section">
            <h2>Siapa Kami</h2>
            <p>
              Gateway NUANSA adalah platform inovatif yang dikembangkan oleh PT Nuansa Berkah Sejahtera 
              untuk memudahkan akses ke berbagai tools dan layanan digital. Kami berkomitmen untuk 
              menyediakan solusi pembayaran yang aman, mudah, dan terpercaya.
            </p>
          </section>

          <section className="info-section">
            <h2>Visi Kami</h2>
            <p>
              Menjadi platform pembayaran terpadu terdepan di Indonesia yang memberikan kemudahan 
              akses ke berbagai tools digital berkualitas tinggi untuk meningkatkan produktivitas 
              dan efisiensi bisnis.
            </p>
          </section>

          <section className="info-section">
            <h2>Misi Kami</h2>
            <ul className="info-list">
              <li>Menyediakan platform pembayaran yang aman dan mudah digunakan</li>
              <li>Mengintegrasikan berbagai tools digital dalam satu ekosistem</li>
              <li>Memberikan layanan pelanggan yang responsif dan berkualitas</li>
              <li>Terus berinovasi untuk memenuhi kebutuhan pengguna</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>Nilai-Nilai Kami</h2>
            <div className="info-values">
              <div className="info-value-card">
                <div className="info-value-icon">🛡️</div>
                <h3>Keamanan</h3>
                <p>Melindungi data dan transaksi pengguna dengan standar keamanan tertinggi</p>
              </div>
              <div className="info-value-card">
                <div className="info-value-icon">⚡</div>
                <h3>Inovasi</h3>
                <p>Terus berkembang dengan teknologi terbaru dan solusi terdepan</p>
              </div>
              <div className="info-value-card">
                <div className="info-value-icon">🤝</div>
                <h3>Kepercayaan</h3>
                <p>Membangun hubungan jangka panjang berdasarkan transparansi dan integritas</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>Kenapa Memilih Kami?</h2>
            <div className="info-features">
              <div className="info-feature-item">
                <span className="info-feature-icon">✓</span>
                <div>
                  <h4>Sistem Pembayaran Terpercaya</h4>
                  <p>Transaksi aman dengan berbagai metode pembayaran</p>
                </div>
              </div>
              <div className="info-feature-item">
                <span className="info-feature-icon">✓</span>
                <div>
                  <h4>Akses ke Berbagai Tools</h4>
                  <p>Ratusan tools profesional dalam satu platform</p>
                </div>
              </div>
              <div className="info-feature-item">
                <span className="info-feature-icon">✓</span>
                <div>
                  <h4>Support 24/7</h4>
                  <p>Tim customer service siap membantu kapan saja</p>
                </div>
              </div>
              <div className="info-feature-item">
                <span className="info-feature-icon">✓</span>
                <div>
                  <h4>Harga Kompetitif</h4>
                  <p>Paket berlangganan yang fleksibel dan terjangkau</p>
                </div>
              </div>
            </div>
          </section>

          <section className="info-cta">
            <h2>Siap Bergabung?</h2>
            <p>Mulai perjalanan Anda bersama Gateway NUANSA hari ini</p>
            <div className="info-cta-buttons">
              <a href="/login" className="btn btn-primary btn-lg">
                Daftar Sekarang
              </a>
              <a href="/contact" className="btn btn-outline btn-lg">
                Hubungi Kami
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;