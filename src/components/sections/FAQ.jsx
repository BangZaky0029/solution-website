
import { useState } from 'react';
import { FAQ_DATA } from '../../utils/constants';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="faq-section-refined">
      <div className="container-max">
        <div className="section-header-refined">
          <span className="section-badge">Bantuan & Dukungan</span>
          <h2>Pertanyaan Yang Sering Diajukan</h2>
          <p>Temukan jawaban cepat untuk pertanyaan umum seputar layanan Gateway SOLUTION.</p>
        </div>

        <div className="faq-grid-refined">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id} 
                className={`faq-card-refined ${isOpen ? 'is-open' : ''}`}
              >
                <button 
                  className="faq-trigger" 
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question">{item.question}</span>
                  <div className="faq-icon-wrapper">
                    <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                  </div>
                </button>
                
                <div className={`faq-content-wrapper ${isOpen ? 'show' : ''}`}>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
