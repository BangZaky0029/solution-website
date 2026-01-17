// =========================================
// FILE: src/pages/Info/Contact.jsx
// =========================================

import '../../styles/Style_forWebsite/Info.css';

export const Contact = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container-max">
          <h1 className="info-hero-title">Hubungi Kami</h1>
          <p className="info-hero-subtitle">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
          </p>
        </div>
      </div>

      <div className="info-content">
        <div className="container-max">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Informasi Kontak</h2>
              
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>support@nuansasolution.id</p>
                  <p>info@nuansasolution.id</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+62 882-1372-8307</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🏢</div>
                <div>
                  <h4>Alamat</h4>
                  <p>PT Nuansa Berkah Sejahtera</p>
                  <p>Cibungbulang Town Hill Cluster Halimun <br /> Blok H7, Kab. Bogor 16630</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div>
                  <h4>Jam Operasional</h4>
                  <p>Senin - Jumat: 09:00 - 18:00 WIB</p>
                  <p>Sabtu: 09:00 - 15:00 WIB</p>
                  <p>Minggu: Tutup</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Kirim Pesan</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="john@example.com" />
                </div>

                <div className="form-group">
                  <label>Subjek</label>
                  <input type="text" placeholder="Pertanyaan tentang..." />
                </div>

                <div className="form-group">
                  <label>Pesan</label>
                  <textarea rows="5" placeholder="Tulis pesan Anda di sini..."></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}}>
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;