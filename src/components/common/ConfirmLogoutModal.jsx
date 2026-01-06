// =========================================
// FILE: src/components/common/ConfirmLogoutModal.jsx
// =========================================

import { motion, AnimatePresence } from 'framer-motion';

const ConfirmLogoutModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2">
            Konfirmasi Logout
          </h3>

          <p className="text-gray-600 mb-6">
            Apakah kamu yakin ingin keluar dari akun ini?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="btn btn-outline"
            >
              Batal
            </button>

            <button
              onClick={onConfirm}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmLogoutModal;
