import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          bgColor: 'bg-white/90 dark:bg-slate-900/90 border-red-500/30',
          progressBarColor: 'bg-red-500'
        };
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-white/90 dark:bg-slate-900/90 border-blue-500/30',
          progressBarColor: 'bg-blue-500'
        };
      case 'success':
      default:
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          bgColor: 'bg-white/90 dark:bg-slate-900/90 border-emerald-500/30',
          progressBarColor: 'bg-emerald-500'
        };
    }
  };

  const styles = getToastStyles(toast.type);

  return (
    <div className={`group relative flex items-center justify-between gap-4 p-4 pr-5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 scale-100 hover:scale-[1.01] animate-in slide-in-from-right duration-250 ${styles.bgColor}`}>
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0">{styles.icon}</span>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide">
          {toast.message}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Progress Bar Timer Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
        <div 
          className={`h-full origin-left shrink-bar ${styles.progressBarColor}`}
          style={{ animation: 'shrinkWidth 4s linear forwards' }}
        />
      </div>
    </div>
  );
}
