// =========================================
// FILE: src/utils/helpers.js
// =========================================

/**
 * =========================
 * DATE VALIDATION HELPER
 * =========================
 */
const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * =========================
 * FORMATTERS
 * =========================
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0';

  const numberAmount =
    typeof amount === 'number'
      ? amount
      : Number(amount);

  if (isNaN(numberAmount)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberAmount);
};


export const formatDate = (date) => {
  if (!isValidDate(date)) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (dateTime) => {
  if (!isValidDate(dateTime)) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateTime));
};

/**
 * =========================
 * SUBSCRIPTION HELPERS
 * =========================
 */
export const getSubscriptionStatus = (packageName, expiredAt) => {
  if (!packageName || !isValidDate(expiredAt)) return 'none';

  return new Date(expiredAt) > new Date() ? 'active' : 'expired';
};

export const getDaysRemaining = (expiredAt) => {
  if (!isValidDate(expiredAt)) return 0;

  const now = new Date();
  const expiredDate = new Date(expiredAt);
  const diffTime = expiredDate - now;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * =========================
 * STRING HELPERS
 * =========================
 */
export const truncateText = (text = '', maxLength = 100) => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeText = (text = '') => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (name = '') => {
  if (!name) return '';

  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * =========================
 * PAYMENT HELPERS
 * =========================
 */
export const generatePaymentId = () => {
  return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * =========================
 * AUTH / TOKEN HELPERS
 * =========================
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * =========================
 * FUNCTION UTILS
 * =========================
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * =========================
 * ERROR HANDLER
 * =========================
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * =========================
 * ASYNC UTIL
 * =========================
 */
export const sleep = (ms = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));
