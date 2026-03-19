import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';

const PERCENTAGES = [
  { pct: 100, label: '1RM', reps: 1 },
  { pct: 95,  label: '%95', reps: 2 },
  { pct: 90,  label: '%90', reps: 3 },
  { pct: 85,  label: '%85', reps: 5 },
  { pct: 80,  label: '%80', reps: 6 },
  { pct: 75,  label: '%75', reps: 8 },
  { pct: 70,  label: '%70', reps: 10 },
  { pct: 65,  label: '%65', reps: 12 },
  { pct: 60,  label: '%60', reps: 15 },
];

const OneRMModal = ({ isOpen, onClose, darkMode, initialExercise = '' }) => {
  const [exercise, setExercise] = useState(initialExercise);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRM, setOneRM] = useState(null);

  if (!isOpen) return null;

  // Epley formula: 1RM = weight x (1 + reps/30)
  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r || r < 1 || r > 20) return;
    const result = w * (1 + r / 30);
    setOneRM(Math.round(result * 2) / 2); // round to nearest 0.5
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className={`w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl
        ${darkMode ? 'bg-slate-900 border border-amber-500/20' : 'bg-white border border-gray-200'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-amber-500" />
            <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>1RM Hesaplayici</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Exercise name (optional) */}
          <input
            type="text"
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            placeholder="Egzersiz adi (istege bagli)"
            className={`w-full rounded-xl px-4 py-3 text-sm border outline-none
              ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
          />

          {/* Inputs */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Agirlik (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="100"
                min="0"
                step="0.5"
                className={`w-full rounded-xl px-4 py-3 text-center font-mono font-bold text-lg border outline-none
                  ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Tekrar</label>
              <input
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)}
                placeholder="5"
                min="1"
                max="20"
                className={`w-full rounded-xl px-4 py-3 text-center font-mono font-bold text-lg border outline-none
                  ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
              />
            </div>
          </div>

          <button onClick={calculate}
            className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm">
            Hesapla (Epley Formulu)
          </button>

          {/* Results */}
          {oneRM && (
            <div>
              <div className="text-center mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">
                  {exercise || 'Tahmini 1RM'}
                </p>
                <p className="text-4xl font-black text-amber-500 font-mono">{oneRM} <span className="text-lg">kg</span></p>
              </div>

              <div className="space-y-1.5">
                {PERCENTAGES.slice(1).map(p => (
                  <div key={p.pct} className={`flex justify-between items-center px-3 py-2 rounded-lg
                    ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {p.label} <span className={`font-normal ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>~{p.reps} tekrar</span>
                    </span>
                    <span className={`text-sm font-bold font-mono ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      {Math.round(oneRM * p.pct / 100 * 2) / 2} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneRMModal;
