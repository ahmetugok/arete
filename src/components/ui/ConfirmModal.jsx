import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
const ConfirmModal = ({ state, onClose }) => {
  if (!state) return null;
  const { message, detail, onConfirm, variant = 'default', confirmLabel = 'Onayla', cancelLabel = 'Vazgeç' } = state;
  const variantConfig = {
    danger:  { icon: <AlertTriangle size={22} className="text-red-400" />,   iconBg: 'bg-red-500/10 border-red-500/20',   confirmBtn: 'bg-red-600 hover:bg-red-500 text-white' },
    warning: { icon: <AlertTriangle size={22} className="text-amber-400" />, iconBg: 'bg-amber-500/10 border-amber-500/20', confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold' },
    default: { icon: null, iconBg: '', confirmBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold' },
  };
  const vc = variantConfig[variant] || variantConfig.default;
  const handleConfirm = () => { onConfirm?.(); onClose(); };
  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60 overflow-hidden" style={{ animation: 'confirm-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            {vc.icon && <div className={`p-2 rounded-xl border ${vc.iconBg}`}>{vc.icon}</div>}
            <p className="text-white font-bold text-base leading-snug">{message}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors ml-2 mt-0.5 shrink-0"><X size={18} /></button>
        </div>
        {detail && <p className="px-5 pb-3 text-sm text-slate-400 leading-relaxed">{detail}</p>}
        <div className="flex gap-2 p-4 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all active:scale-[0.97]">{cancelLabel}</button>
          <button onClick={handleConfirm} className={`flex-1 py-2.5 px-4 rounded-xl text-sm transition-all active:scale-[0.97] ${vc.confirmBtn}`}>{confirmLabel}</button>
        </div>
      </div>
      <style>{`@keyframes confirm-pop { from { opacity: 0; transform: scale(0.88) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};
export default ConfirmModal;
