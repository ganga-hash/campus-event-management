import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ show, type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] min-w-[300px]"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md
            ${type === 'success' ? 'bg-emerald-50/90 border-emerald-200/50' : 'bg-rose-50/90 border-rose-200/50'}`}
          >
            {type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className={`text-sm font-medium ${type === 'success' ? 'text-emerald-800' : 'text-rose-800'}`}>
              {message}
            </p>
            <button 
              onClick={onClose}
              className={`ml-auto p-1 rounded-md transition-colors ${type === 'success' ? 'hover:bg-emerald-100 text-emerald-600' : 'hover:bg-rose-100 text-rose-600'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
