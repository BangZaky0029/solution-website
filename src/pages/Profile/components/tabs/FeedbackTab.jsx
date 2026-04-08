// =========================================
// src/pages/Profile/components/tabs/FeedbackTab.jsx
// Tab for User Feedback & Acquisition Survey
// =========================================

import React, { useState, useEffect } from 'react';
import { Star, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import surveyService from '../../../../services/surveyService';

const FeedbackTab = ({ showToast }) => {
  const [status, setStatus] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await surveyService.getSurveyStatus();
      if (response.success) {
        setStatus(response.data);
        // If they already have feedback, show their previous rating? 
        // Backend doesn't return previous rating yet, let's just keep it fresh for now 
        // or we could update the surveyController to return it.
      }
    } catch (error) {
      console.error('Failed to fetch survey status', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0) return showToast('Pilih rating terlebih dahulu', 'error');

    setLoading(true);
    try {
      await surveyService.submitFeedback(rating, comment);
      showToast('Terima kasih! Feedback Anda telah terkirim.');
      setComment('');
      setRating(0);
      fetchStatus(); // Refresh the counter (X/3)
    } catch (error) {
      showToast('Gagal mengirim feedback', 'error');
    } finally {
      setLoading(false);
    }

  };

  const isLimitReached = status && status.feedbackCount >= 3;

  if (fetching) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* 1. Acquisition Survey Reminder (Banner) */}
      {status && !status.hasFilledAcquisition && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600">
            <HelpCircle size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-amber-900">Bantu kami berkembang!</h4>
            <p className="text-sm text-amber-700">Kami ingin tahu dari mana Anda mengenal Nuansa Solution. Isi survey singkat kami saat login berikutnya.</p>
          </div>
        </div>
      )}

      {/* 2. Feedback Form or Thank You Message */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        {isLimitReached ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Terima Kasih Banyak!</h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                Anda telah memberikan saran dan kritik sebanyak 3 kali. Kontribusi Anda sangat berarti dan telah kami catat untuk pengembangan layanan kedepannya.
              </p>
            </div>
            <div className="pt-4">
              <span className="inline-block px-4 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                Batas Feedback Tercapai
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 relative">
              <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg ring-1 ring-blue-100">
                Sisa Batas: {status?.feedbackCount || 0} / 3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Puas dengan layanan kami?</h3>
              <p className="text-gray-500">Rating dan saran Anda sangat berarti bagi pengembangan fitur-fitur baru di masa depan.</p>
            </div>


            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              {/* Stars */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform active:scale-90"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      size={40}
                      className={`transition-colors duration-200 ${
                        star <= (hover || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-medium text-gray-400">
                {rating > 0 ? (
                  <span className="text-blue-600">Terima kasih atas {rating} bintangnya!</span>
                ) : 'Klik bintang untuk memberi rating'}
              </p>

              {/* Comment */}
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700 ml-1">Saran & Kritik</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Apa yang bisa kami tingkatkan untuk Anda? (Opsional)"
                  maxLength={2000}
                  className="w-full h-32 p-4 pb-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none resize-none text-gray-700"
                />
                <div className="absolute bottom-3 right-4 text-[10px] font-medium text-gray-400">
                  <span className={comment.length >= 2000 ? 'text-red-500' : ''}>
                    {comment.length}
                  </span> / 2000 karakter
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || rating === 0}
                className={`
                  w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${rating > 0 && !loading
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                {loading ? 'Mengirim...' : (
                  <>
                    <Send size={18} /> Kirim Feedback
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Success indicator if they have already filled or just finished */}
      <div className="p-6 text-center border-t border-gray-100">
         <p className="text-xs text-gray-400">© 2026 Nuansa Solution Developer Team</p>
      </div>
    </div>

  );
};

export default FeedbackTab;
