// =========================================
// FILE: src/utils/phoneValidator.js - NEW
// Phone Number Validation & Formatting Utilities
// =========================================

/**
 * Validate Indonesian phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digits
  const clean = phone.replace(/\D/g, '');
  
  // Check format: 08xxx, 628xxx, or +628xxx
  const phoneRegex = /^(\+62|62|0)?[0-9]{9,12}$/;
  return phoneRegex.test(clean);
};

/**
 * Format phone for display (with spaces)
 * Example: 081234567890 -> 0812 3456 7890
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  const clean = phone.replace(/\D/g, '');
  
  // Remove leading 62 or +62
  let formatted = clean;
  if (clean.startsWith('62')) {
    formatted = '0' + clean.substring(2);
  }
  
  // Add spaces: 0812 3456 7890
  if (formatted.length > 4) {
    formatted = formatted.substring(0, 4) + ' ' + formatted.substring(4);
  }
  if (formatted.length > 9) {
    formatted = formatted.substring(0, 9) + ' ' + formatted.substring(9);
  }
  
  return formatted;
};

/**
 * Format phone for submission (remove spaces, ensure correct format)
 * Example: 0812 3456 7890 -> 081234567890
 */
export const formatPhoneForSubmit = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  let clean = phone.replace(/\D/g, '');
  
  // Ensure starts with 0 (not 62 or +62)
  if (clean.startsWith('62')) {
    clean = '0' + clean.substring(2);
  } else if (!clean.startsWith('0')) {
    clean = '0' + clean;
  }
  
  return clean;
};

/**
 * Convert to WhatsApp format (62xxx)
 */
export const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return '';
  
  let clean = phone.replace(/\D/g, '');
  
  // Convert 08xxx to 628xxx
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  
  return clean;
};

/**
 * Get phone display with country code
 * Example: 081234567890 -> +62 812 3456 7890
 */
export const getPhoneDisplayWithCode = (phone) => {
  if (!phone) return '';
  
  const whatsappFormat = formatPhoneForWhatsApp(phone);
  
  // Format: +62 812 3456 7890
  let formatted = '+' + whatsappFormat.substring(0, 2);
  formatted += ' ' + whatsappFormat.substring(2, 5);
  if (whatsappFormat.length > 5) {
    formatted += ' ' + whatsappFormat.substring(5, 9);
  }
  if (whatsappFormat.length > 9) {
    formatted += ' ' + whatsappFormat.substring(9);
  }
  
  return formatted;
};

/**
 * Check if phone is valid WhatsApp number
 */
export const isValidWhatsAppNumber = (phone) => {
  if (!validatePhone(phone)) return false;
  
  const clean = phone.replace(/\D/g, '');
  
  // Indonesian WhatsApp numbers: 08xx (length 10-13)
  return clean.length >= 10 && clean.length <= 13;
};

export default {
  validatePhone,
  formatPhoneForDisplay,
  formatPhoneForSubmit,
  formatPhoneForWhatsApp,
  getPhoneDisplayWithCode,
  isValidWhatsAppNumber
};