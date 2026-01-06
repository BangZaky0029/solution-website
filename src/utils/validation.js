// =========================================
// FILE: src/utils/validation.js - ENHANCED
// =========================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password with enhanced requirements
 */
export const validatePassword = (password) => {
  // Minimum 8 characters
  return password && password.length >= 8;
};

/**
 * Calculate password strength (0-100)
 * Returns object with level, text, and color
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

  // Scoring system
  if (checks.length) strength += 20;
  if (checks.uppercase) strength += 15;
  if (checks.lowercase) strength += 15;
  if (checks.numbers) strength += 15;
  if (checks.special) strength += 20;
  if (checks.longLength) strength += 15;

  // Determine strength level
  let text = '';
  let color = '';
  
  if (strength <= 40) {
    text = 'Lemah';
    color = '#ef4444'; // red
  } else if (strength <= 70) {
    text = 'Cukup Kuat';
    color = '#f59e0b'; // yellow/orange
  } else {
    text = 'Kuat';
    color = '#10b981'; // green
  }

  return { level: strength, text, color, checks };
};

/**
 * Validate phone number (Indonesian format)
 */
export const validatePhone = (phone) => {
  // Remove non-digit characters
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Accept formats: 08xxx, 628xxx, +628xxx
  const phoneRegex = /^(\+62|62|0)?[0-9]{9,12}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Convert to 08xxx format
  if (cleanPhone.startsWith('62')) {
    return '0' + cleanPhone.substring(2);
  } else if (cleanPhone.startsWith('+62')) {
    return '0' + cleanPhone.substring(3);
  }
  
  return cleanPhone;
};

/**
 * Validate OTP code
 */
export const validateOTP = (otp) => {
  return otp && otp.length === 6 && /^\d+$/.test(otp);
};

/**
 * Validate name (min 3 characters, letters only)
 */
export const validateName = (name) => {
  if (!name || name.trim().length < 3) return false;
  // Allow letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  return nameRegex.test(name.trim());
};

/**
 * Main form validation function
 * Returns object with field errors
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${capitalizeField(field)} wajib diisi`;
    }
  });

  // Validate email if present
  if (formData.email) {
    if (!validateEmail(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
  }

  // Validate password if present
  if (formData.password) {
    if (!validatePassword(formData.password)) {
      errors.password = 'Password minimal 8 karakter';
    }
  }

  // Validate phone if present
  if (formData.phone) {
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Nomor telepon tidak valid';
    }
  }

  // Validate name if present
  if (formData.name) {
    if (!validateName(formData.name)) {
      errors.name = 'Nama minimal 3 karakter, hanya huruf';
    }
  }

  // Validate confirm password if present
  if (formData.confirmPassword && formData.password) {
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }
  }

  // Validate OTP if present
  if (formData.otp) {
    if (!validateOTP(formData.otp)) {
      errors.otp = 'OTP harus 6 digit angka';
    }
  }

  return errors;
};

/**
 * Helper function to capitalize field names
 */
const capitalizeField = (field) => {
  const fieldNames = {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi Password',
    phone: 'Nomor Telepon',
    name: 'Nama',
    otp: 'Kode OTP'
  };
  
  return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
};

/**
 * Sanitize input (remove harmful characters)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and script content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

/**
 * Check if passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Validate form field in real-time
 * Returns error message or null
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
      if (!value) return 'Nomor telepon wajib diisi';
      if (!validatePhone(value)) return 'Nomor telepon tidak valid';
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