// =========================================
// FILE: src/utils/constants.js
// =========================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Gateway APTO';

// PAYMENT METHODS
export const PAYMENT_METHODS = {
  BCA: 'BCA',
  QRIS: 'QRIS',
};

// PAYMENT STATUS
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

// SUBSCRIPTION STATUS
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  NONE: 'none',
};

// FAQ DATA
export const FAQ_DATA = [
  {
    id: 1,
    question: 'Apa itu Gateway SOLUTION?',
    answer: 'Gateway SOLUTION adalah platform pembayaran terpadu yang memudahkan pengguna untuk mengakses berbagai tools dan features dengan sistem berlangganan.',
  },
  {
    id: 2,
    question: 'Bagaimana cara mendaftar?',
    answer: 'Anda dapat mendaftar melalui halaman Register dengan mengisi email, nama, dan password. Kemudian verifikasi OTP yang dikirim ke nomor WhatsApp Anda.',
  },
  {
    id: 3,
    question: 'Metode pembayaran apa yang tersedia?',
    answer: 'Kami menyediakan 2 metode pembayaran: BCA Transfer dan QRIS. Pilih metode yang paling sesuai untuk Anda.',
  },
  {
    id: 4,
    question: 'Berapa lama proses konfirmasi pembayaran?',
    answer: 'Proses konfirmasi biasanya dilakukan dalam 1-5 menit setelah Anda mengirimkan bukti transfer.',
  },
  {
    id: 5,
    question: 'Apakah ada biaya tambahan?',
    answer: 'Tidak ada biaya tambahan. Harga paket sudah termasuk semua feature dan akses 24/7.',
  },
  {
    id: 6,
    question: 'Bagaimana jika ingin membatalkan langganan?',
    answer: 'Anda dapat membatalkan langganan kapan saja. Akses akan dihapus pada akhir periode langganan Anda.',
  },
];

// ROUTES
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  PROFILE: '/profile',
  PAYMENT: '/payment',
  PAYMENT_CONFIRMATION: '/payment-confirmation',
  FEATURES: '/features',
  NOT_FOUND: '*',
};
