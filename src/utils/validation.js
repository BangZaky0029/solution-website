// =========================================
// FILE: src/utils/validation.js - FIXED
// Comprehensive Validation Utilities
// =========================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password with requirements
 */
export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 8;
};

/**
 * Calculate password strength (0-100)
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { level: 0, text: '', color: '', checks: {} };
  }

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12
  };

  if (checks.length) strength += 20;
  if (checks.uppercase) strength += 15;
  if (checks.lowercase) strength += 15;
  if (checks.numbers) strength += 15;
  if (checks.special) strength += 20;
  if (checks.longLength) strength += 15;

  let text = '';
  let color = '';

  if (strength <= 40) {
    text = 'Lemah';
    color = '#ef4444';
  } else if (strength <= 70) {
    text = 'Cukup Kuat';
    color = '#f59e0b';
  } else {
    text = 'Kuat';
    color = '#10b981';
  }

  return { level: strength, text, color, checks };
};

/**
 * Validate Indonesian phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const clean = phone.replace(/\D/g, '');
  return /^(62|0)[0-9]{9,12}$/.test(clean);
};

/**
 * Format phone number to 08xxx
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');

  if (clean.startsWith('62')) return '0' + clean.substring(2);
  return clean;
};

/**
 * Validate OTP
 */
export const validateOTP = (otp) => {
  if (!otp) return false;
  return /^\d{6}$/.test(otp);
};

/**
 * Validate name
 */
export const validateName = (name) => {
  if (!name || name.trim().length < 3) return false;
  return /^[a-zA-Z\s\-'.]+$/.test(name.trim());
};

/**
 * Capitalize field name
 */
const capitalizeField = (field) => {
  const fieldNames = {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi Password',
    phone: 'Nomor WhatsApp',
    name: 'Nama',
    otp: 'Kode OTP'
  };

  return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
};

/**
 * Main form validation
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field] || String(formData[field]).trim() === '') {
      errors[field] = `${capitalizeField(field)} wajib diisi`;
    }
  });

  if (formData.email && !errors.email && !validateEmail(formData.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (formData.password && !errors.password && !validatePassword(formData.password)) {
    errors.password = 'Password minimal 8 karakter';
  }

  if (formData.phone && !errors.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Format nomor WhatsApp tidak valid';
  }

  if (formData.name && !errors.name && !validateName(formData.name)) {
    errors.name = 'Nama minimal 3 karakter dan hanya huruf';
  }

  if (formData.confirmPassword && formData.password) {
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }
  }

  if (formData.otp && !errors.otp && !validateOTP(formData.otp)) {
    errors.otp = 'OTP harus 6 digit angka';
  }

  return errors;
};

/**
 * Sanitize input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

/**
 * Check password match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Validate single field
 */
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'email':
      if (!value) return 'Email wajib diisi';
      if (!validateEmail(value)) return 'Format email tidak valid';
      return null;

    case 'password':
      if (!value) return 'Password wajib diisi';
      if (!validatePassword(value)) return 'Password minimal 8 karakter';
      return null;

    case 'confirmPassword':
      if (!value) return 'Konfirmasi password wajib diisi';
      if (value !== formData.password) return 'Password tidak cocok';
      return null;

    case 'phone':
      if (!value) return 'Nomor WhatsApp wajib diisi';
      if (!validatePhone(value)) return 'Format nomor WhatsApp tidak valid';
      return null;

    case 'name':
      if (!value) return 'Nama wajib diisi';
      if (!validateName(value)) return 'Nama minimal 3 karakter';
      return null;

    case 'otp':
      if (!value) return 'Kode OTP wajib diisi';
      if (!validateOTP(value)) return 'OTP harus 6 digit angka';
      return null;

    default:
      return null;
  }
};

/**
 * Default export
 */
export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateOTP,
  validateName,
  validateForm,
  validateField,
  getPasswordStrength,
  passwordsMatch,
  formatPhoneNumber,
  sanitizeInput
};
