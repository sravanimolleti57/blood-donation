import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 icon-emerald-600',
    error: 'bg-red-50 border-red-200 text-red-800 icon-red-600',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 icon-amber-600',
    info: 'bg-blue-50 border-blue-200 text-blue-800 icon-blue-600',
  };

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <FiInfo className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-md transition-all duration-300 animate-slide-in ${styles[type] || styles.info}`}>
      {icons[type] || icons.info}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
