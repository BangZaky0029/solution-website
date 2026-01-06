// =========================================
// FILE: src/components/sections/FAQ.jsx
// =========================================

import { useState } from 'react';
import { FAQ_DATA } from '../../utils/constants';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="faq-section">
      <div className="text-center mb-16 animate-fade-in">
        <h2>Pertanyaan Yang Sering Diajukan</h2>
        <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
          Temukan jawaban untuk pertanyaan umum tentang Gateway APTO
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {FAQ_DATA.map((item) => (
          <div key={item.id} className="faq-item animate-slide-up">
            <div
              className="faq-header"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <h4 className="font-semibold text-dark">{item.question}</h4>
              <span className={`transition ${openId === item.id ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>

            {openId === item.id && (
              <div className="faq-content animate-slide-up">
                <p className="text-muted">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
