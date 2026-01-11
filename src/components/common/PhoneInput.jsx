// =========================================
// FILE: src/components/common/PhoneInput.jsx - NEW
// Enhanced Phone Number Input Component
// =========================================

import { useState } from 'react';
import { formatPhoneForDisplay, formatPhoneForSubmit } from '../../utils/phoneValidator';

const PhoneInput = ({ 
  value, 
  onChange, 
  disabled = false, 
  error = null,
  placeholder = '08123456789'
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (e) => {
    const input = e.target.value;
    
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, '');
    
    // Format for display
    const formatted = formatPhoneForDisplay(digitsOnly);
    setDisplayValue(formatted);
    
    // Pass clean value to parent
    const cleanValue = formatPhoneForSubmit(digitsOnly);
    onChange(cleanValue);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className={`phone-input-wrapper ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
      <div className="phone-prefix">
        <span className="flag">🇮🇩</span>
        <span className="code">+62</span>
      </div>
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        maxLength="15"
        className="phone-input"
      />
    </div>
  );
};

export default PhoneInput;