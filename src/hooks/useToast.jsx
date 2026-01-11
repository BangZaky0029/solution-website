// =========================================
// FILE: src/hooks/useToast.jsx - UPGRADED
// Enhanced Toast System with Multiple Features
// =========================================

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ id, message, type, onClose, duration }) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  };

  return (
    <div 
      className={`toast ${colors[type]} animate-slide-in`}
      style={{ '--duration': `${duration}ms` }}
    >
      <div className="toast-icon">{icons[type]}</div>
      
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      
      <button 
        onClick={onClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
};

// CSS for Toast (add to Global.css or create Toast.css)
const toastStyles = `
.toast-container {
  position: fixed;
  top: calc(var(--header-height, 80px) + 20px);
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  pointer-events: none;
}

.toast {
  pointer-events: all;
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-success .toast-icon { color: #10b981; }
.toast-error .toast-icon { color: #ef4444; }
.toast-warning .toast-icon { color: #f59e0b; }
.toast-info .toast-icon { color: #3b82f6; }

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
  color: #374151;
  word-wrap: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  width: 100%;
  animation: toast-progress linear;
  transform-origin: left;
}

@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.animate-slide-in {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 640px) {
  .toast-container {
    top: auto;
    bottom: 20px;
    left: 16px;
    right: 16px;
    max-width: none;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
`;