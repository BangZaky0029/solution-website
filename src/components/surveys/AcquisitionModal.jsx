// =========================================
// src/components/surveys/AcquisitionModal.jsx
// Modal for User Acquisition Source
// =========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Users,
  Instagram,
  Facebook,
  Video,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';
import surveyService from '../../services/surveyService';

const AcquisitionModal = ({ isOpen, onClose, onSuccess, skipCount, maxSkip = 3 }) => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sources = [
    { id: 'Google', label: 'Google Search', icon: <Search className="w-5 h-5" /> },
    { id: 'TikTok', label: 'TikTok', icon: <Video className="w-5 h-5" /> },
    { id: 'Instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" /> },
    { id: 'Facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
    { id: 'Friend', label: 'Rekomendasi Teman', icon: <Users className="w-5 h-5" /> },
    { id: 'Other', label: 'Lainnya', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await surveyService.submitAcquisition(selected);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      alert('Gagal mengirim data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const canSkip = skipCount < maxSkip;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Halo! Boleh nanya sesuatu?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Dari mana Anda mengetahui Nuansa Solution?
            </p>
          </div>
          {canSkip && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {sources.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                      ${selected === item.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}
                    `}
                  >
                    <div className={`${selected === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  disabled={!selected || loading}
                  onClick={handleSubmit}
                  className={`
                    w-full py-3 rounded-xl font-bold transition-all
                    ${selected && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  {loading ? 'Mengirim...' : 'Konfirmasi'}
                </button>

                {canSkip ? (
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Nanti Saja ({maxSkip - skipCount}x lagi boleh diskip)
                  </button>
                ) : (
                  <p className="text-[10px] text-center text-red-500 italic mt-2">
                    *Mohon diisi untuk dapat melanjutkan akses dashboard utama.
                  </p>
                )}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Terima Kasih!</h4>
              <p className="text-slate-500 text-sm mt-1">Data Anda membantu kami berkembang lebih baik.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AcquisitionModal;
