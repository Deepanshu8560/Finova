import React from 'react';
import { createPortal } from 'react-dom';
import { useFinanceStore } from '../../store/useFinanceStore';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast notification container. Portals into the root for high visibility.
 */
export const ToastService = () => {
  const { toasts, removeToast } = useFinanceStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};
