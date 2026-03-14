import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    const leaveTimer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 350);
    }, toast.duration || 3500);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 350);
  };
  const config = {
    success: { icon: <CheckCircle size={18} />, border: 'border-green-500/40', iconColor: 'text-green-400', bg: 'bg-green-500/10', bar: 'bg-green-500' },
    error:   { icon: <XCircle size={18} />,     border: 'border-red-500/40',   iconColor: 'text-red-400',   bg: 'bg-red-500/10',   bar: 'bg-red-500' },
    warning: { icon: <AlertTriangle size={18} />, border: 'border-amber-500/40', iconColor: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-500' },
    info:    { icon: <Info size={18} />,         border: 'border-blue-500/40',  iconColor: 'text-blue-400',  bg: 'bg-blue-500/10',  bar: 'bg-blue-500' },
  };
  const c = config[toast.type] || config.info;
  return (
    <div
      style={{
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.9)',
        opacity: visible && !leaving ? 1 : 0,
      }}
      className={`relative flex items-start gap-3 w-80 max-w-[90vw] px-4 py-3.5 rounded-xl bg-slate-900 border ${c.border} ${c.bg} shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden`}
    >
      <div className={`absolute bottom-0 left-0 h-0.5 ${c.bar} rounded-full`} style={{ animation: `toast-shrink ${toast.duration || 3500}ms linear forwards` }} />
      <span className={`${c.iconColor} shrink-0 mt-0.5`}>{c.icon}</span>
      <p className="text-sm text-slate-200 leading-snug flex-1">{toast.message}</p>
      <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 mt-0.5"><X size={14} /></button>
      <style>{`@keyframes toast-shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
};
export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="fixed bottom-24 right-4 z-[999] flex flex-col gap-2.5 items-end pointer-events-none" aria-live="polite">
    {toasts.map(t => (
      <div key={t.id} className="pointer-events-auto">
        <ToastItem toast={t} onRemove={onRemove} />
      </div>
    ))}
  </div>
);
