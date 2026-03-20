import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dumbbell, Timer, Flame, Waves, Activity, AlertCircle, RefreshCw, CheckCircle, ChevronDown, ChevronUp, Info, Eye, PlayCircle, BookOpen, X, BicepsFlexed, Landmark, Crown, MessageSquare, Utensils, Send, Sparkles, Save, Calendar, Trash2, Zap, BrainCircuit, Layout, Target, Heart, TrendingUp, Calculator, Settings } from 'lucide-react';
import StatsTab from './components/StatsTab';
import ProgramTab from './components/ProgramTab';
import OneRMModal from './components/OneRMModal';
import OnboardingModal from './components/OnboardingModal';
import HANIK_DB from './hanikData';
import { BESLENME_DB } from './beslenmeData';
import { getExerciseImageUrl, getYouTubeSearchUrl } from './data/exerciseImages';
import { CALISTHENICS_DB, LEVEL_CONFIG, GOAL_CATEGORY_MAP } from './data/calisthenicsData';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import ConfirmModal from './components/ui/ConfirmModal';
import { EXERCISE_DB, getImgUrl } from './data/exerciseData';

// Theme context — propagates darkMode to all sub-components without prop drilling
const ThemeContext = React.createContext(true); // default: dark

// --- GEMINI API CONFIGURATION ---
const callGemini = async (userQuery, systemInstruction) => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userQuery,
        systemInstruction: systemInstruction || '',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return err.error || '⚠️ Kahin şu an yanıt veremiyor.';
    }
    const data = await res.json();
    return data.text || '⚠️ Kahin şu an yanıt veremiyor.';
  } catch (err) {
    console.error('[Kahin] fetch error:', err);
    return '⚠️ Bağlantı hatası. İnternet bağlantını kontrol et.';
  }
};


// --- DATA & LOGIC ---

const getGifSearchUrl = (exerciseName) => getYouTubeSearchUrl(exerciseName);

const QUOTES = [
  "Bedenin eğitilmesi, zihnin eğitilmesidir. - Arete",
  "Zafer (Nike), hazırlık yapanı sever.",
  "Zorluklar, ateşin altını test etmesi gibi zihni test eder. - Seneca",
  "Sadece ağırlığı kaldırma, harekete sahip ol.",
  "Mükemmellik bir eylem değil, bir alışkanlıktır. - Aristoteles",
  "Acı geçicidir, onur (Kleos) sonsuzdur.",
  "Disiplin, ne istediğini o an ne istediğine tercih etmektir.",
  "Eğer yorulmuyorsan, değişmiyorsun."
];




// --- STORAGE HELPERS --- 
const saveToHistory = (workout, logs) => {
  const history = JSON.parse(localStorage.getItem('arete_history') || '[]');
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }),
    timestamp: Date.now(),
    workoutName: workout.name,
    focus: workout.focus,
    exercises: logs,
    workoutData: workout
  };
  localStorage.setItem('arete_history', JSON.stringify([newEntry, ...history]));
  return newEntry;
};

const getHistory = () => {
  return JSON.parse(localStorage.getItem('arete_history') || '[]');
};

const clearHistory = () => {
  localStorage.removeItem('arete_history');
};

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in-scale">
      <div className="glass border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-amber-900/10">
        <div className="flex-shrink-0 glass p-5 border-b border-white/10 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2 tracking-widest">
            <BookOpen size={24} /> ARETE SİSTEM KİTABESİ
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={28} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-300">
          <p className="text-sm leading-relaxed">
            Mükemmellik bir eylem değil, alışkanlıktır. Arete sistemi, modern spor biliminin en etkili metodolojilerini (GVT, FBB, Prime) tek bir çatıda toplar.
          </p>
          <div className="bg-amber-900/20 p-3 rounded border border-amber-600/30">
            <strong className="text-amber-500 block mb-2 flex items-center gap-2"><Layout size={16} /> Haftada 4 Gün için "The Arete Split"</strong>
            <ul className="text-xs space-y-2">
              <li><span className="text-white font-bold">Pazartesi (Lower Power):</span> Bacak ve Kalça odaklı güç. (Mod: Hercules veya GVT)</li>
              <li><span className="text-white font-bold">Salı (Upper Aesthetics):</span> İtiş ve Çekiş estetiği. (Mod: Apollon Aesthetics)</li>
              <li><span className="text-slate-500 font-bold">Çarşamba:</span> Aktif Dinlenme (Yürüyüş/Mobilite)</li>
              <li><span className="text-white font-bold">Perşembe (Prime Hybrid):</span> Patlayıcı güç ve atletizm. (Mod: Prime)</li>
              <li><span className="text-white font-bold">Cuma (Engine/Metcon):</span> Yüksek nabız ve kondisyon. (Mod: Hermes veya Hybrid)</li>
              <li><span className="text-slate-500 font-bold">Haftasonu:</span> Tam dinlenme ve kaliteli beslenme.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Crown size={16} /> GVT (German Volume Training)
            </h4>
            <p className="text-xs text-slate-400 mb-2">"10 Set Metodu". Hipertrofi (kas büyümesi) için altın standarttır.</p>
            <ul className="grid gap-2 text-xs">
              <li className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-white font-bold block mb-1">Nasıl Yapılır?</span>
                Tek bir ana hareket seçilir. 10 Set x 10 Tekrar yapılır.
              </li>
              <li className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-white font-bold block mb-1">Yük & Dinlenme</span>
                1RM'in %60'ı kullanılır. Setler arası 60-90 sn dinlenme.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
              <BicepsFlexed size={16} /> FBB (Functional Bodybuilding)
            </h4>
            <p className="text-xs text-slate-400 mb-2">Marcus Filly ekolü. Estetik görünürken atletik hareket edebilmek içindir.</p>
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-xs space-y-1">
              <p><strong>Tempo:</strong> Hareketin her evresini kontrol etmek esastır.</p>
              <p><strong>Stabilite:</strong> Tek kol/bacak çalışmaları ile vücut dengesizlikleri giderilir.</p>
              <p><strong>Kombinasyon:</strong> Klasik hareketler, fonksiyonel varyasyonlarla birleşir.</p>
            </div>
          </div>

          <div>
            <h4 className="text-purple-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Zap size={16} /> İleri Antrenman Teknikleri
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="bg-slate-900 p-2 rounded border-l-2 border-purple-500">
                <span className="text-white font-bold block">Cluster Sets</span>
                <span className="text-slate-400">Set içi mini dinlenmeler. Daha ağır kilolarla daha fazla hacim.</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border-l-2 border-purple-500">
                <span className="text-white font-bold block">Contrast Training</span>
                <span className="text-slate-400">Ağır güç hareketi + patlayıcı hareket. Sinir sistemini ateşler.</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border-l-2 border-purple-500">
                <span className="text-white font-bold block">Wave Loading</span>
                <span className="text-slate-400">Ağırlığı setler boyunca artırıp azaltarak sinir sistemini uyanık tutmak.</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-white font-bold text-sm mb-2">Tempo (30X1) Nasıl Okunur?</h4>
            <div className="flex gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2 rounded flex-1 border border-slate-800">
                <span className="block text-amber-500 font-bold text-base">3</span> İniş
              </div>
              <div className="bg-slate-950 p-2 rounded flex-1 border border-slate-800">
                <span className="block text-amber-500 font-bold text-base">0</span> Dip Bekleme
              </div>
              <div className="bg-slate-950 p-2 rounded flex-1 border border-slate-800">
                <span className="block text-amber-500 font-bold text-base">X</span> Patlayıcı
              </div>
              <div className="bg-slate-950 p-2 rounded flex-1 border border-slate-800">
                <span className="block text-amber-500 font-bold text-base">1</span> Tepe Sıkış
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Focus → kas bölgesi etiketi eşlemesi
const focusMuscleLabel = {
  gvt: ['Bacak', 'Karın'],
  gvt_legs: ['Bacak', 'Karın'],
  gvt_push: ['Göğüs', 'Sırt', 'Omuz'],
  gvt_pull: ['Göğüs', 'Sırt', 'Omuz'],
  ovt: ['Göğüs', 'Sırt', 'İtiş', 'Çekiş'],
  ovt_push: ['Göğüs', 'Omuz', 'Triseps'],
  ovt_pull: ['Bacak', 'Alt Sırt', 'Hamstring'],
  hanik_push_legs: ['Göğüs', 'Omuz', 'Bacak'],
  hanik_pull_core: ['Sırt', 'Biseps', 'Karın'],
  fbb: ['Full Body', 'Core'],
  engine: ['Kondisyon', 'Full Body'],
  aesthetics: ['Göğüs', 'Sırt', 'Kol'],
  hybrid: ['Full Body'],
  prime: ['Güç', 'Atletizm', 'Full Body'],
  spartan_hybrid: ['Full Body'],
  recovery: ['Mobilite', 'Esneme'],
  strength: ['Full Body'],
  metcon: ['Kondisyon'],
};

const CalendarModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) { setHistory(getHistory()); setSelected(null); }
  }, [isOpen]);

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Build a map: YYYY-MM-DD → [history entries]
  const dayMap = {};
  history.forEach(entry => {
    const d = new Date(entry.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!dayMap[key]) dayMap[key] = [];
    dayMap[key].push(entry);
  });

  // Grid cells
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Mon-start (0=Mon)
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const navMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
    setSelected(null);
  };

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/20 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <button onClick={() => navMonth(-1)} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 active:scale-90 transition-all">‹</button>
          <h2 className="text-white font-bold capitalize tracking-wide">{monthName}</h2>
          <button onClick={() => navMonth(1)} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 active:scale-90 transition-all">›</button>
          <button onClick={onClose} className="absolute right-4 top-4 p-1 text-slate-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Weekday labels */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
              <div key={d} className="text-center text-[10px] text-slate-500 uppercase font-bold py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1 px-3 pb-3">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const entries = dayMap[key] || [];
              const hasWorkout = entries.length > 0;
              const isToday = key === todayKey;
              const isSelected = selected?.key === key;

              return (
                <button key={key}
                  onClick={() => setSelected(hasWorkout ? { key, entries } : null)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 ${isSelected ? 'bg-amber-500/30 border border-amber-500' :
                    isToday ? 'border border-amber-500/40 bg-slate-800/60' :
                      hasWorkout ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'hover:bg-slate-800/20'
                    }`}>
                  <span className={`text-sm font-bold ${isToday ? 'text-amber-400' : hasWorkout ? 'text-white' : 'text-slate-500'}`}>{day}</span>
                  {hasWorkout && (
                    <div className="flex gap-0.5 mt-0.5">
                      {entries.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-amber-500" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selected && (
            <div className="mx-3 mb-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
              {selected.entries.map((entry, i) => {
                const muscles = focusMuscleLabel[entry.focus] || ['Full Body'];
                const logCount = Object.keys(entry.exercises || {}).length;
                const hasLogs = logCount > 0;

                // Toplam hacim
                const volume = Object.values(entry.exercises || {}).reduce((acc, log) => {
                  const w = parseFloat(log.weight) || 0;
                  const r = parseInt(log.reps) || 0;
                  return acc + w * r;
                }, 0);

                return (
                  <div key={i} style={{
                    padding: '14px 16px',
                    background: 'rgba(15,23,42,0.8)',
                    borderBottom: i < selected.entries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <p style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{entry.date}</p>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
                      {entry.workoutName}
                    </h3>

                    {/* Kas grubu etiketleri */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                        background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                        border: '1px solid rgba(245,158,11,0.3)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {entry.focus?.toUpperCase()}
                      </span>
                      {muscles.map(m => (
                        <span key={m} style={{
                          fontSize: 9, padding: '2px 7px', borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)', color: '#64748b',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Stats satırı */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: hasLogs ? 10 : 0 }}>
                      {hasLogs && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>{logCount}</div>
                          <div style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase' }}>Kayıt</div>
                        </div>
                      )}
                      {volume > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#60a5fa', fontFamily: 'monospace' }}>
                            {volume >= 1000 ? `${Math.round(volume / 100) / 10}t` : `${Math.round(volume)}kg`}
                          </div>
                          <div style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase' }}>Hacim</div>
                        </div>
                      )}
                    </div>

                    {/* Egzersiz listesi */}
                    {entry.workoutData?.strength?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {entry.workoutData.strength.flatMap(b => b.exercises || []).slice(0, 5).map((ex, j) => {
                          const log = entry.exercises?.[ex.name];
                          return (
                            <div key={j} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '4px 8px', borderRadius: 6,
                              background: 'rgba(255,255,255,0.03)',
                            }}>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>{ex.name}</span>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {log?.weight && <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f59e0b' }}>{log.weight}kg</span>}
                                {log?.reps   && <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#60a5fa' }}>×{log.reps}</span>}
                                {(!log?.weight && !log?.reps) && (
                                  <span style={{ fontSize: 10, color: '#334155' }}>{ex.sets}×{ex.reps}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {Object.keys(dayMap).length === 0 && (
            <div className="text-center py-8 text-slate-600 text-sm">
              Henüz kayıtlı antrenman yok.<br />
              <span className="text-[11px]">Antrenman tamamlayıp kaydet butonuna bas.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryModal = ({ isOpen, onClose, toast, setConfirmState }) => {

  const [history, setHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  useEffect(() => { if (isOpen) { setHistory(getHistory()); setSelectedEntry(null); } }, [isOpen]);
  if (!isOpen) return null;

  const stats = history.reduce((acc, entry) => { acc[entry.focus] = (acc[entry.focus] || 0) + 1; return acc; }, {});
  const totalExercises = history.reduce((acc, entry) => acc + Object.keys(entry.exercises || {}).length, 0);

  const deleteEntry = (entryId, e) => {
    e.stopPropagation();
    setConfirmState({
      message: 'Bu kayıt silinsin mi?',
      variant: 'danger',
      confirmLabel: 'Sil',
      onConfirm: () => {
        const newHistory = history.filter(h => h.id !== entryId);
        localStorage.setItem('arete_history', JSON.stringify(newHistory));
        setHistory(newHistory);
        toast.success('Kayıt silindi.');
      },
    });
  };

  // Detay görünümü
  if (selectedEntry) {
    const wd = selectedEntry.workoutData;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in-scale">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-amber-900/20">
          <div className="p-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/20 to-slate-900 rounded-t-2xl flex justify-between items-center">
            <button onClick={() => setSelectedEntry(null)} className="text-amber-500 hover:text-amber-400 flex items-center gap-2 text-sm"><ChevronUp size={18} className="rotate-[-90deg]" /> Geri</button>
            <span className="text-amber-500 font-bold text-sm">{selectedEntry.date}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-2xl font-black text-white tracking-tight">{selectedEntry.workoutName}</h3>
            <div className="flex gap-2 mt-2"><Badge text={selectedEntry.focus} color="bg-amber-500/20 text-amber-400 border border-amber-500/30" /></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Kaydedilen performans verileri */}
            {Object.keys(selectedEntry.exercises || {}).length > 0 ? (
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle size={16} /> KAYDEDİLEN PERFORMANS</h4>
                <div className="grid gap-2">
                  {Object.entries(selectedEntry.exercises).map(([exName, log], idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-lg">
                      <span className="text-white text-sm">{exName}</span>
                      <div className="flex gap-3">
                        {log.weight && <span className="font-mono text-amber-500 text-sm">{log.weight} kg</span>}
                        {log.reps && <span className="font-mono text-blue-400 text-sm">x{log.reps}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-slate-500 text-sm">Bu antrenman için performans kaydı yok.</p>
              </div>
            )}
            {/* Antrenman içeriği */}
            {wd ? (
              <>
                {wd.warmup && wd.warmup.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                    <h4 className="text-slate-400 font-bold text-xs uppercase mb-2">Isınma</h4>
                    <div className="space-y-1">{wd.warmup.map((ex, i) => <div key={i} className="text-sm text-slate-300">{ex.name}</div>)}</div>
                  </div>
                )}
                {wd.strength && wd.strength.length > 0 && (
                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-3">
                    <h4 className="text-amber-500 font-bold text-xs uppercase mb-2">Güç Bloku</h4>
                    {wd.strength.map((block, bIdx) => (
                      <div key={bIdx} className="mb-2 last:mb-0">
                        <div className="text-xs text-slate-500 mb-1">{String.fromCharCode(65 + bIdx)}. {block.type}</div>
                        <div className="space-y-1">{block.exercises.map((ex, i) => <div key={i} className="text-sm text-slate-300 pl-3">• {ex.name} <span className="text-slate-500">{ex.sets}x{ex.reps}</span></div>)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {wd.metcon && wd.metcon.exercises && (
                  <div className="bg-orange-900/10 border border-orange-500/20 rounded-xl p-3">
                    <h4 className="text-orange-500 font-bold text-xs uppercase mb-2">Kondisyon - {wd.metcon.structure}</h4>
                    <div className="space-y-1">{wd.metcon.exercises.map((ex, i) => <div key={i} className="text-sm text-slate-300">• {ex.name}</div>)}</div>
                  </div>
                )}
                {wd.core && wd.core.length > 0 && (
                  <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-3">
                    <h4 className="text-blue-500 font-bold text-xs uppercase mb-2">Merkez Bölge</h4>
                    <div className="space-y-1">{wd.core.map((ex, i) => <div key={i} className="text-sm text-slate-300">• {ex.name}</div>)}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-600 text-xs">Antrenman detayları kaydedilmemiş (eski kayıt).</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in-scale">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-blue-900/20">
        <div className="p-5 border-b border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-slate-900 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><Calendar size={20} className="text-blue-400" /></div> SAVAŞ GÜNLÜĞÜ
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 p-4 rounded-xl border border-blue-500/20 text-center">
              <span className="text-3xl font-black text-white">{history.length}</span>
              <span className="text-xs text-blue-400 uppercase block mt-1">Antrenman</span>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-slate-900 p-4 rounded-xl border border-amber-500/20 text-center">
              <span className="text-3xl font-black text-amber-500">{totalExercises}</span>
              <span className="text-xs text-amber-400 uppercase block mt-1">Hareket</span>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-slate-900 p-4 rounded-xl border border-green-500/20 text-center">
              <span className="text-lg font-bold text-green-400">{Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}</span>
              <span className="text-xs text-green-400 uppercase block mt-1">Favori Mod</span>
            </div>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚔️</div>
              <p className="text-slate-500">Henüz savaş kaydı yok.</p>
              <p className="text-xs text-slate-600 mt-2">İlk antrenmanını tamamla ve kaydet!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} onClick={() => setSelectedEntry(entry)} className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-800/80 group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{entry.workoutName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{entry.date}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge text={entry.focus} color="bg-slate-700 text-slate-300" />
                        {Object.keys(entry.exercises || {}).length > 0 && <Badge text={`${Object.keys(entry.exercises).length} kayıt`} color="bg-green-900/50 text-green-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => deleteEntry(entry.id, e)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                      <ChevronUp size={20} className="text-slate-600 group-hover:text-blue-400 rotate-90 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex justify-between items-center">
          <span className="text-xs text-slate-600">Detay için tıkla</span>
          {history.length > 0 && <button onClick={() => setConfirmState({
            message: 'Tüm kayıtlar silinsin mi?',
            detail: 'Bu işlem geri alınamaz.',
            variant: 'danger',
            confirmLabel: 'Tümünü Sil',
            onConfirm: () => { clearHistory(); setHistory([]); toast.success('Tüm kayıtlar silindi.'); },
          })} className="text-red-500/70 text-xs flex items-center gap-1 hover:text-red-400 transition-colors"><Trash2 size={14} /> Temizle</button>}
        </div>
      </div>
    </div>
  );
};

const ChatModal = ({ isOpen, onClose, workoutContext }) => {
  const [messages, setMessages] = useState([{ role: 'system', text: "Ben Arete. Elit performans koçunum. Bugünkü antrenmanınla ilgili ne sormak istersin?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0); // saniye cinsinden geri sayım
  const messagesEndRef = useRef(null);
  const cooldownRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isOpen]);
  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const startCooldown = (seconds) => {
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || cooldown > 0) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);
    const systemPrompt = `Sen "Arete" isimli elit bir performans koçusun. Dil: Türkçe, kısa ve disiplinli. Antrenman bağlamı: ${JSON.stringify(workoutContext)}. Soruya göre alternatif hareket öner veya teknik açıkla. Maksimum 3 paragraf.`;
    const aiResponse = await callGemini(userMsg, systemPrompt);
    setMessages(prev => [...prev, { role: 'system', text: aiResponse }]);
    setIsTyping(false);
    // Cevaptan sonra kısa bir bekleme öner (rate limit önlemi)
    startCooldown(8);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in-scale">
      <div className="glass border border-amber-500/30 rounded-2xl w-full max-w-lg h-[600px] flex flex-col shadow-2xl shadow-amber-900/20">
        <div className="p-4 border-b border-white/10 bg-slate-950/50 flex justify-between items-center rounded-t-2xl">
          <span className="text-amber-500 font-bold flex gap-2"><Sparkles size={20} /> KAHİNE DANIŞ</span>
          <button onClick={onClose} className="text-slate-400"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-br-md' : 'glass text-slate-200 rounded-bl-md'}`}>{msg.text}</div>
            </div>
          ))}
          {isTyping && <div className="text-xs text-slate-500 ml-2">Yazıyor...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-white/10 flex flex-col gap-2 rounded-b-2xl bg-slate-950/50">
          {cooldown > 0 && (
            <div className="flex items-center gap-2 px-1">
              <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full transition-all duration-1000" style={{ width: `${(cooldown / 8) * 100}%` }} />
              </div>
              <span className="text-[10px] text-amber-500/70 font-mono shrink-0">{cooldown}s</span>
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping || cooldown > 0}
              className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-40"
              placeholder={cooldown > 0 ? `${cooldown} saniye bekle...` : isTyping ? 'Yanıt geliyor...' : 'Soru sor...'}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || cooldown > 0 || !input.trim()}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-3 rounded-xl hover:from-amber-500 hover:to-amber-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed">
              {isTyping ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NutritionCard = ({ workout }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const generateMeal = async () => {
    setLoading(true);
    const systemPrompt = `Sen "Ambrosia" beslenme sistemisin. Antrenman: ${JSON.stringify(workout)}. Türk mutfağına uygun, protein ağırlıklı tek bir öğün öner.`;
    const response = await callGemini("Bana öğün öner.", systemPrompt);
    setPlan(response);
    setLoading(false);
  };
  if (plan) return <div className="mt-10 glass p-6 rounded-2xl border border-green-500/30 shadow-lg shadow-green-900/10"><h3 className="text-green-400 font-bold mb-4 flex gap-3 items-center text-lg"><div className="p-2 bg-green-500/20 rounded-lg"><Utensils size={20} /></div> Ambrosia - Beslenme Önerisi</h3><div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{plan}</div></div>;
  return <div className="mt-10 flex justify-center"><button onClick={generateMeal} disabled={loading} className="flex items-center gap-3 glass px-8 py-4 rounded-full border border-green-500/30 font-bold hover:bg-green-500/10 transition-all hover:scale-105 active:scale-95 group">{loading ? <RefreshCw className="animate-spin text-green-400" /> : <Sparkles className="text-green-400 group-hover:animate-pulse" />} <span className="text-green-400">Ambrosia: Öğün Oluştur</span></button></div>;
};

// ======================== BESLENME BİLEŞENLERİ ========================

const MacroSummaryCard = ({ dailyMeal, workedOutToday, darkMode }) => {
  const BASE = { cal: 2100, p: 160, k: 230, y: 60 };
  const BONUS = workedOutToday ? { cal: 250, p: 20, k: 30, y: 5 } : { cal: 0, p: 0, k: 0, y: 0 };
  const target = { cal: BASE.cal + BONUS.cal, p: BASE.p + BONUS.p, k: BASE.k + BONUS.k, y: BASE.y + BONUS.y };

  const plan = dailyMeal ? {
    cal: dailyMeal.kahvaltilik.erkek.kcal + dailyMeal.tatli.erkek.kcal + dailyMeal.aksam.erkek.kcal,
    p: dailyMeal.kahvaltilik.erkek.p + dailyMeal.tatli.erkek.p + dailyMeal.aksam.erkek.p,
    k: dailyMeal.kahvaltilik.erkek.c + dailyMeal.tatli.erkek.c + dailyMeal.aksam.erkek.c,
    y: dailyMeal.kahvaltilik.erkek.y + dailyMeal.tatli.erkek.y + dailyMeal.aksam.erkek.y,
  } : { cal: 0, p: 0, k: 0, y: 0 };

  const pct = (v, t) => Math.min(100, Math.round(v / t * 100));

  // Donut arcs — protein/carb/fat cals as % of target calories
  const R = 52;
  const CIRC = 2 * Math.PI * R; // ≈ 326.7
  const startOffset = CIRC * 0.25; // start at top

  const protCals = plan.p * 4;
  const carbCals = plan.k * 4;
  const fatCals = plan.y * 9;
  const totalArcCals = protCals + carbCals + fatCals || 1;

  const GAP = CIRC * 0.015;
  const protLen = (protCals / totalArcCals) * CIRC * 0.97;
  const carbLen = (carbCals / totalArcCals) * CIRC * 0.97;
  const fatLen = (fatCals / totalArcCals) * CIRC * 0.97;

  const carbOffset = startOffset - protLen - GAP;
  const fatOffset = carbOffset - carbLen - GAP;

  const calPct = pct(plan.cal, target.cal);
  const calColor = !dailyMeal ? '#4B5563' : calPct >= 90 ? '#22C55E' : calPct >= 60 ? '#F5A623' : '#EF4444';

  return (
    <div className={`rounded-2xl border mb-4 overflow-hidden ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
      {/* Donut + legend */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 gap-4">
        {/* SVG Donut */}
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r={R} fill="none" stroke={darkMode ? '#1E293B' : '#F1F5F9'} strokeWidth="14" />
            {/* Protein arc */}
            {dailyMeal && protLen > 0 && (
              <circle cx="60" cy="60" r={R} fill="none" stroke="#3B82F6" strokeWidth="14"
                strokeDasharray={`${protLen} ${CIRC}`}
                strokeDashoffset={startOffset}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            )}
            {/* Carb arc */}
            {dailyMeal && carbLen > 0 && (
              <circle cx="60" cy="60" r={R} fill="none" stroke="#F5A623" strokeWidth="14"
                strokeDasharray={`${carbLen} ${CIRC}`}
                strokeDashoffset={carbOffset}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            )}
            {/* Fat arc */}
            {dailyMeal && fatLen > 0 && (
              <circle cx="60" cy="60" r={R} fill="none" stroke="#EF4444" strokeWidth="14"
                strokeDasharray={`${fatLen} ${CIRC}`}
                strokeDashoffset={fatOffset}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            )}
            {/* Center text */}
            <text x="60" y="55" textAnchor="middle" fill={calColor} fontSize="18" fontWeight="800">
              {dailyMeal ? plan.cal : '—'}
            </text>
            <text x="60" y="70" textAnchor="middle" fill={darkMode ? '#64748B' : '#94A3B8'} fontSize="9">
              {dailyMeal ? `/ ${target.cal} kcal` : `hedef ${target.cal}`}
            </text>
          </svg>
        </div>

        {/* Right side: legend + calorie pct */}
        <div className="flex-1 space-y-2">
          {[
            { label: 'P', color: '#3B82F6', v: plan.p, t: target.p },
            { label: 'K', color: '#F5A623', v: plan.k, t: target.k },
            { label: 'Y', color: '#EF4444', v: plan.y, t: target.y },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.label}</span>
                <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {dailyMeal ? `${m.v}g` : '—'} <span className="text-slate-600">/ {m.t}g</span>
                </span>
              </div>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: dailyMeal ? `${pct(m.v, m.t)}%` : '0%', background: m.color + (darkMode ? 'CC' : '') }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training day bonus banner */}
      {workedOutToday && (
        <div className="mx-4 mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
          <span className="text-amber-400 text-sm">💪</span>
          <span className="text-[11px] text-amber-400 font-semibold">
            Antrenman günü: +{BONUS.cal} kcal · +{BONUS.p}g protein · +{BONUS.k}g karb hedeflendi
          </span>
        </div>
      )}
    </div>
  );
};

const MacroRow = ({ label, m }) => (
  <div className="flex items-center gap-2 text-[10px]">
    <span className="text-slate-500 w-14 shrink-0">{label}</span>
    <span className="text-amber-400 font-bold w-10 text-right">{m.kcal}</span>
    <span className="text-blue-300 w-8 text-right">{m.p}g</span>
    <span className="text-green-300 w-8 text-right">{m.c}g</span>
    <span className="text-yellow-300 w-8 text-right">{m.y}g</span>
  </div>
);

const RecipeCard = ({ recipe }) => {
  const darkMode = React.useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${darkMode ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-gray-200'} rounded-lg border mb-1.5 overflow-hidden hover:border-amber-500/30 transition-colors`}>
      <div className="px-3 py-2.5 flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className={`flex-1 ${darkMode ? 'text-white' : 'text-gray-900'} text-sm font-semibold truncate`}>{recipe.name}</span>
        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full shrink-0">{recipe.erkek.kcal} kcal</span>
        {isOpen
          ? <ChevronUp size={13} className="text-amber-400 shrink-0" />
          : <ChevronDown size={13} className="text-slate-500 shrink-0" />}
      </div>
      {isOpen && (
        <div className={`${darkMode ? 'bg-slate-900/60 border-slate-700/30' : 'bg-gray-50 border-gray-200'} border-t p-3 space-y-2.5`}>
          {/* İçerik */}
          <div>
            <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">İçerik</p>
            <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'} leading-relaxed`}>{recipe.icerik}</p>
          </div>
          {/* YouTube */}
          {recipe.youtube && (
            <a href={recipe.youtube} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors">
              <PlayCircle size={11} /> YouTube'da İzle
            </a>
          )}
          {/* Makrolar */}
          <div className="pt-1">
            <div className="flex items-center gap-2 text-[8px] text-slate-500 uppercase tracking-widest mb-1.5">
              <span className="w-14"></span>
              <span className="w-10 text-right text-amber-500">KCAL</span>
              <span className="w-8 text-right text-blue-400">P</span>
              <span className="w-8 text-right text-green-400">K</span>
              <span className="w-8 text-right text-yellow-400">Y</span>
            </div>
            <MacroRow label="♂ Erkek" m={recipe.erkek} />
            <MacroRow label="♀ Kadın" m={recipe.kadin} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ARETE LOGO SVG ────────────────────────────────────────
const AreteLogo = ({ size = 38 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ag" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* ── COLUMN SHAFT (behind barbell) ── */}
    <rect x="42" y="34" width="16" height="52" rx="1" fill="url(#ag)" />
    {/* Fluting */}
    {[44, 47, 50, 53, 56].map(x => (
      <line key={x} x1={x} y1="35" x2={x} y2="84" stroke="#78350f" strokeWidth="1.2" opacity="0.45" />
    ))}

    {/* Column base */}
    <rect x="36" y="83" width="28" height="5" rx="2" fill="url(#ag)" />
    <rect x="32" y="88" width="36" height="4" rx="2" fill="url(#ag)" />

    {/* ── IONIC CAPITAL ── */}
    {/* Top abacus plate */}
    <rect x="26" y="11" width="48" height="5" rx="2.5" fill="url(#ag)" />

    {/* Left volute */}
    <path d="M 28 16 C 18 16 14 22 14 27 C 14 35 20 40 30 37 C 36 35 37 29 32 26 C 29 24 26 27 28 30"
      stroke="url(#ag)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Left volute eye */}
    <circle cx="28" cy="30" r="2" fill="url(#ag)" />

    {/* Right volute */}
    <path d="M 72 16 C 82 16 86 22 86 27 C 86 35 80 40 70 37 C 64 35 63 29 68 26 C 71 24 74 27 72 30"
      stroke="url(#ag)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Right volute eye */}
    <circle cx="72" cy="30" r="2" fill="url(#ag)" />

    {/* Echinus (ovolo) */}
    <rect x="28" y="16" width="44" height="8" rx="4" fill="url(#ag)" />
    {/* Neck ring */}
    <rect x="40" y="24" width="20" height="5" rx="1.5" fill="url(#ag)" />
    <rect x="42" y="29" width="16" height="4" rx="1" fill="url(#ag)" />

    {/* ── BARBELL (on top) ── */}
    {/* Bar */}
    <rect x="16" y="44" width="68" height="12" rx="4" fill="url(#ag)" />

    {/* Left inner disc */}
    <rect x="5" y="35" width="12" height="30" rx="4" fill="url(#ag)" />
    {/* Left outer disc */}
    <rect x="-1" y="39" width="7" height="22" rx="3" fill="url(#ag)" />

    {/* Right inner disc */}
    <rect x="83" y="35" width="12" height="30" rx="4" fill="url(#ag)" />
    {/* Right outer disc */}
    <rect x="94" y="39" width="7" height="22" rx="3" fill="url(#ag)" />
  </svg>
);

const MealSection = ({ emoji, title, time, recipes, darkMode }) => (
  <div className="mb-5">
    <div className={`flex items-center justify-between px-1 mb-2 pb-1.5 border-b ${darkMode ? 'border-slate-800/60' : 'border-gray-200'}`}>
      <h3 className={`text-xs font-bold flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <span>{emoji}</span> {title}
      </h3>
      <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">{time}</span>
    </div>
    {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
  </div>
);

// ======================== KAS DİYAGRAMI ========================

// Egzersiz adı/kategorisine göre aktif kasları döner
const getMuscleGroups = (exercise) => {
  const name = (exercise.name || '').toLowerCase();
  const desc = (exercise.description || '').toLowerCase();
  const combined = name + ' ' + desc;

  const groups = { primary: [], secondary: [] };

  // GÖĞÜS
  if (/bench|chest|pres|flye|push.up|şınav|dip/.test(combined))
    groups.primary.push('chest');

  // OMUZ
  if (/shoulder|omuz|overhead|press|lateral|raise|military|pike|jerk|snatch|clean/.test(combined))
    groups.primary.push('shoulder');

  // TRİSEPS
  if (/tricep|trisep|skull|pushdown|kickback|extension/.test(combined))
    groups.primary.push('triceps');

  // SIRT (LAT)
  if (/lat|pulldown|pull.up|chin.up|row|sırt|back|rack pull|pull over/.test(combined))
    groups.primary.push('back');

  // BİSEPS
  if (/bicep|bisep|curl|hammer|chin.up/.test(combined))
    groups.primary.push('biceps');

  // BACAK (QUAD)
  if (/squat|lunge|leg press|quad|hack|goblet|pistol|step.up|split/.test(combined))
    groups.primary.push('quads');

  // HAMSTRİNG
  if (/hamstring|rdl|deadlift|romanian|nordic|leg curl|hip hinge|good morning/.test(combined))
    groups.primary.push('hamstrings');

  // GLUT
  if (/glute|hip thrust|bridge|deadlift|squat|lunge/.test(combined))
    groups.secondary.push('glutes');

  // KARNI/CORE
  if (/plank|core|ab |abs|crunch|sit.up|karın|l.sit|hollow|mountain|oblique|v.up|toes|dragon|rollout|pallof|twist|chop|180/.test(combined))
    groups.primary.push('abs');

  // ALT SIRT
  if (/lower back|deadlift|rdl|hyperextension|good morning|back extension/.test(combined))
    groups.secondary.push('lowerback');

  // TRAPEZ (Shrug, Clean, Snatch)
  if (/shrug|trapez|clean|snatch|upright/.test(combined))
    groups.secondary.push('back');

  // FULL BODY — taşıma, kompleks, atletik
  if (/farmer|carry|get up|turkish|man maker|bear crawl|thruster|burpee|swing|broad jump|box jump|sled|slam|windmill|waiter/.test(combined)) {
    groups.primary.push('full');
  }

  // OMUZ secondary for push hareketleri
  if (groups.primary.includes('chest') && !groups.primary.includes('shoulder'))
    groups.secondary.push('shoulder');

  // Hiçbir şey eşleşmediyse full
  if (groups.primary.length === 0) groups.primary.push('full');

  return groups;
};

// Kompakt insan silüeti SVG diyagramı — aktif kaslar vurgulanır
const MuscleDiagram = ({ exercise }) => {
  const muscles = getMuscleGroups(exercise);
  const all = [...muscles.primary, ...muscles.secondary];
  const isPrimary = (m) => muscles.primary.includes(m);
  const isActive = (m) => all.includes(m) || all.includes('full');

  const fill = (m) => {
    if (all.includes('full')) return '#92400e'; // full body = dim amber for all
    if (!isActive(m)) return '#1e293b';
    return isPrimary(m) ? '#f59e0b' : '#92400e';
  };

  const stroke = '#334155'; // slate-700

  return (
    <svg viewBox="0 0 120 200" className="w-16 h-28 shrink-0" fill="none">
      {/* HEAD */}
      <ellipse cx="60" cy="16" rx="11" ry="13" fill="#334155" stroke={stroke} strokeWidth="1" />
      {/* NECK */}
      <rect x="55" y="27" width="10" height="8" rx="2" fill="#334155" />

      {/* === FRONT TORSO === */}
      {/* CHEST */}
      <path d="M42 36 Q50 33 60 34 Q70 33 78 36 L76 58 Q68 62 60 62 Q52 62 44 58 Z"
        fill={fill('chest')} stroke={stroke} strokeWidth="0.8" />
      {/* ABS */}
      <path d="M44 58 Q52 62 60 62 Q68 62 76 58 L74 90 Q66 94 60 94 Q54 94 46 90 Z"
        fill={fill('abs')} stroke={stroke} strokeWidth="0.8" />

      {/* SHOULDERS */}
      <ellipse cx="35" cy="42" rx="10" ry="11" fill={fill('shoulder')} stroke={stroke} strokeWidth="0.8" />
      <ellipse cx="85" cy="42" rx="10" ry="11" fill={fill('shoulder')} stroke={stroke} strokeWidth="0.8" />

      {/* BICEPS (upper arms front) */}
      <path d="M26 50 Q22 58 23 68 L30 68 Q31 60 33 52 Z"
        fill={fill('biceps')} stroke={stroke} strokeWidth="0.8" />
      <path d="M94 50 Q98 58 97 68 L90 68 Q89 60 87 52 Z"
        fill={fill('biceps')} stroke={stroke} strokeWidth="0.8" />

      {/* TRICEPS (upper arms back, shown on sides) */}
      <path d="M22 50 Q18 60 20 70 L26 70 Q23 60 26 50 Z"
        fill={fill('triceps')} stroke={stroke} strokeWidth="0.8" />
      <path d="M98 50 Q102 60 100 70 L94 70 Q97 60 94 50 Z"
        fill={fill('triceps')} stroke={stroke} strokeWidth="0.8" />

      {/* FOREARMS */}
      <path d="M23 70 Q21 80 23 90 L29 90 Q28 80 30 70 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />
      <path d="M97 70 Q99 80 97 90 L91 90 Q92 80 90 70 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />

      {/* BACK */}
      <path d="M42 36 L78 36 L76 58 Q68 55 60 55 Q52 55 44 58 Z"
        fill={fill('back')} stroke={stroke} strokeWidth="0.5" opacity="0.4" />

      {/* LOWER BACK strip behind abs */}
      <rect x="46" y="80" width="28" height="12" rx="2"
        fill={fill('lowerback')} stroke={stroke} strokeWidth="0.6" />

      {/* HIP / PELVIS */}
      <path d="M46 94 Q39 96 36 104 L84 104 Q81 96 74 94 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />

      {/* GLUTES (shown around hips) */}
      <ellipse cx="44" cy="102" rx="9" ry="8" fill={fill('glutes')} stroke={stroke} strokeWidth="0.8" />
      <ellipse cx="76" cy="102" rx="9" ry="8" fill={fill('glutes')} stroke={stroke} strokeWidth="0.8" />

      {/* QUADS (thighs front) */}
      <path d="M38 104 Q34 120 36 140 L52 140 Q50 122 50 104 Z"
        fill={fill('quads')} stroke={stroke} strokeWidth="0.8" />
      <path d="M82 104 Q86 120 84 140 L68 140 Q70 122 70 104 Z"
        fill={fill('quads')} stroke={stroke} strokeWidth="0.8" />

      {/* HAMSTRINGS (thighs back — show slightly darker) */}
      <path d="M38 106 Q34 122 36 140 L52 140 Q50 124 50 106 Z"
        fill={fill('hamstrings')} stroke={stroke} strokeWidth="0.5" opacity="0.5" />
      <path d="M82 106 Q86 122 84 140 L68 140 Q70 124 70 106 Z"
        fill={fill('hamstrings')} stroke={stroke} strokeWidth="0.5" opacity="0.5" />

      {/* CALVES */}
      <path d="M36 140 Q34 155 37 170 L50 170 Q52 155 52 140 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />
      <path d="M84 140 Q86 155 83 170 L70 170 Q68 155 68 140 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />

      {/* FEET */}
      <ellipse cx="43" cy="174" rx="9" ry="5" fill="#1e293b" stroke={stroke} strokeWidth="0.8" />
      <ellipse cx="77" cy="174" rx="9" ry="5" fill="#1e293b" stroke={stroke} strokeWidth="0.8" />
    </svg>
  );
};

// ─── ARKA GÖRÜNÜM ───
const MuscleDiagramBack = ({ exercise }) => {
  const muscles = getMuscleGroups(exercise);
  const all = [...muscles.primary, ...muscles.secondary];
  const isPrimary = (m) => muscles.primary.includes(m);
  const isActive = (m) => all.includes(m) || all.includes('full');
  const fill = (m) => {
    if (all.includes('full')) return '#92400e'; // full body = dim amber for all
    if (!isActive(m)) return '#1e293b';
    return isPrimary(m) ? '#f59e0b' : '#92400e';
  };
  const stroke = '#334155';
  return (
    <svg viewBox="0 0 120 200" className="w-16 h-28 shrink-0" fill="none">
      {/* HEAD */}
      <ellipse cx="60" cy="16" rx="11" ry="13" fill="#334155" stroke={stroke} strokeWidth="1" />
      <rect x="55" y="27" width="10" height="8" rx="2" fill="#334155" />
      {/* TRAPEZIUS */}
      <path d="M42 36 Q50 30 60 30 Q70 30 78 36 L80 46 Q70 40 60 40 Q50 40 40 46 Z"
        fill={fill('back')} stroke={stroke} strokeWidth="0.8" />
      {/* REAR DELTOIDS */}
      <ellipse cx="34" cy="43" rx="10" ry="11" fill={fill('shoulder')} stroke={stroke} strokeWidth="0.8" />
      <ellipse cx="86" cy="43" rx="10" ry="11" fill={fill('shoulder')} stroke={stroke} strokeWidth="0.8" />
      {/* TRICEPS */}
      <path d="M25 50 Q21 60 23 70 L30 70 Q29 60 32 52 Z"
        fill={fill('triceps')} stroke={stroke} strokeWidth="0.8" />
      <path d="M95 50 Q99 60 97 70 L90 70 Q91 60 88 52 Z"
        fill={fill('triceps')} stroke={stroke} strokeWidth="0.8" />
      {/* FOREARMS */}
      <path d="M22 71 Q20 81 22 90 L29 90 Q28 81 29 71 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />
      <path d="M98 71 Q100 81 98 90 L91 90 Q92 81 91 71 Z"
        fill="#334155" stroke={stroke} strokeWidth="0.8" />
      {/* LATS */}
      <path d="M40 46 Q35 60 37 80 L52 80 Q54 64 56 50 Z"
        fill={fill('back')} stroke={stroke} strokeWidth="0.8" />
      <path d="M80 46 Q85 60 83 80 L68 80 Q66 64 64 50 Z"
        fill={fill('back')} stroke={stroke} strokeWidth="0.8" />
      {/* LOWER BACK */}
      <path d="M44 80 Q52 84 60 84 Q68 84 76 80 L74 96 Q66 100 60 100 Q54 100 46 96 Z"
        fill={fill('lowerback')} stroke={stroke} strokeWidth="0.8" />
      {/* GLUTES */}
      <path d="M46 96 Q38 98 35 108 Q46 114 60 114 Q74 114 85 108 Q82 98 74 96 Z"
        fill={fill('glutes')} stroke={stroke} strokeWidth="0.8" />
      {/* HAMSTRINGS */}
      <path d="M37 107 Q33 123 35 142 L51 142 Q50 124 50 107 Z"
        fill={fill('hamstrings')} stroke={stroke} strokeWidth="0.8" />
      <path d="M83 107 Q87 123 85 142 L69 142 Q70 124 70 107 Z"
        fill={fill('hamstrings')} stroke={stroke} strokeWidth="0.8" />
      {/* CALVES BACK */}
      <path d="M35 142 Q33 157 36 172 L50 172 Q52 157 51 142 Z"
        fill="#2d3748" stroke={stroke} strokeWidth="0.8" />
      <path d="M85 142 Q87 157 84 172 L70 172 Q69 157 69 142 Z"
        fill="#2d3748" stroke={stroke} strokeWidth="0.8" />
      {/* FEET */}
      <ellipse cx="43" cy="176" rx="9" ry="5" fill="#1e293b" stroke={stroke} strokeWidth="0.8" />
      <ellipse cx="77" cy="176" rx="9" ry="5" fill="#1e293b" stroke={stroke} strokeWidth="0.8" />
    </svg>
  );
};

const MUSCLE_LABELS = { chest: 'Göğüs', shoulder: 'Omuz', triceps: 'Triseps', back: 'Sırt', biceps: 'Biseps', quads: 'Quads', hamstrings: 'Hamstring', glutes: 'Glut', abs: 'Karın', lowerback: 'Alt Sırt' };

const RPE_CONFIG = {
  6: { label: 'Çok Kolay', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
  7: { label: 'Optimal', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  8: { label: 'Zor', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  9: { label: 'Çok Zor', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  10: { label: 'Maksimal', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
};
const TEMPO_PHASES = [
  { key: 'ecc', label: 'İniş', labelEn: 'Eccentric', pos: 0 },
  { key: 'bot', label: 'Alt Bekleme', labelEn: 'Bottom', pos: 1 },
  { key: 'con', label: 'Kalkış', labelEn: 'Concentric', pos: 2 },
  { key: 'top', label: 'Tepe Sıkış', labelEn: 'Top', pos: 3 },
];
const parseTempo = (tempoStr) => {
  if (!tempoStr || tempoStr === 'Kontrollü' || tempoStr === 'Yavaş & Kontrollü') return null;
  const clean = tempoStr.replace(/[^0-9X]/gi, '');
  if (clean.length < 4) return null;
  return [clean[0], clean[1], clean[2], clean[3]];
};
const TempoVisualizer = ({ tempoStr }) => {
  const [activePhase, setActivePhase] = useState(null);
  const parsed = parseTempo(tempoStr);
  if (!parsed) return (
    <span className="text-[9px] text-slate-500">
      Tempo: <span className="text-slate-300 font-mono">{tempoStr}</span>
    </span>
  );
  const phaseColors = ['#60a5fa', '#a78bfa', '#f59e0b', '#34d399'];
  return (
    <div className="mt-1">
      <p className="text-[9px] text-slate-500 mb-1.5">
        Tempo: <span className="font-mono text-slate-300">{tempoStr}</span>
      </p>
      <div className="flex gap-1.5">
        {TEMPO_PHASES.map((phase, i) => {
          const val = parsed[i];
          const isX = val?.toUpperCase() === 'X';
          const isActive = activePhase === i;
          const color = phaseColors[i];
          return (
            <button
              key={phase.key}
              onClick={() => setActivePhase(isActive ? null : i)}
              style={{
                flex: 1,
                padding: '6px 4px',
                borderRadius: 8,
                border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.06)'}`,
                background: isActive ? `${color}22` : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: 15,
                fontWeight: 900,
                color: isActive ? color : '#94a3b8',
                fontFamily: 'monospace',
                lineHeight: 1,
              }}>
                {isX ? '⚡' : val}
              </div>
              <div style={{
                fontSize: 8,
                color: isActive ? color : '#475569',
                marginTop: 3,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}>
                {phase.label}
              </div>
              {isActive && (
                <div style={{
                  fontSize: 8,
                  color: '#94a3b8',
                  marginTop: 2,
                }}>
                  {isX ? 'Patlayıcı' : val === '0' ? 'Bekleme yok' : `${val} sn`}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {activePhase !== null && (
        <div style={{
          marginTop: 6,
          padding: '6px 10px',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          fontSize: 10,
          color: '#94a3b8',
          lineHeight: 1.5,
        }}>
          {activePhase === 0 && 'Hareketi kontrollü olarak indiriyorsun. Kas gerilim altında kalır.'}
          {activePhase === 1 && (parsed[1] === '0' ? 'Alt noktada bekleme yok — hemen kalk.' : `Alt noktada ${parsed[1]} sn bekle. Elastik gerilimi kontrol et.`)}
          {activePhase === 2 && (parsed[2]?.toUpperCase() === 'X' ? 'Maksimum hızda patlayıcı kaldır!' : `${parsed[2]} sn sürede kaldır. Kasılmayı hissederek çalış.`)}
          {activePhase === 3 && (parsed[3] === '0' ? 'Tepe noktada bekleme yok — devam et.' : `Tepe noktada ${parsed[3]} sn sıkıştır. Maksimum kas aktivasyonu.`)}
        </div>
      )}
    </div>
  );
};
const MetconScoreLogger = ({ metcon, darkMode }) => {
  const [rounds, setRounds] = useState('');
  const [timeMin, setTimeMin] = useState('');
  const [timeSec, setTimeSec] = useState('');
  const [saved, setSaved] = useState(false);

  const saveScore = () => {
    if (!rounds && !timeMin) return;
    const score = {
      type: metcon.type,
      structure: metcon.structure,
      rounds: rounds || null,
      time: timeMin ? `${timeMin}:${timeSec.padStart(2,'0')}` : null,
      date: new Date().toLocaleDateString('tr-TR'),
      timestamp: Date.now(),
    };
    const existing = JSON.parse(localStorage.getItem('arete_metcon_scores') || '[]');
    localStorage.setItem('arete_metcon_scores', JSON.stringify([score, ...existing].slice(0, 100)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isAmrap = metcon.type === 'AMRAP';
  const isForTime = metcon.type === 'FOR TIME' || metcon.type === 'CHIPPER';

  return (
    <div style={{
      marginTop: 12, padding: '10px 14px', borderRadius: 10,
      background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)',
    }}>
      <p style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        Skor Kaydet
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {(isAmrap || (!isAmrap && !isForTime)) && (
          <input type="number" value={rounds} onChange={e => setRounds(e.target.value)}
            placeholder="Tur"
            style={{
              flex: 1, minWidth: 60, padding: '8px 12px', borderRadius: 8, textAlign: 'center',
              background: darkMode ? '#1e293b' : '#f8fafc',
              border: '1px solid rgba(96,165,250,0.2)', color: darkMode ? '#e2e8f0' : '#1e293b',
              fontSize: 14, fontWeight: 700, fontFamily: 'monospace', outline: 'none',
            }} />
        )}
        {(isForTime || (!isAmrap && !isForTime)) && (
          <>
            <input type="number" value={timeMin} onChange={e => setTimeMin(e.target.value)}
              placeholder="dk"
              style={{
                width: 52, padding: '8px 6px', borderRadius: 8, textAlign: 'center',
                background: darkMode ? '#1e293b' : '#f8fafc',
                border: '1px solid rgba(96,165,250,0.2)', color: darkMode ? '#e2e8f0' : '#1e293b',
                fontSize: 14, fontWeight: 700, fontFamily: 'monospace', outline: 'none',
              }} />
            <span style={{ color: '#64748b' }}>:</span>
            <input type="number" value={timeSec} onChange={e => setTimeSec(e.target.value)}
              placeholder="sn" min="0" max="59"
              style={{
                width: 52, padding: '8px 6px', borderRadius: 8, textAlign: 'center',
                background: darkMode ? '#1e293b' : '#f8fafc',
                border: '1px solid rgba(96,165,250,0.2)', color: darkMode ? '#e2e8f0' : '#1e293b',
                fontSize: 14, fontWeight: 700, fontFamily: 'monospace', outline: 'none',
              }} />
          </>
        )}
        <button onClick={saveScore}
          style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: saved ? '#22c55e' : 'rgba(96,165,250,0.15)',
            border: '1px solid rgba(96,165,250,0.3)',
            color: saved ? '#fff' : '#60a5fa', cursor: 'pointer',
          }}>
          {saved ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
};

const ExerciseItem = ({ exercise, isMetcon = false, onLogUpdate, currentLog, onSwap }) => {
  const darkMode = React.useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [rpe, setRpe] = useState(currentLog?.rpe ? parseInt(currentLog.rpe) : 7);
  const [restTimer, setRestTimer] = useState(null);
  const [restActive, setRestActive] = useState(false);
  useEffect(() => {
    if (!restActive || restTimer === null) return;
    if (restTimer <= 0) { setRestActive(false); setRestTimer(null); return; }
    const t = setTimeout(() => setRestTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [restTimer, restActive]);
  const setsReps = exercise.sets ? `${exercise.sets}×${exercise.reps}` : "";
  const tempo = exercise.tempo || "";
  const weightRx = exercise.weight_rx || "";
  const rpeInfo = RPE_CONFIG[rpe] || RPE_CONFIG[7];
  const handleRpeChange = (val) => {
    setRpe(val);
    if (onLogUpdate) onLogUpdate(exercise.name, 'rpe', val);
  };
  return (
    <div className={`${darkMode ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden mb-1.5 hover:border-amber-500/30 transition-colors`}>
      {/* Header row */}
      <div className="px-3 py-2.5 flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className={`${darkMode ? 'text-white' : 'text-gray-900'} text-sm font-semibold flex-1 truncate`}>{exercise.name}</span>
        {!isMetcon && setsReps && (
          <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">{setsReps}</span>
        )}
        {weightRx && <span className="text-[9px] text-slate-400 shrink-0 hidden sm:inline">{weightRx}</span>}
        {onSwap && (
          <button onClick={e => { e.stopPropagation(); onSwap(); }}
            title="Egzersizi degistir"
            className="text-slate-600 hover:text-amber-500 transition-colors shrink-0"
            style={{ fontSize: 11, padding: '2px 6px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
            ↻
          </button>
        )}
        {isOpen
          ? <ChevronUp size={14} className="text-amber-400 shrink-0" />
          : <ChevronDown size={14} className="text-slate-500 shrink-0" />}
      </div>
      {/* Expanded body */}
      {isOpen && (
        <div className={`${darkMode ? 'bg-slate-900/60 border-slate-700/30' : 'bg-gray-50 border-gray-200'} border-t p-3`}>
          {/* ÖN / ARKA kas diyagramları */}
          <div className="flex gap-2 mb-3">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">ÖN</span>
              <MuscleDiagram exercise={exercise} />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">ARKA</span>
              <MuscleDiagramBack exercise={exercise} />
            </div>
            <div className="flex-1 flex flex-col gap-1.5 pl-1">
              {/* Demo + kas etiketleri */}
              <div className="flex flex-wrap gap-1">
                <a href={getGifSearchUrl(exercise.name)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full hover:bg-amber-500/20 transition-colors">
                  <PlayCircle size={10} /> Demo
                </a>
                {getMuscleGroups(exercise).primary.filter(m => m !== 'full').map(m => (
                  <span key={m} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-700/60 text-slate-300 border-slate-600/40' : 'bg-gray-100 text-gray-600 border-gray-300'} uppercase border`}>
                    {MUSCLE_LABELS[m] || m}
                  </span>
                ))}
              </div>
              {/* Açıklama */}
              <p className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} text-[11px] leading-relaxed line-clamp-3`}>{exercise.description}</p>
              {/* Not */}
              {exercise.note && (
                <p className="text-[10px] text-amber-400 bg-amber-500/8 border border-amber-500/15 px-2 py-1 rounded">
                  💡 {exercise.note}
                </p>
              )}
              {/* Dinlenme */}
              {exercise.rest && (
                <span className="text-[9px] text-slate-500">
                  Dinlenme: <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>{exercise.rest}</span>
                </span>
              )}
            </div>
          </div>
          {/* KAS AKTİVASYON BARLARI */}
          {(() => {
            const muscleGroups = getMuscleGroups(exercise);
            const primaryMuscles = muscleGroups.primary.filter(m => m !== 'full');
            const secondaryMuscles = muscleGroups.secondary.filter(m => m !== 'full');
            const allDisplayMuscles = [
              ...primaryMuscles.map(m => ({ key: m, isPrimary: true })),
              ...secondaryMuscles.map(m => ({ key: m, isPrimary: false })),
            ];
            if (allDisplayMuscles.length === 0) return null;
            // Activation percentages — primary gets higher values, secondary lower
            const primaryPcts = [85, 75, 65, 55, 48];
            const secondaryPcts = [35, 28, 22];
            return (
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                  Kas Aktivasyonu
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {allDisplayMuscles.map(({ key, isPrimary }, idx) => {
                    const pct = isPrimary
                      ? (primaryPcts[primaryMuscles.indexOf(key)] ?? 40)
                      : (secondaryPcts[secondaryMuscles.indexOf(key)] ?? 20);
                    const barColor = isPrimary ? '#f59e0b' : '#78350f';
                    const textColor = isPrimary ? '#fbbf24' : '#92400e';
                    const label = MUSCLE_LABELS[key] || key;
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Label */}
                        <span style={{
                          fontSize: 9,
                          color: textColor,
                          fontWeight: isPrimary ? 700 : 400,
                          width: 60,
                          flexShrink: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}>
                          {label}
                        </span>
                        {/* Bar track */}
                        <div style={{
                          flex: 1,
                          height: isPrimary ? 6 : 4,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: isPrimary
                              ? `linear-gradient(90deg, #92400e, ${barColor})`
                              : barColor,
                            borderRadius: 3,
                            transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                          }} />
                        </div>
                        {/* Percentage */}
                        <span style={{
                          fontSize: 9,
                          color: textColor,
                          fontWeight: isPrimary ? 700 : 400,
                          width: 24,
                          textAlign: 'right',
                          flexShrink: 0,
                          fontFamily: 'monospace',
                        }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          {/* TEMPO VİZÜALİZER — tempo varsa göster */}
          {tempo && (
            <div className={`mb-3 p-2.5 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100 border border-gray-200'}`}>
              <TempoVisualizer tempoStr={tempo} />
            </div>
          )}
          {/* Önceki antrenman verisi */}
          {onLogUpdate && (() => {
            const history = JSON.parse(localStorage.getItem('arete_history') || '[]');
            let prevLog = null;
            for (const entry of history) {
              if (entry.exercises?.[exercise.name]) {
                prevLog = entry.exercises[exercise.name];
                break;
              }
            }
            if (!prevLog?.weight) return null;

            const prevWeight = parseFloat(prevLog.weight);
            const suggestedWeight = prevWeight + 2.5;

            return (
              <div style={{
                marginBottom: 8, padding: '6px 10px', borderRadius: 8,
                background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Son antrenman
                  </span>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', marginTop: 1 }}>
                    {prevLog.weight} kg {prevLog.reps ? `× ${prevLog.reps}` : ''}
                    {prevLog.rpe ? <span style={{ color: '#64748b' }}> · RPE {prevLog.rpe}</span> : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Öneri
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace', marginTop: 1 }}>
                    {suggestedWeight} kg ↑
                  </div>
                </div>
              </div>
            );
          })()}
                    {/* AĞIRLIK / TEKRAR giriş alanları */}
          {onLogUpdate && (
            <div className={`pt-2.5 border-t ${darkMode ? 'border-slate-700/30' : 'border-gray-200'} grid grid-cols-2 gap-2 mb-3`}>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-wide mb-1">Ağırlık</label>
                <input
                  type="text" inputMode="decimal" placeholder="kg"
                  className={`w-full ${darkMode ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-600' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none`}
                  onChange={(e) => onLogUpdate(exercise.name, 'weight', e.target.value)}
                  defaultValue={currentLog?.weight || ''}
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 uppercase tracking-wide mb-1">Tekrar</label>
                <input
                  type="text" inputMode="numeric" placeholder="reps"
                  className={`w-full ${darkMode ? 'bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-600' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none`}
                  onChange={(e) => onLogUpdate(exercise.name, 'reps', e.target.value)}
                  defaultValue={currentLog?.reps || ''}
                />
              </div>
            </div>
          )}
          {/* RPE SLIDER */}
          {onLogUpdate && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: rpeInfo.bg,
                border: `1px solid ${rpeInfo.border}`,
                transition: 'all 0.25s ease',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  ⚡ RPE Skoru
                </span>
                <div className="flex items-center gap-1.5">
                  <span style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: rpeInfo.color,
                    fontFamily: 'monospace',
                    lineHeight: 1,
                    textShadow: `0 0 12px ${rpeInfo.color}66`,
                  }}>
                    {rpe}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: rpeInfo.color,
                    opacity: 0.85,
                  }}>
                    {rpeInfo.label}
                  </span>
                </div>
              </div>
              {/* Slider */}
              <input
                type="range"
                min={6}
                max={10}
                step={1}
                value={rpe}
                onChange={(e) => handleRpeChange(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: rpeInfo.color, cursor: 'pointer' }}
              />
              {/* Scale labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                {[6, 7, 8, 9, 10].map(v => (
                  <span key={v} style={{
                    fontSize: 8,
                    color: v === rpe ? rpeInfo.color : '#475569',
                    fontWeight: v === rpe ? 700 : 400,
                    transition: 'color 0.2s',
                  }}>
                    {v}
                  </span>
                ))}
              </div>
              {/* Context hint */}
              <p style={{ fontSize: 9, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>
                {rpe === 6 && 'Çok hafif. Isınma veya toparlanma seti için uygun.'}
                {rpe === 7 && 'Optimal bölge. 3 tekrar rezervin var — sürdürülebilir yoğunluk.'}
                {rpe === 8 && '2 tekrar rezervin var. Güç ve hacim için ideal.'}
                {rpe === 9 && '1 tekrar rezervin var. Yoğun gün — formu koru.'}
                {rpe === 10 && 'Maksimal efor. Yarışma veya test günü için sakla.'}
              </p>
            </div>
          )}
          {/* Rest Timer */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {!restActive ? (
              <>
                {[60, 90, 120, 180].map(sec => (
                  <button key={sec} onClick={() => { setRestTimer(sec); setRestActive(true); }}
                    className="text-[9px] font-bold px-2 py-1 rounded-lg border transition-all"
                    style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>
                    {sec < 60 ? `${sec}sn` : `${sec/60}dk`}
                  </button>
                ))}
                <span className="text-[9px] text-slate-600">dinlenme</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-sm font-black font-mono"
                  style={{ color: restTimer <= 10 ? '#ef4444' : '#f59e0b' }}>
                  {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
                </div>
                <button onClick={() => { setRestActive(false); setRestTimer(null); }}
                  className="text-[9px] px-2 py-1 rounded-lg text-slate-500 border border-slate-700">
                  Sifirla
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ title, subTitle, icon: Icon, children, className = "", number }) => {
  const darkMode = React.useContext(ThemeContext);
  const [open, setOpen] = useState(true);
  return (
    <div className={`${darkMode ? 'bg-slate-900/40' : 'bg-white/70 shadow-sm'} border-l-2 border-amber-500 rounded-r mb-3 overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`w-full ${darkMode ? 'bg-slate-900/80 border-slate-800/50' : 'bg-gray-50 border-gray-200'} px-3 py-2 flex items-center gap-2 border-b text-left`}
      >
        {number !== undefined && (
          <span className="text-[10px] font-black text-amber-500/60 font-mono w-5 shrink-0">{String(number).padStart(2, '0')}</span>
        )}
        <div className={`p-1.5 ${darkMode ? 'bg-slate-950' : 'bg-white'} rounded text-amber-500 shrink-0`}><Icon size={14} /></div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'} uppercase tracking-wide`}>{title}</h3>
          {subTitle && <p className="text-[9px] text-amber-500/70 uppercase truncate">{subTitle}</p>}
        </div>
        <div className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown size={14} className={darkMode ? 'text-slate-500' : 'text-gray-400'} />
        </div>
      </button>
      {open && <div className={`p-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{children}</div>}
    </div>
  );
};

// Stepper Component - Artı/Eksi butonlu sayı girişi (mobil uyumlu)
const Stepper = ({ value, onChange, min = 0, max = 999, step = 1, label, unit }) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">{label}</span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 text-white text-xl font-bold flex items-center justify-center active:scale-90 active:bg-amber-600"
      >−</button>
      <div className="text-center w-16">
        <span className="text-2xl font-black text-white tabular-nums">{value}</span>
        <span className="block text-[9px] text-amber-500 uppercase">{unit}</span>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 text-white text-xl font-bold flex items-center justify-center active:scale-90 active:bg-amber-600"
      >+</button>
    </div>
  </div>
);

// Güç Bloku Odak Modu — v2 (superset, rest timer, memory, syllabus overlay)
const StrengthFocusScreen = ({ workout, onComplete, onExit }) => {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(5);
  const [phase, setPhase] = useState('set'); // 'set' | 'rest' | 'superset_prompt'
  const [restTime, setRestTime] = useState(120);
  const [maxRestTime, setMaxRestTime] = useState(120);
  const [completedSets, setCompletedSets] = useState([]);
  const [setLogs, setSetLogs] = useState([]);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  // Tüm egzersizleri blok bilgisiyle düzleştir
  const allExercises = workout.strength.flatMap((block, bIdx) =>
    block.exercises.map((ex, eIdx) => ({
      ...ex,
      blockIndex: bIdx,
      blockLabel: block.type,
      exerciseIndex: eIdx,
      blockExCount: block.exercises.length,
      blockId: bIdx,
      posInBlock: eIdx,
    }))
  );

  const totalEx = allExercises.length;
  const cur = allExercises[currentExIdx] || allExercises[0];
  const targetSets = cur?.sets || 5;
  const targetReps = cur?.reps || 5;

  // Önceki antrenman hafızasından değer doldur
  const getMemory = (exName) => {
    const history = JSON.parse(localStorage.getItem('arete_history') || '[]');
    for (const entry of history) {
      if (entry.exercises?.[exName]) return entry.exercises[exName];
    }
    return null;
  };

  useEffect(() => {
    const mem = getMemory(cur?.name);
    if (mem) {
      if (mem.weight) setWeight(parseFloat(mem.weight) || 20);
      if (mem.reps) setReps(parseInt(mem.reps) || 5);
    } else {
      setReps(parseInt(targetReps) || 5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExIdx]);

  // Dinlenme zamanlayıcısı
  useEffect(() => {
    if (phase !== 'rest') return;
    if (restTime <= 0) {
      setAlarmActive(true);
      setTimeout(() => setAlarmActive(false), 4000);
      return;
    }
    if (restTime <= 3) setAlarmActive(true);
    else setAlarmActive(false);
    const t = setInterval(() => setRestTime(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, restTime]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const totalSetsAll = allExercises.reduce((s, ex) => s + (parseInt(ex.sets) || 5), 0);
  const doneCount = completedSets.length;
  const progress = totalSetsAll > 0 ? (doneCount / totalSetsAll) * 100 : 0;

  // Süperset tespiti
  const isSupersetBlock = cur?.blockExCount > 1;
  const isLastInBlock = cur?.posInBlock === cur?.blockExCount - 1;
  const nextInBlock = isSupersetBlock && !isLastInBlock
    ? allExercises.find(e => e.blockId === cur.blockId && e.posInBlock === cur.posInBlock + 1)
    : null;

  const handleCompleteSet = () => {
    const log = { exercise: cur.name, set: currentSet, weight, reps, timestamp: Date.now() };
    setSetLogs(prev => [...prev, log]);
    setCompletedSets(prev => [...prev, `${currentExIdx}-${currentSet}`]);

    if (isSupersetBlock && !isLastInBlock) {
      // A (veya orta egzersiz) tamamlandı → B'ye geç (set numarası değişmez)
      setPhase('superset_prompt');
    } else if (isSupersetBlock && isLastInBlock) {
      // B (son egzersiz) tamamlandı → bir sonraki tura dön veya bloğu bitir
      const nextSetNum = currentSet + 1;
      if (nextSetNum <= targetSets) {
        // A'ya geri dön
        const aExIdx = allExercises.findIndex(e => e.blockId === cur.blockId && e.posInBlock === 0);
        setCurrentSet(nextSetNum);
        setCurrentExIdx(aExIdx);
        const rt = parseInt(cur.rest) || 90;
        setMaxRestTime(rt); setRestTime(rt);
        setPhase('rest');
      } else {
        // Tüm turlar bitti → sonraki bloğa geç
        const nextBlockFirstIdx = allExercises.findIndex(e => e.blockId === cur.blockId + 1);
        if (nextBlockFirstIdx !== -1) {
          setCurrentExIdx(nextBlockFirstIdx);
          setCurrentSet(1);
          const rt = 120;
          setMaxRestTime(rt); setRestTime(rt);
          setPhase('rest');
        } else if (currentExIdx < totalEx - 1) {
          setCurrentExIdx(prev => prev + 1);
          setCurrentSet(1);
          const rt = 120;
          setMaxRestTime(rt); setRestTime(rt);
          setPhase('rest');
        } else {
          onComplete(setLogs);
        }
      }
    } else {
      // Normal (superset değil)
      if (currentSet < targetSets) {
        setCurrentSet(prev => prev + 1);
        const rt = parseInt(cur.rest) || 120;
        setMaxRestTime(rt); setRestTime(rt);
        setPhase('rest');
      } else {
        if (currentExIdx < totalEx - 1) {
          setCurrentExIdx(prev => prev + 1);
          setCurrentSet(1);
          const rt = 120;
          setMaxRestTime(rt); setRestTime(rt);
          setPhase('rest');
        } else {
          onComplete(setLogs);
        }
      }
    }
  };

  const startNextAfterRest = () => { setPhase('set'); setAlarmActive(false); };
  const skipRest = () => { setRestTime(0); startNextAfterRest(); };
  const addTime = (secs) => { setRestTime(p => p + secs); setMaxRestTime(p => p + secs); };

  const startSupersetB = () => {
    const bExIdx = allExercises.findIndex(e => e.blockId === cur.blockId && e.posInBlock === cur.posInBlock + 1);
    if (bExIdx !== -1) {
      setCurrentExIdx(bExIdx);
      // currentSet değişmez – aynı tur
      setPhase('set');
    }
  };

  // Müfredat overlay
  const SyllabusOverlay = () => {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: 'rgba(13,27,42,0.97)' }}>
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid #1E3A5F' }}>
          <h2 className="text-white font-black text-xl tracking-widest uppercase">MÜFREDAT</h2>
          <button onClick={() => setShowSyllabus(false)} className="text-slate-400"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {workout.strength.map((block, bIdx) => (
            <div key={bIdx}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#E09F3E' }}>{block.type}</p>
              {block.exercises.map((ex, eIdx) => {
                const globalIdx = workout.strength
                  .slice(0, bIdx)
                  .reduce((acc, b) => acc + b.exercises.length, 0) + eIdx;
                const isDone = completedSets.filter(k => k.startsWith(`${globalIdx}-`)).length >= (parseInt(ex.sets) || 5);
                const isActive = globalIdx === currentExIdx;
                return (
                  <div key={eIdx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                    style={{
                      background: isActive ? 'rgba(224,159,62,0.12)' : 'rgba(30,58,92,0.5)',
                      border: `1px solid ${isActive ? '#E09F3E' : '#1E3A5F'}`,
                      opacity: isDone && !isActive ? 0.45 : 1,
                    }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDone ? '#22c55e' : isActive ? '#E09F3E' : '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isDone && <CheckCircle size={12} color="white" />}
                      {isActive && !isDone && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D1B2A' }} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: isActive ? '#E09F3E' : isDone ? '#64748b' : '#f1f5f9' }}>{ex.name}</p>
                      <p className="text-xs text-slate-500">{ex.sets} set × {ex.reps} tekrar</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!cur) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>
      {showSyllabus && <SyllabusOverlay />}

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #1E3A5F' }}>
        <button onClick={onExit} className="text-slate-400"><X size={22} /></button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#E09F3E' }}>
            {cur.blockLabel?.split(' – ')[0] || 'GÜÇ BLOKU'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Hareket {currentExIdx + 1} / {totalEx}</p>
        </div>
        <button onClick={() => setShowSyllabus(true)} className="text-slate-400"><Layout size={22} /></button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1E3A5F', flexShrink: 0 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #E09F3E, #C8861E)', transition: 'width 0.5s ease' }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-5 py-6">

        {/* ─── DİNLENME ZAMANLAYICISI ─── */}
        {phase === 'rest' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-scale">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">DİNLENME</p>

            <div className={`relative mb-8 ${alarmActive ? 'animate-alarm-flash' : ''}`}
              style={{ width: 200, height: 200, borderRadius: '50%', border: `4px solid ${alarmActive ? '#E09F3E' : '#1E3A5F'}`, transition: 'border-color 0.3s' }}>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="92" stroke="#1E3A5F" strokeWidth="8" fill="none" />
                <circle cx="100" cy="100" r="92"
                  stroke="#E09F3E" strokeWidth="8" fill="none"
                  strokeDasharray={578}
                  strokeDashoffset={578 - (578 * Math.max(0, restTime) / maxRestTime)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black tabular-nums" style={{ fontSize: 52, color: alarmActive ? '#E09F3E' : '#f1f5f9', lineHeight: 1, transition: 'color 0.3s' }}>
                  {restTime <= 0 ? '✓' : formatTime(restTime)}
                </span>
                {restTime > 0 && <span className="text-xs text-slate-500 mt-1">Sonraki: Set {currentSet} / {targetSets}</span>}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={() => addTime(30)}
                className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm">
                +30 sn
              </button>
              <button onClick={skipRest}
                className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm">
                Atla →
              </button>
            </div>

            {restTime <= 0 && (
              <button onClick={startNextAfterRest}
                className="w-full max-w-xs py-5 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98] animate-fade-in-scale"
                style={{ backgroundColor: '#E09F3E', color: '#0D1B2A' }}>
                DEVAM ET →
              </button>
            )}
          </div>
        )}

        {/* ─── SÜPERSET GEÇİŞİ ─── */}
        {phase === 'superset_prompt' && nextInBlock && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-scale">
            <div className="px-4 py-1.5 rounded-full mb-8" style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.35)' }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#E09F3E' }}>SÜPERSET GEÇİŞİ</span>
            </div>

            {/* Akış görselleştirici: cur = tamamlanan (A), sonraki = B */}
            <div className="flex items-center gap-3 mb-10">
              {Array.from({ length: cur.blockExCount }).map((_, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: `2px solid ${i <= cur.posInBlock ? '#E09F3E' : '#1E3A5F'}`,
                    background: i < cur.posInBlock ? '#22c55e' : i === cur.posInBlock ? 'rgba(224,159,62,0.25)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {i < cur.posInBlock
                      ? <CheckCircle size={16} color="#fff" />
                      : i === cur.posInBlock
                        ? <CheckCircle size={16} color="#E09F3E" />
                        : <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{String.fromCharCode(65 + i)}</span>}
                  </div>
                  {i < cur.blockExCount - 1 && (
                    <div style={{ width: 24, height: 2, background: i < cur.posInBlock ? '#22c55e' : '#1E3A5F' }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-sm text-slate-400 mb-2">Sıradaki hareket:</p>
            <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">{nextInBlock.name}</h2>
            <p className="text-sm mb-10" style={{ color: '#E09F3E' }}>Set {currentSet} / {nextInBlock.sets}</p>

            <button onClick={startSupersetB}
              className="w-full max-w-xs py-5 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98]"
              style={{ backgroundColor: '#E09F3E', color: '#0D1B2A' }}>
              ⚡ {String.fromCharCode(65 + nextInBlock.posInBlock)}'Yİ BAŞLAT
            </button>
            <button onClick={() => { const rt = 90; setMaxRestTime(rt); setRestTime(rt); setPhase('rest'); }}
              className="mt-4 text-sm text-slate-500 underline">
              Önce dinlen (90sn)
            </button>
          </div>
        )}

        {/* ─── AKTİF SET ─── */}
        {phase === 'set' && (
          <div className="animate-fade-in-scale w-full">
            {/* Blok etiketi */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E09F3E' }}>{cur.blockLabel}</p>

            {/* Hareket adı */}
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-1">{cur.name}</h2>
            <p className="text-sm mb-5" style={{ color: '#E09F3E' }}>
              Hedef: {targetSets} set × {targetReps} tekrar
              {cur.weight_rx && <span className="text-slate-500 ml-2">({cur.weight_rx})</span>}
            </p>

            {/* Kas haritası + demo */}
            <div className="flex gap-4 mb-5 p-4 rounded-2xl" style={{ background: 'rgba(30,58,92,0.5)', border: '1px solid #1E3A5F' }}>
              <MuscleDiagram exercise={cur} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {getMuscleGroups(cur).primary.filter(m => m !== 'full').map(m => (
                      <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.35)', color: '#E09F3E' }}>
                        {({ chest: 'Göğüs', shoulder: 'Omuz', triceps: 'Triseps', back: 'Sırt', biceps: 'Biseps', quads: 'Quads', hamstrings: 'Hamstring', glutes: 'Glut', abs: 'Karın', lowerback: 'Alt Sırt' })[m] || m}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cur.description}</p>
                  {cur.note && <p className="text-xs mt-2 px-2 py-1 rounded-lg" style={{ color: '#E09F3E', background: 'rgba(224,159,62,0.08)' }}>💡 {cur.note}</p>}
                </div>
                <a href={getGifSearchUrl(cur.name)} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ color: '#E09F3E', background: 'rgba(224,159,62,0.12)', border: '1px solid rgba(224,159,62,0.35)' }}>
                  <PlayCircle size={13} /> Demo İzle
                </a>
              </div>
            </div>

            {/* Set daireleri */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: targetSets }).map((_, i) => {
                const done = completedSets.includes(`${currentExIdx}-${i + 1}`);
                const active = i + 1 === currentSet;
                return (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: done ? '#22c55e' : active ? 'rgba(224,159,62,0.12)' : '#1E3A5F',
                    border: `2px solid ${done ? '#22c55e' : active ? '#E09F3E' : '#1E3A5F'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: done ? '#fff' : active ? '#E09F3E' : '#64748b',
                    transition: 'all 0.2s ease'
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                );
              })}
            </div>

            {/* Stepper'lar */}
            <div className="flex justify-center gap-6 py-6 px-4 rounded-2xl mb-6 bg-slate-800/50 border border-slate-700/50">
              <Stepper value={weight} onChange={setWeight} step={2.5} label="Ağırlık" unit="KG" />
              <div className="w-px bg-slate-700" />
              <Stepper value={reps} onChange={setReps} step={1} label="Tekrar" unit="REPS" />
            </div>

            {/* Tamamla butonu */}
            <button onClick={handleCompleteSet}
              className="w-full py-5 rounded-2xl font-bold text-lg tracking-wide active:scale-[0.98]"
              style={{ backgroundColor: '#E09F3E', color: '#0D1B2A' }}>
              SETİ TAMAMLA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Kondisyon / MetCon Odak Modu
const MetconFocusScreen = ({ workout, onComplete, onExit }) => {
  const isTabata = workout.metcon?.type === 'TABATA';
  const exercises = workout.metcon?.exercises || [];

  // ===================== TABATA MODE =====================
  const WORK_SECS = 40;
  const REST_SECS = 20;
  const TABATA_ROUNDS = 8;

  const [tabPhase, setTabPhase] = useState('idle'); // 'idle'|'countdown'|'work'|'rest'|'done'
  const [tabCountdown, setTabCountdown] = useState(null);
  const [tabTimer, setTabTimer] = useState(WORK_SECS);
  const [tabRound, setTabRound] = useState(1);
  const [tabExIdx, setTabExIdx] = useState(0);

  // Tabata countdown (10s pre-start)
  useEffect(() => {
    if (tabPhase !== 'countdown') return;
    if (tabCountdown <= 0) { setTabPhase('work'); setTabTimer(WORK_SECS); return; }
    const t = setTimeout(() => setTabCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [tabPhase, tabCountdown]);

  // Tabata interval ticker
  useEffect(() => {
    if (tabPhase !== 'work' && tabPhase !== 'rest') return;
    if (tabTimer <= 0) {
      if (tabPhase === 'work') {
        setTabPhase('rest');
        setTabTimer(REST_SECS);
      } else {
        // Rest done — next round
        const nextRound = tabRound + 1;
        if (nextRound > TABATA_ROUNDS) {
          // Move to next exercise
          const nextEx = tabExIdx + 1;
          if (nextEx >= exercises.length) {
            setTabPhase('done');
            onComplete({ rounds: TABATA_ROUNDS, time: TABATA_ROUNDS * (WORK_SECS + REST_SECS) });
          } else {
            setTabExIdx(nextEx);
            setTabRound(1);
            setTabPhase('work');
            setTabTimer(WORK_SECS);
          }
        } else {
          setTabRound(nextRound);
          setTabPhase('work');
          setTabTimer(WORK_SECS);
        }
      }
      return;
    }
    const t = setInterval(() => setTabTimer(p => p - 1), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPhase, tabTimer]);

  const tabReset = () => {
    setTabPhase('idle'); setTabCountdown(null); setTabTimer(WORK_SECS);
    setTabRound(1); setTabExIdx(0);
  };

  // ===================== REGULAR METCON MODE =====================
  const defaultSecs = workout.metcon?.time ? parseInt(workout.metcon.time) * 60 : 12 * 60;
  const [totalTime, setTotalTime] = useState(defaultSecs);
  const [timeLeft, setTimeLeft] = useState(defaultSecs);
  const [countdown, setCountdown] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [phase, setPhase] = useState('idle');
  const totalRounds = workout.metcon?.rounds || 5;

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { setPhase('running'); setIsRunning(true); setCountdown(null); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) { setIsRunning(false); setPhase('idle'); onComplete({ rounds: currentRound, time: totalTime }); }
      return;
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const handleStart = () => { setCountdown(10); setPhase('countdown'); };
  const handlePause = () => { setIsRunning(false); setPhase('paused'); };
  const handleResume = () => { setIsRunning(true); setPhase('running'); };
  const handleStop = () => { setIsRunning(false); setPhase('idle'); setTimeLeft(totalTime); setCurrentRound(1); setCurrentExerciseIndex(0); setCompletedExercises([]); setCountdown(null); };
  const adjustDuration = (deltaMins) => { const n = Math.max(60, totalTime + deltaMins * 60); setTotalTime(n); setTimeLeft(n); };
  const handleExerciseComplete = () => {
    setCompletedExercises(prev => [...prev, `${currentRound}-${currentExerciseIndex}`]);
    if (currentExerciseIndex < exercises.length - 1) { setCurrentExerciseIndex(p => p + 1); }
    else if (currentRound < totalRounds) { setCurrentRound(p => p + 1); setCurrentExerciseIndex(0); }
    else { setIsRunning(false); setPhase('idle'); onComplete({ rounds: currentRound, time: totalTime - timeLeft }); }
  };
  const progress = (phase === 'running' || phase === 'paused') ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const RADIUS = 120;
  const CIRC = 2 * Math.PI * RADIUS;

  // ===================== TABATA UI =====================
  if (isTabata) {
    const currentEx = exercises[tabExIdx];
    const tabProgress = tabPhase === 'work'
      ? ((WORK_SECS - tabTimer) / WORK_SECS) * 100
      : tabPhase === 'rest' ? ((REST_SECS - tabTimer) / REST_SECS) * 100 : 0;
    const tabColor = tabPhase === 'work' ? '#22c55e' : tabPhase === 'rest' ? '#60a5fa' : '#E09F3E';

    return (
      <div className="fixed inset-0 z-[200] flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onExit} className="text-slate-400 hover:text-white p-1"><X size={22} /></button>
          <div className="px-3 py-1 rounded-full border text-xs font-bold" style={{ borderColor: '#E09F3E', color: '#E09F3E' }}>TABATA</div>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Phase label */}
          <div className="mb-3 text-center">
            {tabPhase === 'work' && <span className="text-green-400 font-black text-lg uppercase tracking-widest">ÇALIŞ 💪</span>}
            {tabPhase === 'rest' && <span className="text-blue-400 font-black text-lg uppercase tracking-widest">DİNLEN 😮‍💨</span>}
            {tabPhase === 'idle' && <span className="text-slate-400 text-sm uppercase tracking-widest">Hazır mısın?</span>}
            {tabPhase === 'countdown' && <span className="text-blue-400 text-sm uppercase tracking-widest">Hazırlan</span>}
            {tabPhase === 'done' && <span className="text-amber-400 font-black text-lg">Tamamlandı 🏆</span>}
          </div>

          {/* Timer circle */}
          <div className="relative w-64 h-64 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
              <circle cx="130" cy="130" r={RADIUS} stroke="#1E3A5F" strokeWidth="10" fill="none" />
              <circle cx="130" cy="130" r={RADIUS}
                stroke={tabColor} strokeWidth="10" fill="none"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC - (CIRC * tabProgress / 100)}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              {tabPhase === 'countdown' ? (
                <span className="text-7xl font-black text-blue-400 tabular-nums">{tabCountdown}</span>
              ) : tabPhase === 'done' ? (
                <CheckCircle size={64} className="text-amber-400" />
              ) : (
                <>
                  <span className="text-5xl font-black tabular-nums" style={{ color: tabColor }}>{String(tabTimer).padStart(2, '0')}</span>
                  <span className="text-slate-500 text-xs">sn</span>
                  <div className="flex items-center gap-3 mt-1">
                    {tabPhase === 'idle' && (
                      <button onClick={() => { setTabCountdown(10); setTabPhase('countdown'); }}
                        className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
                        style={{ backgroundColor: '#E09F3E' }}>
                        <PlayCircle size={28} color="#0D1B2A" />
                      </button>
                    )}
                    {(tabPhase === 'work' || tabPhase === 'rest') && (
                      <button onClick={tabReset}
                        className="w-10 h-10 rounded-full bg-red-900/60 flex items-center justify-center active:scale-90">
                        <X size={20} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Round & exercise info */}
          <div className="text-center mb-4">
            <p className="text-2xl font-black text-white">Tur {tabRound} <span className="text-slate-500">/ {TABATA_ROUNDS}</span></p>
            <p className="text-slate-400 text-xs mt-1">Egzersiz {tabExIdx + 1} / {exercises.length}</p>
          </div>

          {/* Current exercise */}
          {currentEx && (
            <div className="w-full max-w-sm">
              <div className="bg-slate-800/80 border-2 rounded-2xl p-4 text-center" style={{ borderColor: tabColor }}>
                <p className="text-white font-bold text-lg">{currentEx.name}</p>
                <p className="text-slate-400 text-xs mt-1">40sn Çalış / 20sn Dinlen</p>
              </div>
              {exercises.length > 1 && (
                <div className="mt-2 space-y-1">
                  {exercises.map((ex, i) => i !== tabExIdx && (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50">
                      <span className={`text-xs ${i < tabExIdx ? 'text-green-400 line-through' : 'text-slate-500'}`}>{ex.name}</span>
                      {i < tabExIdx && <CheckCircle size={12} className="text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tabPhase === 'done' && (
            <button onClick={onExit}
              className="mt-6 w-full max-w-sm py-4 rounded-2xl font-bold tracking-wide"
              style={{ backgroundColor: '#E09F3E', color: '#0D1B2A' }}>
              TAMAMLANDI 🏆
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===================== REGULAR METCON UI =====================
  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={onExit} className="text-slate-400 hover:text-white p-1"><X size={22} /></button>
        <div className="px-3 py-1 rounded-full border text-xs font-bold" style={{ borderColor: '#E09F3E', color: '#E09F3E' }}>
          {workout.metcon?.structure || 'AMRAP'}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-64 h-64 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={RADIUS} stroke="#1E3A5F" strokeWidth="10" fill="none" />
            <circle cx="130" cy="130" r={RADIUS}
              stroke={phase === 'countdown' ? '#60a5fa' : '#E09F3E'}
              strokeWidth="10" fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - (CIRC * progress / 100)}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {phase === 'countdown' ? (
              <>
                <span className="text-slate-400 text-xs uppercase tracking-widest">Hazırlan</span>
                <span className="text-7xl font-black text-blue-400 tabular-nums">{countdown}</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-black text-white tabular-nums tracking-tight">{formatTime(timeLeft)}</span>
                <div className="flex items-center gap-4 mt-1">
                  {phase === 'idle' && (
                    <button onClick={handleStart} className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90" style={{ backgroundColor: '#E09F3E' }}>
                      <PlayCircle size={28} color="#0D1B2A" />
                    </button>
                  )}
                  {phase === 'running' && (
                    <>
                      <button onClick={handlePause} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center active:scale-90"><Timer size={20} className="text-amber-400" /></button>
                      <button onClick={handleStop} className="w-10 h-10 rounded-full bg-red-900/60 flex items-center justify-center active:scale-90"><X size={20} className="text-red-400" /></button>
                    </>
                  )}
                  {phase === 'paused' && (
                    <>
                      <button onClick={handleResume} className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90" style={{ backgroundColor: '#E09F3E' }}><PlayCircle size={28} color="#0D1B2A" /></button>
                      <button onClick={handleStop} className="w-10 h-10 rounded-full bg-red-900/60 flex items-center justify-center active:scale-90"><X size={20} className="text-red-400" /></button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {phase === 'idle' && (
          <div className="flex items-center gap-4 mb-5">
            <button onClick={() => adjustDuration(-1)} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 text-slate-300 font-bold text-lg flex items-center justify-center active:scale-90">−</button>
            <span className="text-slate-400 text-sm">{Math.floor(totalTime / 60)} dk</span>
            <button onClick={() => adjustDuration(1)} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 text-slate-300 font-bold text-lg flex items-center justify-center active:scale-90">+</button>
          </div>
        )}

        <div className="mb-6 text-center">
          <span className="text-slate-500 text-xs uppercase tracking-widest">Tur</span>
          <p className="text-3xl font-black text-white">{currentRound} <span className="text-slate-500">/ {totalRounds}</span></p>
        </div>

        <div className="w-full max-w-sm space-y-1">
          {exercises.map((ex, idx) => {
            const isActive = idx === currentExerciseIndex;
            const isDone = completedExercises.includes(`${currentRound}-${idx}`);
            return (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? 'bg-slate-800/80 border border-slate-600' : isDone ? 'bg-green-900/20 border border-green-500/30' : 'bg-slate-900/50 opacity-40'}`}>
                <div className="flex items-center gap-3">
                  {isDone && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : isDone ? 'text-green-400' : 'text-slate-500'}`}>{ex.name}</span>
                </div>
                <span className={`text-sm font-mono ${isActive ? 'text-amber-500' : 'text-slate-600'}`}>{ex.reps}</span>
              </div>
            );
          })}
        </div>

        {phase === 'running' && (
          <button onClick={handleExerciseComplete} className="mt-6 w-full max-w-sm py-4 rounded-2xl font-bold tracking-wide active:scale-[0.98]" style={{ backgroundColor: '#E09F3E', color: '#0D1B2A' }}>
            HAREKETİ TAMAMLA ✓
          </button>
        )}
      </div>
    </div>
  );
};














const RECOVERY_QUESTIONS = [
  { key: 'sleep', emoji: '😴', label: 'Uyku Kalitesi', lo: 'Kötü', hi: 'Mükemmel' },
  { key: 'energy', emoji: '⚡', label: 'Enerji Seviyesi', lo: 'Bitik', hi: 'Enerjik' },
  { key: 'soreness', emoji: '💢', label: 'Kas Ağrısı', lo: 'Hiç yok', hi: 'Çok fazla' },
];
const RecoveryCheckIn = ({ darkMode, toast }) => {
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('arete_recovery');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use today's data
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.scores;
      }
    } catch (e) { }
    return { sleep: 3, energy: 3, soreness: 2 };
  });
  const [saved, setSaved] = useState(() => {
    try {
      const s = localStorage.getItem('arete_recovery');
      if (s) {
        const p = JSON.parse(s);
        return p.date === new Date().toDateString();
      }
    } catch (e) { }
    return false;
  });
  // Readiness: higher sleep + energy = good, higher soreness = bad
  const readiness = Math.round(
    ((scores.sleep + scores.energy + (6 - scores.soreness)) / 3) * 20
  );
  const readinessColor =
    readiness >= 70 ? '#22c55e' :
      readiness >= 45 ? '#f59e0b' :
        '#ef4444';
  const readinessLabel =
    readiness >= 70 ? 'Hazırsın' :
      readiness >= 45 ? 'Dikkatli Ol' :
        'Dinlen';
  const readinessAdvice =
    readiness >= 70
      ? 'Bugün tam güç antrenman yapabilirsin. RPE 8-9 hedefle.'
      : readiness >= 45
        ? 'Orta yoğunlukta çalış. Ağırlıkları %10 düşür, RPE 7\'de kal.'
        : 'Bugün BFR veya Recovery antrenmanı öneriyorum. Yarın için enerji biriktir.';
  const handleSave = () => {
    localStorage.setItem('arete_recovery', JSON.stringify({
      date: new Date().toDateString(),
      scores,
      readiness,
    }));
    setSaved(true);
    toast.success('✅ Toparlanma skoru kaydedildi!');
  };
  const handleReset = () => {
    localStorage.removeItem('arete_recovery');
    setSaved(false);
    setScores({ sleep: 3, energy: 3, soreness: 2 });
  };
  return (
    <div>
      {/* Readiness Score Circle */}
      <div style={{
        margin: '0 auto 20px',
        width: 140,
        height: 140,
        borderRadius: '50%',
        border: `4px solid ${readinessColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${readinessColor}11`,
        boxShadow: `0 0 32px ${readinessColor}33`,
        transition: 'all 0.4s ease',
      }}>
        <span style={{
          fontSize: 48,
          fontWeight: 900,
          color: readinessColor,
          lineHeight: 1,
          fontFamily: 'monospace',
          textShadow: `0 0 20px ${readinessColor}`,
        }}>
          {readiness}
        </span>
        <span style={{ fontSize: 11, color: readinessColor, fontWeight: 700, marginTop: 2 }}>
          {readinessLabel}
        </span>
      </div>
      {/* Advice banner */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 10,
        background: `${readinessColor}11`,
        border: `1px solid ${readinessColor}33`,
        marginBottom: 20,
      }}>
        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          ✨ <strong style={{ color: readinessColor }}>Kahin:</strong> {readinessAdvice}
        </p>
      </div>
      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {RECOVERY_QUESTIONS.map(q => (
          <div key={q.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                {q.emoji} {q.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>
                {scores[q.key]}/5
              </span>
            </div>
            <input
              type="range" min={1} max={5} step={1}
              value={scores[q.key]}
              onChange={e => setScores(p => ({ ...p, [q.key]: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 9, color: '#475569' }}>{q.lo}</span>
              <span style={{ fontSize: 9, color: '#475569' }}>{q.hi}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Save / Reset buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {!saved ? (
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #92400e, #f59e0b)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Kaydet
          </button>
        ) : (
          <div style={{
            flex: 1,
            padding: '11px 0',
            borderRadius: 12,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#22c55e',
            fontWeight: 700,
            fontSize: 13,
            textAlign: 'center',
          }}>
            ✓ Bugün kaydedildi
          </div>
        )}
        <button
          onClick={handleReset}
          style={{
            padding: '11px 16px',
            borderRadius: 12,
            background: darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
            color: '#64748b',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
};
// ─── CALISTHENICS TAB ────────────────────────────────────────
const CalisthenicsTab = ({ darkMode, toast }) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [learned, setLearned] = useState(() => getCalisthenicsLearned());
  const [activeView, setActiveView] = useState('guide'); // 'guide' | 'workout'
  const [expandedMove, setExpandedMove] = useState(null);
  // Workout generator state
  const [wLevel, setWLevel] = useState('beginner');
  const [wGoal, setWGoal] = useState('fullbody');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const totalMoves = CALISTHENICS_DB.reduce((acc, cat) => acc + cat.moves.length, 0);
  const learnedCount = learned.length;
  const handleToggleLearned = (moveName) => {
    const updated = toggleCalisthenicsLearned(moveName);
    setLearned(updated);
    if (updated.includes(moveName)) {
      toast.success(`✅ "${moveName}" öğrenildi olarak işaretlendi!`);
    }
  };
  // Filter moves
  const filteredDB = CALISTHENICS_DB.map(cat => ({
    ...cat,
    moves: cat.moves.filter(m => {
      const matchLevel = levelFilter === 'all' || m.level === levelFilter ||
        (levelFilter === 'learned' && learned.includes(m.name));
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.muscles.some(mu => mu.toLowerCase().includes(q)) ||
        m.desc.toLowerCase().includes(q);
      return matchLevel && matchSearch;
    })
  })).filter(cat => cat.moves.length > 0);
  // Workout generator
  const generateCalisthenicsWorkout = () => {
    const allMoves = CALISTHENICS_DB.flatMap(cat => {
      const goalCats = GOAL_CATEGORY_MAP[wGoal];
      if (goalCats && !goalCats.includes(cat.category)) return [];
      return cat.moves.filter(m => {
        if (wLevel === 'beginner') return m.level === 'beginner';
        if (wLevel === 'intermediate') return ['beginner', 'intermediate'].includes(m.level);
        if (wLevel === 'advanced') return ['intermediate', 'advanced'].includes(m.level);
        if (wLevel === 'elite') return ['advanced', 'elite'].includes(m.level);
        return true;
      });
    });
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());
    const picked = shuffle(allMoves).slice(0, 6);
    if (picked.length === 0) {
      toast.warning('Bu kombinasyon için yeterli hareket bulunamadı. Seviye veya hedefi değiştir.');
      return;
    }
    // Group into warmup (2) + main (3) + finisher (1)
    setGeneratedWorkout({
      warmup: picked.slice(0, 2).map(m => ({ ...m, sets: 2, reps: '8-10', note: 'Isınma — kontrollü tempo' })),
      main: picked.slice(2, 5).map(m => ({ ...m, sets: 3, reps: '6-8', note: 'Ana blok — form önce' })),
      finisher: picked.slice(5, 6).map(m => ({ ...m, sets: 2, reps: 'Max', note: 'Bitirici set' })),
    });
  };
  const lc = LEVEL_CONFIG;
  return (
    <div>
      {/* View toggle */}
      <div className={`flex gap-1 p-1 rounded-xl mb-4 ${darkMode ? 'bg-slate-900/60' : 'bg-gray-100'}`}>
        {[
          { id: 'guide', label: '📖 Rehber' },
          { id: 'workout', label: '⚡ Antrenman Oluştur' },
        ].map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeView === v.id
                ? 'bg-amber-500 text-slate-900 shadow-md'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}>
            {v.label}
          </button>
        ))}
      </div>
      {/* ── GUIDE VIEW ── */}
      {activeView === 'guide' && (
        <>
          {/* Progress banner */}
          <div className={`flex items-center gap-3 p-3 rounded-xl mb-3 border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-1">
                <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>İlerleme</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{learnedCount}/{totalMoves}</span>
              </div>
              <div style={{ height: 5, background: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${totalMoves > 0 ? (learnedCount / totalMoves) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #92400e, #f59e0b)',
                  borderRadius: 3,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
            <span style={{
              fontSize: 22, fontWeight: 900, color: '#f59e0b',
              fontFamily: 'monospace', minWidth: 40, textAlign: 'right',
            }}>
              {totalMoves > 0 ? Math.round((learnedCount / totalMoves) * 100) : 0}%
            </span>
          </div>
          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Hareket, kas grubu veya anahtar kelime..."
              className={`w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode
                  ? 'bg-slate-900/80 border-slate-700/50 text-white placeholder-slate-500 focus:border-amber-500/50'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-400'
                }`}
            />
          </div>
          {/* Level filters */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'beginner', label: 'Başlangıç' },
              { id: 'intermediate', label: 'Orta' },
              { id: 'advanced', label: 'İleri' },
              { id: 'elite', label: 'Elite' },
              { id: 'learned', label: '⭐ Öğrendim' },
            ].map(f => (
              <button key={f.id} onClick={() => setLevelFilter(f.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: levelFilter === f.id ? 700 : 400,
                  border: `1px solid ${levelFilter === f.id
                    ? (lc[f.id]?.color || '#f59e0b')
                    : darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                  background: levelFilter === f.id
                    ? (lc[f.id]?.bg || 'rgba(245,158,11,0.15)')
                    : 'transparent',
                  color: levelFilter === f.id
                    ? (lc[f.id]?.color || '#f59e0b')
                    : darkMode ? '#64748b' : '#9ca3af',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                {f.label}
              </button>
            ))}
          </div>
          {/* Move list */}
          {filteredDB.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm">Sonuç bulunamadı</p>
              <p className="text-xs mt-1">Farklı bir kelime veya filtre dene</p>
            </div>
          ) : (
            filteredDB.map(cat => (
              <div key={cat.category} className="mb-6">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {cat.category}
                  </span>
                  <div style={{ flex: 1, height: 1, background: darkMode ? '#1e293b' : '#e2e8f0' }} />
                </div>
                {cat.moves.map(move => {
                  const isLearned = learned.includes(move.name);
                  const isExpanded = expandedMove === move.name;
                  const levelConf = lc[move.level] || lc.beginner;
                  return (
                    <div key={move.name}
                      style={{
                        borderRadius: 12,
                        border: `1px solid ${isLearned ? 'rgba(245,158,11,0.35)' : darkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                        background: isLearned
                          ? 'rgba(245,158,11,0.06)'
                          : darkMode ? 'rgba(255,255,255,0.02)' : '#fff',
                        marginBottom: 6,
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                      }}>
                      {/* Move header */}
                      <div
                        onClick={() => setExpandedMove(isExpanded ? null : move.name)}
                        style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        {/* Level dot */}
                        <div style={{ width: 3, height: 32, borderRadius: 2, background: levelConf.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                              {move.name}
                            </span>
                            {isLearned && <span style={{ fontSize: 10 }}>✓</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                              background: levelConf.bg, color: levelConf.color, border: `1px solid ${levelConf.border}`,
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                              {levelConf.label}
                            </span>
                            {move.muscles.map(mu => (
                              <span key={mu} style={{
                                fontSize: 9, padding: '1px 6px', borderRadius: 10,
                                background: darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                color: darkMode ? '#64748b' : '#9ca3af',
                                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                              }}>
                                {mu}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronDown size={13} style={{ color: '#475569', flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                      {/* Expanded body */}
                      {isExpanded && (
                        <div style={{
                          padding: '12px 14px',
                          borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
                          background: darkMode ? 'rgba(0,0,0,0.2)' : '#fafafa',
                        }}>
                          {/* Description */}
                          <p style={{ fontSize: 12, color: darkMode ? '#94a3b8' : '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
                            {move.desc}
                          </p>
                          {/* Tip */}
                          <div style={{
                            padding: '8px 10px', borderRadius: 8, marginBottom: 10,
                            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                            fontSize: 11, color: '#f59e0b', lineHeight: 1.6,
                          }}>
                            💡 {move.tip}
                          </div>
                          {/* Progression path */}
                          {move.progression && move.progression.length > 1 && (
                            <div style={{ marginBottom: 10 }}>
                              <p style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                                📈 İlerleme Yolu
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: 4 }}>
                                {move.progression.map((step, i) => {
                                  const isCurrent = step === move.name;
                                  const isDone = learned.includes(step) && step !== move.name;
                                  return (
                                    <React.Fragment key={step}>
                                      <span
                                        onClick={(e) => { e.stopPropagation(); setExpandedMove(step); }}
                                        style={{
                                          fontSize: 10, padding: '3px 9px', borderRadius: 6, cursor: 'pointer',
                                          fontWeight: isCurrent ? 700 : 400,
                                          background: isCurrent ? 'rgba(245,158,11,0.15)' : isDone ? 'rgba(34,197,94,0.1)' : 'transparent',
                                          border: `1px solid ${isCurrent ? '#f59e0b' : isDone ? '#22c55e' : darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                                          color: isCurrent ? '#f59e0b' : isDone ? '#22c55e' : darkMode ? '#64748b' : '#9ca3af',
                                          transition: 'all 0.15s',
                                        }}>
                                        {step}
                                      </span>
                                      {i < move.progression.length - 1 && (
                                        <span style={{ fontSize: 10, color: '#334155', margin: '0 2px' }}>→</span>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <a href={move.video} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                color: '#ef4444', textDecoration: 'none',
                              }}>
                              ▶ YouTube
                            </a>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleLearned(move.name); }}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                                background: isLearned ? 'rgba(245,158,11,0.15)' : 'transparent',
                                border: `1px solid ${isLearned ? '#f59e0b' : darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                                color: isLearned ? '#f59e0b' : darkMode ? '#64748b' : '#9ca3af',
                                cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto',
                              }}>
                              {isLearned ? '✓ Öğrendim' : '+ Öğrendim'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </>
      )}
      {/* ── WORKOUT GENERATOR VIEW ── */}
      {activeView === 'workout' && (
        <div>
          {/* Config */}
          <div className={`p-4 rounded-2xl border mb-4 ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Antrenman Ayarları
            </p>
            {/* Level */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>Seviye</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'beginner', label: 'Başlangıç' },
                  { id: 'intermediate', label: 'Orta' },
                  { id: 'advanced', label: 'İleri' },
                  { id: 'elite', label: 'Elite' },
                ].map(l => (
                  <button key={l.id} onClick={() => setWLevel(l.id)}
                    style={{
                      padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: wLevel === l.id ? 700 : 400,
                      border: `1px solid ${wLevel === l.id ? (lc[l.id]?.color || '#f59e0b') : darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                      background: wLevel === l.id ? (lc[l.id]?.bg || 'rgba(245,158,11,0.15)') : 'transparent',
                      color: wLevel === l.id ? (lc[l.id]?.color || '#f59e0b') : darkMode ? '#64748b' : '#9ca3af',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Goal */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>Hedef</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'fullbody', label: '🏋️ Full Body' },
                  { id: 'pull', label: '💪 Çekiş' },
                  { id: 'push', label: '🤜 İtiş' },
                  { id: 'core', label: '🎯 Kor' },
                  { id: 'legs', label: '🦵 Bacak' },
                  { id: 'bars', label: '🏗️ Par. Bar' },
                  { id: 'balance', label: '🤸 Denge' },
                ].map(g => (
                  <button key={g.id} onClick={() => setWGoal(g.id)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: wGoal === g.id ? 700 : 400,
                      border: `1px solid ${wGoal === g.id ? '#f59e0b' : darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                      background: wGoal === g.id ? 'rgba(245,158,11,0.15)' : 'transparent',
                      color: wGoal === g.id ? '#f59e0b' : darkMode ? '#64748b' : '#9ca3af',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generateCalisthenicsWorkout}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #92400e, #f59e0b)', color: '#0f172a' }}>
              ⚡ Antrenman Oluştur
            </button>
          </div>
          {/* Generated workout */}
          {generatedWorkout && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {[
                { key: 'warmup', title: '🔥 Isınma', color: '#60a5fa', sets: '2 set' },
                { key: 'main', title: '💪 Ana Blok', color: '#f59e0b', sets: '3 set' },
                { key: 'finisher', title: '🔥 Finisher', color: '#ef4444', sets: '2 set' },
              ].map(section => (
                <div key={section.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: section.color }}>{section.title}</span>
                    <div style={{ flex: 1, height: 1, background: darkMode ? '#1e293b' : '#e2e8f0' }} />
                  </div>
                  {generatedWorkout[section.key].map((move, i) => {
                    const levelConf = lc[move.level] || lc.beginner;
                    return (
                      <div key={i} style={{
                        padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                        background: darkMode ? 'rgba(255,255,255,0.02)' : '#fff',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}>
                        <div style={{ width: 3, height: 40, borderRadius: 2, background: levelConf.color, flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>{move.name}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                              background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)',
                            }}>
                              {move.sets}×{move.reps}
                            </span>
                          </div>
                          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{move.note}</p>
                          {/* Progression hint */}
                          {move.progression && move.progression.length > 1 && (
                            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Yol:</span>
                              {move.progression.map((step, si) => (
                                <React.Fragment key={step}>
                                  <span style={{
                                    fontSize: 9,
                                    color: step === move.name ? '#f59e0b' : learned.includes(step) ? '#22c55e' : '#475569',
                                    fontWeight: step === move.name ? 700 : 400,
                                  }}>
                                    {step}
                                  </span>
                                  {si < move.progression.length - 1 && (
                                    <span style={{ fontSize: 9, color: '#334155' }}>→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <button onClick={generateCalisthenicsWorkout}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b',
                }}>
                🔄 Yeniden Oluştur
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const WorkoutSummaryModal = ({ isOpen, onClose, workout, logs, toast, setConfirmState }) => {
  const darkMode = React.useContext(ThemeContext);
  if (!isOpen || !workout) return null;

  // Toplam hacim hesapla
  const totalVolume = Object.entries(logs).reduce((total, [name, log]) => {
    const weight = parseFloat(log.weight) || 0;
    const reps   = parseInt(log.reps) || 0;
    // Set sayısını workout'tan bul
    const allExercises = workout.strength?.flatMap(b => b.exercises) || [];
    const ex = allExercises.find(e => e.name === name);
    const sets = parseInt(ex?.sets) || 1;
    return total + (weight * reps * sets);
  }, 0);

  const loggedCount  = Object.keys(logs).length;
  const prExercises  = Object.entries(logs).filter(([, log]) => log.weight && parseFloat(log.weight) > 0);
  const avgRpe       = Object.values(logs)
    .filter(l => l.rpe)
    .map(l => parseInt(l.rpe));
  const rpeAvg = avgRpe.length > 0
    ? Math.round(avgRpe.reduce((a, b) => a + b, 0) / avgRpe.length)
    : null;

  const rpeColor = !rpeAvg ? '#64748b'
    : rpeAvg <= 7 ? '#22c55e'
    : rpeAvg <= 8 ? '#f59e0b'
    : '#ef4444';

  // Bir sonraki antrenman önerisi
  const nextSuggestion = (() => {
    const focus = workout.focus;
    const suggestions = {
      gvt:             'Yarın üst vücut ya da dinlenme. GVT sonrası 48 saat toparlanma önerilir.',
      gvt_push:        'Yarın çekiş (Pull) veya bacak günü. Göğüs ve omuz 48 saat dinlenmeli.',
      gvt_pull:        'Yarın itiş (Push) veya bacak günü. Sırt ve biseps dinlenmeli.',
      ovt:             'Yarın alt vücut veya dinlenme. OVT yoğun nöromotor yük bırakır.',
      ovt_push:        'Yarın çekiş veya bacak günü öner.',
      ovt_pull:        'Yarın itiş veya dinlenme günü.',
      hanik_push_legs: 'Yarın Pull & Core günü yapabilirsin.',
      hanik_pull_core: 'Yarın Push & Legs günü yapabilirsin.',
      prime:           'Yarın aktif dinlenme veya Recovery modu.',
      engine:          'Yarın güç antrenmanı. Kondisyon günü sonrası kas inşası.',
      aesthetics:      'Yarın farklı bir split. Aynı kas grubunu arka arkaya çalıştırma.',
      fbb:             'Yarın güç odaklı bir gün ya da dinlenme.',
      hybrid:          'Yarın dinlenme veya hafif Recovery.',
      recovery:        'Yarın tam güç antrenmanına hazırsın!',
    };
    return suggestions[focus] || 'Dinlenme günü veya farklı bir mod dene.';
  })();

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl
        ${darkMode ? 'bg-slate-900 border border-amber-500/20' : 'bg-white border border-gray-200'}`}
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Header */}
        <div style={{
          padding: '24px 20px 16px',
          background: 'linear-gradient(135deg, rgba(146,64,14,0.3), rgba(245,158,11,0.1))',
          borderBottom: `1px solid rgba(245,158,11,0.2)`,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em' }}>
            ANTRENMAN TAMAMLANDI
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{workout.name}</p>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: darkMode ? '#1e293b' : '#e2e8f0' }}>
          {[
            { label: 'Kayıtlı Egzersiz', value: loggedCount, unit: 'adet', color: '#f59e0b' },
            { label: 'Toplam Hacim',     value: totalVolume > 0 ? `${Math.round(totalVolume / 1000 * 10) / 10}t` : '—', unit: totalVolume > 0 ? 'ton' : '', color: '#60a5fa' },
            { label: 'Ort. RPE',         value: rpeAvg || '—', unit: rpeAvg ? '/10' : '', color: rpeColor },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: '16px 12px', textAlign: 'center',
              background: darkMode ? '#0f172a' : '#fff',
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: stat.color, fontFamily: 'monospace' }}>
                {stat.value}<span style={{ fontSize: 11, color: '#64748b' }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* En iyi setler */}
        {prExercises.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              📊 Kaydedilen Performans
            </p>
            {prExercises.slice(0, 4).map(([name, log]) => (
              <div key={name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 0',
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'}`,
              }}>
                <span style={{ fontSize: 12, color: darkMode ? '#94a3b8' : '#64748b', flex: 1 }}>{name}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {log.weight && <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>{log.weight} kg</span>}
                  {log.reps   && <span style={{ fontSize: 12, color: '#60a5fa', fontFamily: 'monospace' }}>×{log.reps}</span>}
                  {log.rpe    && <span style={{ fontSize: 11, color: rpeColor, fontFamily: 'monospace' }}>RPE {log.rpe}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bir sonraki öneri */}
        <div style={{
          margin: '16px 20px',
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            ✨ Kahin — Sonraki Adım
          </p>
          <p style={{ fontSize: 12, color: darkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6 }}>
            {nextSuggestion}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 24px' }}>
          <button onClick={onClose}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: 'transparent', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
              color: darkMode ? '#64748b' : '#9ca3af', cursor: 'pointer',
            }}>
            Kapat
          </button>
          <button
            onClick={() => {
              onClose();
              // handleSaveWorkout'u dışarıdan tetikle
              document.getElementById('arete-save-btn')?.click();
            }}
            style={{
              flex: 2, padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: '#fff', cursor: 'pointer', border: 'none',
            }}>
            💾 Zaferi Kaydet
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

const ProactiveKahin = ({ workout, darkMode }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    const history = JSON.parse(localStorage.getItem('arete_history') || '[]');
    const lastWorkouts = history.slice(0, 3).map(h => ({
      name: h.workoutName,
      focus: h.focus,
      date: h.date,
      exerciseCount: Object.keys(h.exercises || {}).length,
    }));
    const recovery = (() => {
      try {
        const s = localStorage.getItem('arete_recovery');
        if (s) {
          const p = JSON.parse(s);
          if (p.date === new Date().toDateString()) return p.readiness;
        }
      } catch (e) {}
      return null;
    })();

    const systemPrompt = `Sen ARETE uygulamasının AI koçu Kahin'sin. Kısa, motive edici, kişisel bir günlük mesaj yaz. Türkçe. Maksimum 3 cümle. Emoji kullanabilirsin.`;
    const userPrompt = `Bugünün tarihi: ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}. 
Son 3 antrenman: ${JSON.stringify(lastWorkouts)}. 
Bugünkü toparlanma skoru: ${recovery ? `${recovery}/100` : 'bilinmiyor'}.
Mevcut antrenman modu: ${workout?.focus || 'seçilmedi'}.
Buna göre günlük motivasyon ve öneri mesajı yaz.`;

    const response = await callGemini(userPrompt, systemPrompt);
    setMsg(response);
    setLoading(false);
    setGenerated(true);
  };

  if (!generated) {
    return (
      <button onClick={generate} disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 20,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          color: '#f59e0b', fontSize: 11, fontWeight: 600,
          cursor: 'pointer', marginTop: 8,
        }}>
        {loading
          ? <RefreshCw size={11} className="animate-spin" />
          : <Sparkles size={11} />}
        {loading ? 'Kahin düşünüyor...' : "Kahin'den günlük mesaj al"}
      </button>
    );
  }

  return (
    <div style={{
      marginTop: 10, padding: '10px 12px', borderRadius: 10,
      background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
    }}>
      <p style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>✨ Kahin</p>
      <p style={{ fontSize: 12, color: darkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6 }}>{msg}</p>
      <button onClick={() => setGenerated(false)}
        style={{ fontSize: 9, color: '#475569', marginTop: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
        Yenile
      </button>
    </div>
  );
};

const Badge = ({ text, color = "bg-slate-700" }) => (
  <span className={`text-[10px] font-bold px-2 py-1 rounded border border-white/5 uppercase tracking-wider ${color} text-white ml-2 shadow-sm`}>{text}</span>
);

const getCalisthenicsLearned = () => {
  try { return JSON.parse(localStorage.getItem('arete_cal_learned') || '[]'); }
  catch (e) { return []; }
};
const toggleCalisthenicsLearned = (moveName) => {
  const current = getCalisthenicsLearned();
  const updated = current.includes(moveName)
    ? current.filter(n => n !== moveName)
    : [...current, moveName];
  localStorage.setItem('arete_cal_learned', JSON.stringify(updated));
  return updated;
};

// localStorage helper functions
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
};

export default function App() {
  // State with localStorage persistence
  const [config, setConfig] = useState(() => loadFromStorage('arete_config', { focus: 'hybrid', poolAccess: true, duration: '60' }));
  const [workout, setWorkout] = useState(() => loadFromStorage('arete_workout', null));
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [logs, setLogs] = useState(() => loadFromStorage('arete_logs', {}));
  const [focusMode, setFocusMode] = useState(() => loadFromStorage('arete_focusMode', null)); // 'strength' | 'metcon' | null
  const [activeTab, setActiveTab] = useState('workout');
  const [configOpen, setConfigOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => loadFromStorage('arete_darkMode', true));
  const [workedOutToday, setWorkedOutToday] = useState(() => loadFromStorage('arete_workedOut', false));
  const [dietMode, setDietMode] = useState(() => loadFromStorage('arete_dietMode', 'normal'));
  const [dailyMeal, setDailyMeal] = useState(() => loadFromStorage('arete_dailyMeal', null));
  const { toasts, toast, removeToast } = useToast();
  const [confirmState, setConfirmState] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [program, setProgram] = useState(() => {
    try { return JSON.parse(localStorage.getItem('arete_program') || 'null'); } catch { return null; }
  });
  const [showOneRM, setShowOneRM] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('arete_onboarded');
  });

  // Persist state changes to localStorage
  useEffect(() => { saveToStorage('arete_config', config); }, [config]);
  useEffect(() => { saveToStorage('arete_workout', workout); }, [workout]);
  useEffect(() => { saveToStorage('arete_logs', logs); }, [logs]);
  useEffect(() => { saveToStorage('arete_focusMode', focusMode); }, [focusMode]);
  useEffect(() => { saveToStorage('arete_darkMode', darkMode); }, [darkMode]);
  useEffect(() => { saveToStorage('arete_workedOut', workedOutToday); }, [workedOutToday]);
  useEffect(() => { saveToStorage('arete_dietMode', dietMode); }, [dietMode]);
  useEffect(() => { saveToStorage('arete_dailyMeal', dailyMeal); }, [dailyMeal]);

  const generateDailyMeal = () => {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const aksamPool = dietMode === 'vegan'
      ? BESLENME_DB.vegan
      : workedOutToday ? BESLENME_DB.anaYemek : BESLENME_DB.bowl;
    setDailyMeal({
      kahvaltilik: pick(dietMode === 'vegan' ? BESLENME_DB.vegan : BESLENME_DB.kahvaltilik),
      tatli: pick(dietMode === 'vegan' ? BESLENME_DB.vegan : BESLENME_DB.tatli),
      aksam: pick(aksamPool),
    });
  };

  const handleLogUpdate = (exerciseName, field, value) => {
    setLogs(prev => ({ ...prev, [exerciseName]: { ...prev[exerciseName], [field]: value } }));
  };

  const swapExercise = useCallback((blockIdx, exIdx) => {
    if (!workout) return;
    const allExercises = [
      ...(EXERCISE_DB.strength?.push?.compound || []),
      ...(EXERCISE_DB.strength?.push?.accessory || []),
      ...(EXERCISE_DB.strength?.pull?.compound || []),
      ...(EXERCISE_DB.strength?.pull?.accessory || []),
      ...(EXERCISE_DB.strength?.legs?.compound || []),
      ...(EXERCISE_DB.strength?.legs?.accessory || []),
      ...(EXERCISE_DB.fbb || []),
    ];
    const updatedStrength = workout.strength.map((block, bi) => {
      if (bi !== blockIdx) return block;
      const updatedExercises = block.exercises.map((ex, ei) => {
        if (ei !== exIdx) return ex;
        const candidates = allExercises.filter(e => e.name !== ex.name);
        if (!candidates.length) return ex;
        const replacement = candidates[Math.floor(Math.random() * candidates.length)];
        return { ...replacement, sets: ex.sets, reps: ex.reps, rest: ex.rest, tempo: ex.tempo, note: ex.note };
      });
      return { ...block, exercises: updatedExercises };
    });
    setWorkout(prev => ({ ...prev, strength: updatedStrength }));
  }, [workout]);

  const estimateDuration = (w) => {
    if (!w) return null;
    let minutes = 0;
    minutes += (w.warmup?.length || 0) * 2;
    w.strength?.forEach(block => {
      const sets = parseInt(block.exercises?.[0]?.sets) || 3;
      const exCount = block.exercises?.length || 1;
      minutes += exCount * sets * 2;
    });
    if (w.metcon) minutes += 20;
    minutes += (w.core?.length || 0) * 3;
    return Math.round(minutes / 5) * 5;
  };

  const handleSaveWorkout = useCallback(() => {
    if (!workout) return;
    const doSave = () => {
      saveToHistory({ ...workout, focus: config.focus }, logs);
      toast.success('🏆 Zafer kaydedildi! Helal olsun!');
      setShowHistory(true);
    };
    if (Object.keys(logs).length === 0) {
      setConfirmState({
        message: 'Veri girmedin, yine de kaydedilsin mi?',
        detail: 'Ağırlık veya tekrar girmeden antrenmanı kaydedeceksin.',
        variant: 'warning',
        confirmLabel: 'Kaydet',
        cancelLabel: 'Vazgeç',
        onConfirm: doSave,
      });
    } else {
      doSave();
    }
  }, [workout, config.focus, logs, toast]);

  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };


  // ==================== YENİ MODÜL FONKSİYONLARI ====================

  // MODÜL 1: construct_GVT - German Volume Training (2 Bölüm, 10x10)
  // mode: 'lower' (Bacak + Karın) | 'upper' (Göğüs + Sırt + Omuz)
  const construct_GVT = (mode = 'lower') => {
    const block = [];

    if (mode === 'lower') {
      // ALT VÜCUT: Bacak + Karın
      const legCompounds = EXERCISE_DB.strength.legs.compound;
      const legAccessories = EXERCISE_DB.strength.legs.accessory;
      const coreExercises = EXERCISE_DB.core;

      const mainLeg = getRandomItems(legCompounds, 1)[0]; // Bacak ana hareketi
      const mainCore = getRandomItems(coreExercises, 1)[0]; // Karın ana hareketi
      const legAccessory = getRandomItems(legAccessories, 1)[0];
      const coreAccessory = getRandomItems(coreExercises.filter(e => e.name !== mainCore.name), 1)[0];

      block.push({
        type: 'GVT A – ALT VÜCUT BACAK (10x10)',
        exercises: [{
          ...mainLeg,
          sets: 10,
          reps: 10,
          rest: '90sn',
          tempo: '4020',
          weight_rx: '%60 1RM',
          note: 'Sabit ağırlık. 4sn iniş, 2sn çıkış. Son setlerde tekrar düşebilir, sorun değil.'
        }]
      });

      block.push({
        type: 'GVT B – ALT VÜCUT KARIN (10x10)',
        exercises: [{
          ...mainCore,
          sets: 10,
          reps: 10,
          rest: '60sn',
          tempo: '3010',
          note: 'Kontrollü ve sıkıştırarak. Her tekrarda nefes ver.'
        }]
      });

      block.push({
        type: 'GVT C – AKSESUAR SUPERSET (3x12)',
        exercises: [
          { ...legAccessory, sets: 3, reps: 12, rest: 'Süpersetle', tempo: '3010', note: 'C1: Tek bacak veya ikincil bacak hareketi.' },
          { ...coreAccessory, sets: 3, reps: 15, rest: '60sn', tempo: '2010', note: 'C2: Core destekleyici.' }
        ]
      });

    } else { // upper
      // ÜST VÜCUT: Göğüs + Sırt + Omuz
      const pushCompounds = EXERCISE_DB.strength.push.compound;
      const pullCompounds = EXERCISE_DB.strength.pull.compound;
      const pushAccessories = EXERCISE_DB.strength.push.accessory;
      const pullAccessories = EXERCISE_DB.strength.pull.accessory;

      const mainPush = getRandomItems(pushCompounds, 1)[0]; // Göğüs/Omuz ana
      const mainPull = getRandomItems(pullCompounds, 1)[0]; // Sırt ana
      const pushAccessory = getRandomItems(pushAccessories, 1)[0];
      const pullAccessory = getRandomItems(pullAccessories, 1)[0];

      block.push({
        type: 'GVT A – ÜST VÜCUT GÖĞÜS/OMUZ (10x10)',
        exercises: [{
          ...mainPush,
          sets: 10,
          reps: 10,
          rest: '90sn',
          tempo: '4020',
          weight_rx: '%60 1RM',
          note: 'Sabit ağırlık. Kontrol çok önemli. Son setlerde hafif yorulma normal.'
        }]
      });

      block.push({
        type: 'GVT B – ÜST VÜCUT SIRT (10x10)',
        exercises: [{
          ...mainPull,
          sets: 10,
          reps: 10,
          rest: '90sn',
          tempo: '3020',
          weight_rx: '%60 1RM',
          note: 'Kürek kemiklerini sıkıştır. Tepe noktada 1sn bekle.'
        }]
      });

      block.push({
        type: 'GVT C – AKSESUAR SUPERSET (3x12)',
        exercises: [
          { ...pushAccessory, sets: 3, reps: 12, rest: 'Süpersetle', tempo: '3010', note: 'C1: İzolasyon itiş.' },
          { ...pullAccessory, sets: 3, reps: 12, rest: '60sn', tempo: '3010', note: 'C2: İzolasyon çekiş.' }
        ]
      });
    }

    return block;
  };

  // MODÜL 2: construct_OVT - Optimized Volume Training (Superset + Tempo)
  // mode: 'lower' (Bacak + Alt Sırt) | 'upper' (İtiş + Çekiş)
  const construct_OVT = (mode = 'upper') => {
    const block = [];

    if (mode === 'lower') {
      // ALT VÜCUT: Bacak (Squat/Lunge) + Alt Sırt (Deadlift/RDL)
      const squatMoves = EXERCISE_DB.strength.legs.compound.filter(e =>
        e.name.toLowerCase().includes('squat') || e.name.toLowerCase().includes('lunge'));
      const hingeMoves = EXERCISE_DB.strength.legs.compound.filter(e =>
        e.name.toLowerCase().includes('deadlift') || e.name.toLowerCase().includes('rdl') || e.name.toLowerCase().includes('hip'));
      const legAccessories = EXERCISE_DB.strength.legs.accessory;

      const mainSquat = getRandomItems(squatMoves.length > 0 ? squatMoves : EXERCISE_DB.strength.legs.compound, 1)[0];
      const mainHinge = getRandomItems(hingeMoves.length > 0 ? hingeMoves : EXERCISE_DB.strength.legs.compound, 1)[0];
      const acc1 = getRandomItems(legAccessories, 1)[0];
      const acc2 = getRandomItems(legAccessories.filter(e => e.name !== acc1.name), 1)[0];

      block.push({
        type: 'OVT SUPERSET 1 – BACAK GÜÇ (5 Tur / 5-6 Tekrar)',
        exercises: [
          { ...mainSquat, sets: 5, reps: 5, rest: 'Süpersetle', tempo: 'X0X0', weight_rx: 'Ağır (%80 1RM)', note: '1A: Patlayıcı kaldır. Otur yavaş, kalk patlayıcı.' },
          { ...mainHinge, sets: 5, reps: 6, rest: '2dk sonra 1A\'ya dön', tempo: '3110', weight_rx: 'Orta-Ağır', note: '1B: 3sn iniş, 1sn alınım, nefes al, kalk. Kontrol şart.' }
        ]
      });

      block.push({
        type: 'OVT SUPERSET 2 – BACAK AKSESUAR (4 Tur / 8-10 Tekrar)',
        exercises: [
          { ...acc1, sets: 4, reps: '8-10', rest: 'Süpersetle', tempo: '3011', note: '2A: Tek bacak veya izolasyon. Tempo’ya uy.' },
          { ...acc2, sets: 4, reps: '10-12', rest: '90sn sonra 2A\'ya dön', tempo: '2010', note: '2B: Kontrollü kasılma. Tepe noktada sıkıştır.' }
        ]
      });

    } else { // upper
      // ÜST VÜCUT: İtiş (Push) + Çekiş (Pull) – antagonist superset
      const pushCompounds = EXERCISE_DB.strength.push.compound;
      const pullCompounds = EXERCISE_DB.strength.pull.compound;
      const pushAccessories = EXERCISE_DB.strength.push.accessory;
      const pullAccessories = EXERCISE_DB.strength.pull.accessory;

      const mainPush = getRandomItems(pushCompounds, 1)[0];
      const mainPull = getRandomItems(pullCompounds, 1)[0];
      const pushAcc = getRandomItems(pushAccessories, 1)[0];
      const pullAcc = getRandomItems(pullAccessories, 1)[0];

      block.push({
        type: 'OVT SUPERSET 1 – ÜST GÜÇ İTİŞ+ÇEKİŞ (5 Tur / 5 Tekrar)',
        exercises: [
          { ...mainPush, sets: 5, reps: 5, rest: 'Süpersetle', tempo: 'X0X0', weight_rx: 'Ağır (%80 1RM)', note: '1A: Patlayıcı it. Maksimum hız.' },
          { ...mainPull, sets: 5, reps: 5, rest: '90sn sonra 1A\'ya dön', tempo: '5010', note: '1B: Çok yavaş çek. 5sn iniş. Kürek kemiği ıskalama.' }
        ]
      });

      block.push({
        type: 'OVT SUPERSET 2 – ÜST AKSESUAR (4 Tur / 10-12 Tekrar)',
        exercises: [
          { ...pushAcc, sets: 4, reps: '10-12', rest: 'Süpersetle', tempo: '3011', note: '2A: İzolasyon itiş. Kilit noktada sıkıştır.' },
          { ...pullAcc, sets: 4, reps: '12', rest: '75sn sonra 2A\'ya dön', tempo: '3012', note: '2B: İzolasyon çekiş. Kontrollü sıkıştırma.' }
        ]
      });
    }

    return block;
  };

  // MODÜL 3: construct_FBB - Functional Bodybuilding
  const construct_FBB = () => {
    const block = [];

    const stabilityMoves = EXERCISE_DB.fbb.filter(m => m.type === "Stabilite" || m.type === "Anti-Rotasyon");
    const carryMoves = EXERCISE_DB.fbb.filter(m => m.type === "Taşıma" || m.type === "Grip/Core");
    const fullBodyMoves = EXERCISE_DB.fbb.filter(m => m.type === "Full Body" || m.type === "Mobility" || m.type === "Hybrid");

    const stabilityMove = getRandomItems(stabilityMoves.length > 0 ? stabilityMoves : EXERCISE_DB.fbb, 1)[0];
    const carryMove = getRandomItems(carryMoves.length > 0 ? carryMoves : EXERCISE_DB.fbb, 1)[0];
    const fullBody = getRandomItems(fullBodyMoves.length > 0 ? fullBodyMoves : EXERCISE_DB.fbb, 2);
    const coreExercises = getRandomItems(EXERCISE_DB.core, 3);

    block.push({
      type: "A BLOK (Stabilite & Tempo)",
      exercises: [
        { ...stabilityMove, sets: 4, reps: "8-10", rest: "Süpersetle", tempo: "3011", note: "Kontrollü iniş. Kaliteye odaklan." },
        { ...coreExercises[0], sets: 4, reps: "30sn", rest: "90sn", note: "Core süperset" }
      ]
    });

    block.push({
      type: "B BLOK (Full Body Tension)",
      exercises: [
        { ...carryMove, sets: 3, reps: "40 metre", rest: "Süpersetle", tempo: "Kontrollü", note: "Dik dur, nefes al" },
        { ...coreExercises[1], sets: 3, reps: "30sn/taraf", rest: "60sn", note: "Core süperset" }
      ]
    });

    block.push({
      type: "C BLOK (Arka Zincir & Mobilite)",
      exercises: [
        { ...fullBody[0], sets: 3, reps: "6-8/taraf", rest: "Süpersetle", tempo: "Kontrollü", note: "Her tarafı eşit çalış" },
        { ...fullBody[1], sets: 3, reps: "5/taraf", rest: "90sn", note: "Akışkan geçişler" }
      ]
    });

    return block;
  };



  // MODÜL 5: construct_Recovery - Aktif Onarım
  const construct_Recovery = (hasPool = true) => {
    const block = [];

    const spinalMoves = EXERCISE_DB.warmup.filter(m =>
      m.name.toLowerCase().includes('camel') ||
      m.name.toLowerCase().includes('cobra') ||
      m.name.toLowerCase().includes('rotation')
    );
    const hipMoves = EXERCISE_DB.warmup.filter(m =>
      m.name.toLowerCase().includes('hip') ||
      m.name.toLowerCase().includes('lizard') ||
      m.name.toLowerCase().includes('squat') ||
      m.name.toLowerCase().includes('butterfly') ||
      m.name.toLowerCase().includes('90/90')
    );

    const mobilityMoves = [
      ...getRandomItems(spinalMoves.length > 0 ? spinalMoves : EXERCISE_DB.warmup, 2),
      ...getRandomItems(hipMoves.length > 0 ? hipMoves : EXERCISE_DB.warmup, 2)
    ];

    block.push({
      type: "MOBİLİTE (Kuru Alan) - 15-20dk",
      exercises: mobilityMoves.map(m => ({
        ...m,
        sets: 2,
        reps: m.reps || "60sn",
        rest: "Akışkan geçiş",
        tempo: "Yavaş & Kontrollü",
        note: "Derin nefes al. Her pozisyonda 5 nefes bekle."
      }))
    });

    if (hasPool) {
      const mainSwim = getRandomItems(EXERCISE_DB.swim, 1)[0];

      block.push({
        type: "HAVUZ PROTOKOLÜ",
        exercises: [
          { name: "Isınma", description: "Rahat tempo, nefes odaklı", sets: 1, reps: "200m", note: "Kalp atışını yavaşça yükselt", image: getImgUrl("Swim Warmup") },
          { ...mainSwim, sets: 1, reps: mainSwim.description, note: "Ana bölüm. Formuna odaklan." },
          { name: "Soğuma", description: "Çok yavaş, uzun kulaçlar", sets: 1, reps: "100m", note: "Nefes normale dönsün", image: getImgUrl("Swim Cooldown") }
        ]
      });
    }

    block.push({
      type: "NEFES & ZİHİN (Box Breathing)",
      exercises: [{
        name: "4-4-4-4 Box Breathing",
        description: "4sn nefes al, 4sn tut, 4sn ver, 4sn bekle. 10 döngü.",
        sets: 1,
        reps: "10 döngü (yaklaşık 3dk)",
        note: "Parasempatik sistem aktivasyonu. Toparlanmayı hızlandırır.",
        image: getImgUrl("Box Breathing")
      }]
    });

    return block;
  };

  // ==================== HANİK MODÜLÜ ====================
  // Hanik kütüphanesinden antrenman oluşturucu
  // mode: 'push_legs' veya 'pull_core'
  // 4 blok × 2 egzersiz (superset) = 8 ana egzersiz
  const construct_Hanik = (mode) => {
    const block = [];

    if (mode === 'push_legs') {
      // Push egzersizleri
      const presExercises = HANIK_DB.push.filter(e => e.category === 'Pres');
      const sinawExercises = HANIK_DB.push.filter(e => e.category === 'Şınav');
      const otherPush = HANIK_DB.push.filter(e => e.category === 'İtiş Diğer');
      // Legs egzersizleri
      const squatExercises = HANIK_DB.legs.filter(e => e.category === 'Squat');
      const lungeExercises = HANIK_DB.legs.filter(e => e.category === 'Lunge');
      const hingeExercises = HANIK_DB.legs.filter(e => e.category === 'Hinge/Post');
      const explosiveExercises = HANIK_DB.legs.filter(e => e.category === 'Patlayıcı');

      // Blok A: Pres + Squat (Güç)
      const presMove = getRandomItems(presExercises, 1)[0];
      const squatMove = getRandomItems(squatExercises, 1)[0];
      block.push({
        type: 'A – GÜÇ SUPERSET (Pres + Squat)',
        exercises: [
          { ...presMove, sets: 4, rest: 'Süpersetle' },
          { ...squatMove, sets: 4, rest: '90sn' },
        ],
      });

      // Blok B: Şınav + Lunge
      const sinawMove = getRandomItems([...sinawExercises, ...otherPush], 1)[0];
      const lungeMove = getRandomItems(lungeExercises, 1)[0];
      block.push({
        type: 'B – KAS SUPERSET (Şınav + Lunge)',
        exercises: [
          { ...sinawMove, sets: 3, rest: 'Süpersetle' },
          { ...lungeMove, sets: 3, rest: '75sn' },
        ],
      });

      // Blok C: İtiş Diğer + Hinge
      const itisMove = getRandomItems([...otherPush, ...sinawExercises], 1)[0];
      const hingeMove = getRandomItems(hingeExercises, 1)[0];
      block.push({
        type: 'C – KONTROL SUPERSET (İtiş + Hinge)',
        exercises: [
          { ...itisMove, sets: 3, rest: 'Süpersetle' },
          { ...hingeMove, sets: 3, rest: '75sn' },
        ],
      });

      // Blok D: Patlayıcı Şınav + Patlayıcı Legs (Finisher)
      const plyoShin = sinawExercises.filter(e => e.reps.includes('Fail') || e.name.includes('Plyometric') || e.name.includes('Power'));
      const finalSinaw = (plyoShin.length > 0 ? getRandomItems(plyoShin, 1)[0] : getRandomItems(sinawExercises, 1)[0]);
      const explosiveMove = getRandomItems(explosiveExercises, 1)[0];
      block.push({
        type: 'D – PATLAYICI FİNİŞER (Şınav + Patlayıcı)',
        exercises: [
          { ...finalSinaw, sets: 3, rest: 'Süpersetle' },
          { ...explosiveMove, sets: 3, rest: '60sn' },
        ],
      });

    } else { // pull_core
      const rowExercises = HANIK_DB.pull.filter(e => e.category === 'Row');
      const cekisExercises = HANIK_DB.pull.filter(e => e.category === 'Çekiş Diğer');
      const kbExercises = HANIK_DB.functional.filter(e => e.category === 'KB/Rotasyon');
      const landmineExercises = HANIK_DB.functional.filter(e => e.category === 'Landmine/Rotasyon');
      const kompleksExercises = HANIK_DB.functional.filter(e => e.category === 'Kompleks');
      const coreExercises = HANIK_DB.core;

      // Blok A: Row + KB Rotasyon
      const strongRows = rowExercises.filter(e => e.name !== 'Deep Rows');
      const rowMove = getRandomItems(strongRows.length > 0 ? strongRows : rowExercises, 1)[0];
      const kbMove = getRandomItems(kbExercises, 1)[0];
      block.push({
        type: 'A – GÜÇ SUPERSET (Row + KB Rotasyon)',
        exercises: [
          { ...rowMove, sets: 4, rest: 'Süpersetle' },
          { ...kbMove, sets: 4, rest: '90sn' },
        ],
      });

      // Blok B: Çekiş Diğer + Landmine Rotasyon
      const cekisMove = getRandomItems(cekisExercises, 1)[0];
      const landmineMove = getRandomItems(landmineExercises, 1)[0];
      block.push({
        type: 'B – ÇEKİŞ SUPERSET (Biceps + Landmine)',
        exercises: [
          { ...cekisMove, sets: 3, rest: 'Süpersetle' },
          { ...landmineMove, sets: 3, rest: '75sn' },
        ],
      });

      // Blok C: Farklı Row + Core
      const row2Move = getRandomItems(rowExercises.filter(e => e.name !== rowMove.name), 1)[0] || getRandomItems(rowExercises, 1)[0];
      const coreMove = getRandomItems(coreExercises, 1)[0];
      block.push({
        type: 'C – DAYANIKLILIK SUPERSET (Row + Core)',
        exercises: [
          { ...row2Move, sets: 3, rest: 'Süpersetle' },
          { ...coreMove, sets: 3, rest: '75sn' },
        ],
      });

      // Blok D: Kompleks + Core (Finisher)
      const kompleksMove = getRandomItems(kompleksExercises, 1)[0];
      const core2Move = getRandomItems(coreExercises.filter(e => e.name !== coreMove.name), 1)[0] || getRandomItems(coreExercises, 1)[0];
      block.push({
        type: 'D – KOMPLEKS FİNİŞER (Kompleks + Core)',
        exercises: [
          { ...kompleksMove, sets: 3, rest: 'Süpersetle' },
          { ...core2Move, sets: 3, rest: '60sn' },
        ],
      });
    }

    return block;
  };

  // ── Moda göre kişiselleştirilmiş ısınma ──────────────────────
  const getWarmupForFocus = (focus, count, isHanik) => {
    if (isHanik) return getRandomItems(HANIK_DB.warmup, Math.min(count + 3, 7));

    const warmupDB = EXERCISE_DB.warmup;

    // Kategori havuzları
    const shoulderMoves = warmupDB.filter(m =>
      /shoulder|scapula|banded|i.y.t/i.test(m.name));
    const hipMoves = warmupDB.filter(m =>
      /hip|lizard|squat|butterfly|90.90|glute/i.test(m.name));
    const spineMoves = warmupDB.filter(m =>
      /camel|cobra|bear|dead bug/i.test(m.name));

    let pool = [];

    if (['gvt', 'gvt_legs', 'ovt_pull'].includes(focus)) {
      // Bacak günü → kalça + omurga odaklı
      pool = [...hipMoves, ...spineMoves, ...warmupDB];
    } else if (['gvt_push', 'gvt_pull', 'ovt', 'ovt_push'].includes(focus)) {
      // Üst vücut günü → omuz + skapula odaklı
      pool = [...shoulderMoves, ...spineMoves, ...warmupDB];
    } else if (focus === 'engine' || focus === 'metcon') {
      // MetCon günü → dinamik genel
      pool = [...spineMoves, ...hipMoves, ...warmupDB];
    } else if (focus === 'recovery') {
      // Recovery → tam mobilite
      pool = [...hipMoves, ...spineMoves, ...shoulderMoves, ...warmupDB];
    } else {
      // Diğer (hybrid, prime, aesthetics, fbb)
      pool = warmupDB;
    }

    // Tekrar olmasın
    const unique = [...new Map(pool.map(m => [m.name, m])).values()];
    return getRandomItems(unique, Math.min(count, unique.length));
  };

  // ── Güç blokunu süreye göre kırp ─────────────────────────────
  const trimStrengthByDuration = (blocks, duration) => {
    if (duration === 90) return blocks; // 90 dk → hepsi
    if (duration === 60) {
      // 60 dk → max 3 blok
      return blocks.slice(0, 3);
    }
    // 45 dk → max 2 blok, her blokta max 1 egzersiz (superset yok)
    return blocks.slice(0, 2).map(block => ({
      ...block,
      exercises: block.exercises.slice(0, 1),
    }));
  };

  // ── MetCon süreye göre ayarla ─────────────────────────────────
  const getMetconDuration = (duration) => {
    if (duration === 45) return null;   // 45 dk → MetCon yok
    if (duration === 90) return 20;     // 90 dk → 20 dk MetCon
    return 12;                           // 60 dk → 12 dk MetCon
  };

    const generateStrengthBlock = (focus) => {
    // Strateji tablosu — if-else zinciri yerine
    const STRATEGIES = {
      hanik_push_legs: () => construct_Hanik('push_legs'),
      hanik_pull_core: () => construct_Hanik('pull_core'),
      gvt:             () => construct_GVT('lower'),
      gvt_legs:        () => construct_GVT('lower'),
      gvt_push:        () => construct_GVT('upper'),
      gvt_pull:        () => construct_GVT('upper'),
      ovt:             () => construct_OVT('upper'),
      ovt_push:        () => construct_OVT('upper'),
      ovt_pull:        () => construct_OVT('lower'),
      fbb:             () => construct_FBB(),
      recovery:        () => construct_Recovery(true),

      engine: () => {
        const powerMove = getRandomItems(EXERCISE_DB.power, 1)[0];
        return [{
          type: "POWER PRIMER (Kısa)",
          exercises: [{ ...powerMove, sets: 3, reps: 5, rest: "90sn", tempo: "X0X0", note: "Isınma amaçlı." }]
        }];
      },

      aesthetics: () => {
        const splitType = ["Push", "Pull", "Legs"][Math.floor(Math.random() * 3)];
        const pools = {
          Push: [
            { ...getRandomItems(EXERCISE_DB.strength.push.compound, 1)[0],  sets: 4, reps: "8-10"  },
            { ...getRandomItems(EXERCISE_DB.strength.push.accessory, 1)[0], sets: 4, reps: "12-15" },
            { ...getRandomItems(EXERCISE_DB.strength.push.accessory, 1)[0], sets: 3, reps: "15-20" },
          ],
          Pull: [
            { ...getRandomItems(EXERCISE_DB.strength.pull.compound, 1)[0],  sets: 4, reps: "8-10" },
            { ...getRandomItems(EXERCISE_DB.strength.pull.accessory, 1)[0], sets: 4, reps: "12"   },
            { ...getRandomItems(EXERCISE_DB.strength.pull.accessory, 1)[0], sets: 3, reps: "15"   },
          ],
          Legs: [
            { ...getRandomItems(EXERCISE_DB.strength.legs.compound, 1)[0],  sets: 4, reps: "8-10" },
            { ...getRandomItems(EXERCISE_DB.strength.legs.accessory, 1)[0], sets: 4, reps: "12"   },
          ],
        };
        return [{ type: `${splitType.toUpperCase()} HYPERTROPHY`, exercises: pools[splitType] }];
      },

      prime: () => {
        const powerMove    = getRandomItems(EXERCISE_DB.power, 1)[0];
        const mainCompound = getRandomItems([
          ...EXERCISE_DB.strength.legs.compound,
          ...EXERCISE_DB.strength.push.compound,
          ...EXERCISE_DB.strength.pull.compound,
        ], 1)[0];
        const fbbMove = getRandomItems(EXERCISE_DB.fbb, 1)[0];
        return [
          { type: "A. NEURAL ACTIVATION (POWER)",    exercises: [{ ...powerMove,    sets: 5, reps: 3,              rest: "2dk",  tempo: "X0X0", note: "Maksimum patlayıcılık." }] },
          { type: "B. MAIN STRENGTH (CLUSTER SETS)", exercises: [{ ...mainCompound, sets: 4, reps: "2-2-2 (15sn ara)", rest: "3dk", tempo: "X0X0", note: "Cluster Set: 2 tekrar yap, 15sn dinlen, 2 yap, 15sn dinlen, 2 yap. Bu 1 set." }] },
          { type: "C. STRUCTURAL BALANCE (FBB)",     exercises: [{ ...fbbMove,      sets: 3, reps: "8-10/side",   rest: "90sn", tempo: "3010", note: "Kaliteye odaklan." }] },
        ];
      },

      hybrid: () => {
        const main       = getRandomItems([...EXERCISE_DB.strength.push.compound, ...EXERCISE_DB.strength.legs.compound], 1)[0];
        const functional = getRandomItems(EXERCISE_DB.fbb, 2);
        return [
          { type: "HYBRID POWER",    exercises: [{ ...main, sets: 5, reps: 5, rest: "2dk", tempo: "X0X0" }] },
          { type: "FUNCTIONAL FLOW", exercises: functional.map(f => ({ ...f, sets: 3, reps: 12, rest: "60sn" })) },
        ];
      },
    };

    // Strateji varsa çalıştır, yoksa default
    const strategy = STRATEGIES[focus];
    if (strategy) return strategy();

    // Default — strength ve bilinmeyen modlar
    const main = getRandomItems([
      ...EXERCISE_DB.strength.push.compound,
      ...EXERCISE_DB.strength.legs.compound,
      ...EXERCISE_DB.strength.pull.compound,
    ], 1)[0];
    return [{ type: "MAX EFFORT", exercises: [{ ...main, sets: 5, reps: 3, rest: "3dk", tempo: "X0X0" }] }];
  };

  const generateMetconBlock = (focus, duration = 60) => {
    // 45 dk'da MetCon yok
    const metconDuration = getMetconDuration(duration);
    if (!metconDuration) return null;

    if (focus === 'engine') {
      const formats = ["AMRAP", "EMOM", "CHIPPER"];
      const fmt = formats[Math.floor(Math.random() * formats.length)];
      const metconMoves = getRandomItems(EXERCISE_DB.metcon, 3);
      const powerMove   = getRandomItems(EXERCISE_DB.power, 1)[0];
      const coreMove    = getRandomItems(EXERCISE_DB.core, 1)[0];

      if (fmt === "CHIPPER") return {
        type: "CHIPPER",
        structure: `FOR TIME (Chipper) - Time Cap: ${metconDuration === 20 ? 25 : 18} Min`,
        coachNote: "Parçala ve yönet. Hepsini bir kerede yapmaya çalışma.",
        exercises: [
          { ...metconMoves[0], reps: metconDuration === 20 ? 50 : 30, note: "Başla, tempo tut" },
          { ...metconMoves[1], reps: metconDuration === 20 ? 40 : 25, note: "Parçala" },
          { ...powerMove,      reps: metconDuration === 20 ? 30 : 15, note: "Patlayıcı ama kontrollü" },
          { ...metconMoves[2], reps: metconDuration === 20 ? 20 : 10, note: "Son hamle!" },
          { ...coreMove,       reps: 10, note: "Bitir!" },
        ],
      };

      if (fmt === "EMOM") return {
        type: "EMOM",
        structure: `EMOM x ${metconDuration} Dakika`,
        coachNote: "Her dakikanın başında ilgili hareketi yap. Kalan süre dinlenme.",
        exercises: [
          { ...metconMoves[0], reps: "12-15", note: "Tek dakikalar" },
          { ...metconMoves[1], reps: "12-15", note: "Çift dakikalar" },
          { ...powerMove,      reps: "8-10",  note: "Her 3. dakika" },
          { ...coreMove,       reps: "30sn",  note: "Her 4. dakika" },
        ],
      };

      return {
        type: "AMRAP",
        structure: `AMRAP x ${metconDuration} Dakika`,
        coachNote: "Sabit tempo > hızlı başlayıp yavaşlamak.",
        exercises: [
          { ...metconMoves[0], reps: 15, note: "Her turda" },
          { ...metconMoves[1], reps: 12, note: "Her turda" },
          { ...powerMove,      reps: 9,  note: "Her turda" },
          { ...coreMove,       reps: "20 tekrar veya 30sn", note: "Her turda" },
        ],
      };
    }

    if (focus === 'prime') return {
      type: "THE ACID BATH (Finisher)",
      structure: "3 Rounds For Time: 21-15-9 Reps",
      exercises: getRandomItems(EXERCISE_DB.metcon, 2),
    };

    // Standart
    const types = ["AMRAP", "EMOM", "FOR TIME", "TABATA"];
    const selectedType = focus === 'metcon'
      ? (Math.random() > 0.5 ? "AMRAP" : "FOR TIME")
      : types[Math.floor(Math.random() * types.length)];

    const structureMap = {
      AMRAP:      `AMRAP x ${metconDuration} Dakika`,
      EMOM:       `EMOM x ${metconDuration} Dakika`,
      'FOR TIME': `${metconDuration === 20 ? 5 : 3} Rounds For Time (Time Cap: ${metconDuration + 5} Min)`,
      TABATA:     "Tabata (20sn Work / 10sn Rest) x 8 Rounds",
    };

    return {
      type:      selectedType,
      structure: structureMap[selectedType],
      exercises: getRandomItems(EXERCISE_DB.metcon, focus === 'metcon' ? 4 : 3),
    };
  };
  // Son 7 günde hangi kas grupları kaç kez çalıştı
  const getWeeklyMuscleFrequency = () => {
    const history = JSON.parse(localStorage.getItem('arete_history') || '[]');
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentWorkouts = history.filter(h => h.timestamp > oneWeekAgo);

    const freq = {
      legs: 0, push: 0, pull: 0, core: 0, cardio: 0,
    };

    const focusMap = {
      gvt:             'legs',
      gvt_legs:        'legs',
      gvt_push:        'push',
      gvt_pull:        'pull',
      ovt:             'push',
      ovt_push:        'push',
      ovt_pull:        'legs',
      hanik_push_legs: 'push',
      hanik_pull_core: 'pull',
      aesthetics:      'push',
      prime:           'push',
      hybrid:          'push',
      fbb:             'core',
      engine:          'cardio',
      metcon:          'cardio',
      recovery:        'core',
      strength:        'push',
    };

    recentWorkouts.forEach(w => {
      const cat = focusMap[w.focus];
      if (cat) freq[cat]++;
    });

    return freq;
  };

    const generateWorkout = useCallback(() => {
    setLoading(true);
    setLogs({});

    const duration = parseInt(config.duration) || 60; // 45 | 60 | 90
    const isHanik  = config.focus.startsWith('hanik_');
    const isGVT    = config.focus.startsWith('gvt');
    const isOVT    = config.focus.startsWith('ovt');
    const noMetcon = isHanik || isGVT || isOVT ||
                     config.focus === 'aesthetics' ||
                     config.focus === 'recovery';

    // ── Süreye göre ısınma miktarı ──
    const warmupCount = duration === 45 ? 2 : duration === 90 ? 5 : 4;

    // ── Süreye göre core miktarı ──
    const coreCount = duration === 45 ? 0 : duration === 90 ? 4 : 3;

    // ── Moda göre kişiselleştirilmiş ısınma ──
    const warmup = getWarmupForFocus(config.focus, warmupCount, isHanik);

    // ── Güç bloku — süreye göre kırpılır ──
    const fullStrength = generateStrengthBlock(config.focus);
    const strength = trimStrengthByDuration(fullStrength, duration);

    // ── MetCon — süreye göre ayarlanır ──
    const metcon = noMetcon ? null : generateMetconBlock(config.focus, duration);

    // ── Aksesuar — sadece 90 dk'da ve aesthetics modunda ──
    const accessories = config.focus === 'aesthetics' && duration >= 60
      ? [...getRandomItems(EXERCISE_DB.strength.push.accessory, duration === 90 ? 2 : 1),
         ...getRandomItems(EXERCISE_DB.fbb, 1)]
      : null;

    // ── Core — 45 dk'da yok ──
    const core = (isHanik || coreCount === 0) ? [] : getRandomItems(EXERCISE_DB.core, coreCount);

    // ── Havuz — sadece 90 dk'da ──
    const swim = (config.poolAccess && !isHanik && duration === 90)
      ? getRandomItems(EXERCISE_DB.swim, 1)[0]
      : null;

    const newWorkout = {
      name:        generateName(config.focus),
      quote:       QUOTES[Math.floor(Math.random() * QUOTES.length)],
      warmup,
      strength,
      metcon,
      accessories,
      core,
      swim,
      focus:       config.focus,
      duration,
    };

    setWorkout(newWorkout);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [config]);

  const generateName = (focus) => {
    const prefixes = ["ARETE", "OLYMPUS", "TITAN", "KRONOS", "ATLAS"];
    const suffixes = {
      hybrid: "SPARTAN HYBRID",
      gvt: "GERMAN VOLUME",
      strength: "HERCULEAN STRENGTH",
      metcon: "HERMES ENDURANCE",
      aesthetics: "APOLLON AESTHETICS",
      gvt_legs: "GVT // LEGS DAY",
      gvt_push: "GVT // PUSH DAY",
      gvt_pull: "GVT // PULL DAY",
      ovt: "OVT // NEURAL POWER",
      ovt_push: "OVT // PUSH POWER",
      ovt_pull: "OVT // PULL POWER",
      fbb: "FUNCTIONAL BODYBUILDING",
      engine: "ENGINE // METCON",
      recovery: "AKTIF ONARIM",
      prime: "PRIME: HYBRID ATHLETE",
      hanik_push_legs: "HANİK // PUSH & LEGS",
      hanik_pull_core: "HANİK // PULL & CORE"
    };
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} // ${suffixes[focus] || focus.toUpperCase()}`;
  };

  // Focus Mode Handlers
  const handleStrengthComplete = useCallback((setLogs) => {
    console.log('Antrenman tamamlandı:', setLogs);
    setFocusMode(null);
    setShowSummary(true); // özet ekranını aç
  }, []);

  const handleMetconComplete = useCallback((results) => {
    console.log('MetCon tamamlandı:', results);
    setFocusMode(null);
    toast.success(`🔥 ${results.rounds} tur tamamlandı! Motor gibisin.`);
  }, [toast]);

  // Focus Mode Screens
  if (focusMode === 'strength' && workout?.strength) {
    return <StrengthFocusScreen workout={workout} onComplete={handleStrengthComplete} onExit={() => setFocusMode(null)} />;
  }
  if (focusMode === 'metcon' && workout?.metcon) {
    return <MetconFocusScreen workout={workout} onComplete={handleMetconComplete} onExit={() => setFocusMode(null)} />;
  }

  return (
    <ThemeContext.Provider value={darkMode}>
      <div
        className={`min-h-screen font-sans selection:bg-amber-500 selection:text-slate-900 pb-24 relative ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-gray-100 text-gray-800'}`}
        data-theme={darkMode ? 'dark' : 'light'}
      >
        <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          toast={toast}
          setConfirmState={setConfirmState}
        />
        <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
        <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} workoutContext={workout} />
        <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />
        <WorkoutSummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          workout={workout}
          logs={logs}
          toast={toast}
          setConfirmState={setConfirmState}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <OneRMModal isOpen={showOneRM} onClose={() => setShowOneRM(false)} darkMode={darkMode} />
        {showOnboarding && (
          <OnboardingModal onClose={() => {
            localStorage.setItem('arete_onboarded', '1');
            setShowOnboarding(false);
          }} />
        )}

        <header className={`border-b sticky top-0 z-50 shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-gray-200 shadow-gray-200/80'}`}>
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-20"></div>
                <AreteLogo size={38} />
              </div>
              <div>
                <h1 className={`text-xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'} font-serif leading-none`}>ARETE</h1>
                <p className="text-[8px] gradient-text font-bold tracking-[0.2em] uppercase">Philosophy of Strength</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowHistory(true)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`} title="Geçmiş"><Timer size={18} /></button>
              <button onClick={() => setShowOneRM(true)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`} title="1RM Hesaplayici"><Calculator size={18} /></button>
              <button onClick={() => setShowGuide(true)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}><BookOpen size={18} /></button>
              <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-full ${activeTab === 'settings' ? 'text-amber-400' : darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`} title="Ayarlar"><Settings size={18} /></button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-4">

          {/* ─── ANTRENMAN TAB ─── */}
          {activeTab === 'workout' && (
            <>
              {/* Collapsible Config Panel */}
              <div className={`mb-4 rounded-xl border overflow-hidden ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
                <button
                  onClick={() => setConfigOpen(p => !p)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between transition-colors ${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-xs font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <Activity className="text-amber-500" size={14} /> Antrenman Ayarları
                  </span>
                  {configOpen
                    ? <ChevronUp size={14} className="text-slate-400" />
                    : <ChevronDown size={14} className="text-slate-400" />}
                </button>
                {configOpen && (
                  <div className={`px-4 pb-4 border-t ${darkMode ? 'border-slate-800/30' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase tracking-wide mb-1">Hedef</label>
                        <div className="relative">
                          <select value={config.focus} onChange={(e) => setConfig({ ...config, focus: e.target.value })}
                            className={`w-full border rounded-lg p-2 text-xs appearance-none focus:border-amber-500 outline-none ${darkMode ? 'bg-slate-950 border-slate-700/50 text-slate-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}>
                            <optgroup label="⚡ Patlayıcı &amp; Kuvvet">
                              <option value="hanik_push_legs">Hanik – Push &amp; Legs</option>
                              <option value="hanik_pull_core">Hanik – Pull &amp; Core</option>
                            </optgroup>
                            <option value="hybrid">Spartan Hybrid</option>
                            <option value="prime">Arete Prime</option>
                            <optgroup label="GVT – 10×10">
                              <option value="gvt">GVT – Alt Vücut (Bacak &amp; Karın)</option>
                              <option value="gvt_push">GVT – Üst Vücut (Göğüs &amp; Sırt)</option>
                            </optgroup>
                            <optgroup label="OVT – Superset">
                              <option value="ovt">OVT – Üst Vücut (İtiş &amp; Çekiş)</option>
                              <option value="ovt_pull">OVT – Alt Vücut (Bacak &amp; Alt Sırt)</option>
                            </optgroup>
                            <option value="fbb">FBB - Fonksiyonel</option>
                            <option value="engine">Engine - MetCon</option>
                            <option value="recovery">Recovery</option>
                            <optgroup label="Klasik">
                              <option value="aesthetics">Aesthetics</option>
                              <option value="strength">Strength</option>
                              <option value="metcon">Endurance</option>
                            </optgroup>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 text-slate-500 pointer-events-none" size={11} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase tracking-wide mb-1">Süre</label>
                        <div className="relative">
                          <select value={config.duration} onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                            className={`w-full border rounded-lg p-2 text-xs appearance-none focus:border-amber-500 outline-none ${darkMode ? 'bg-slate-950 border-slate-700/50 text-slate-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}>
                            <option value="45">45 dk</option>
                            <option value="60">60 dk</option>
                            <option value="90">90 dk</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 text-slate-500 pointer-events-none" size={11} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase tracking-wide mb-1">Havuz</label>
                        <button
                          onClick={() => setConfig({ ...config, poolAccess: !config.poolAccess })}
                          className={`w-full p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all text-xs ${config.poolAccess ? 'bg-blue-950/40 border-blue-500/30 text-blue-300' : darkMode ? 'bg-slate-950 border-slate-700/50 text-slate-500' : 'bg-gray-50 border-gray-300 text-gray-400'}`}>
                          <Waves size={12} />{config.poolAccess ? <CheckCircle size={12} /> : '—'}
                        </button>
                      </div>
                    </div>
                    {/* Haftalık denge önerisi */}
                    {(() => {
                      const freq = getWeeklyMuscleFrequency();
                      const sorted = Object.entries(freq).sort((a, b) => a[1] - b[1]);
                      const least = sorted[0]; // En az çalışılan
                      const most  = sorted[sorted.length - 1]; // En çok çalışılan

                      if (most[1] === 0) return null; // Hiç antrenman yoksa gösterme

                      const suggestions = {
                        legs:    { label: 'Bacak günü', focus: 'gvt',      emoji: '🦵' },
                        push:    { label: 'İtiş günü',  focus: 'ovt',      emoji: '💪' },
                        pull:    { label: 'Çekiş günü', focus: 'hanik_pull_core', emoji: '🏋️' },
                        core:    { label: 'Fonksiyonel', focus: 'fbb',     emoji: '🎯' },
                        cardio:  { label: 'Kondisyon',  focus: 'engine',   emoji: '🔥' },
                      };

                      const sug = suggestions[least[0]];
                      if (!sug || least[1] >= 2) return null; // Zaten dengeli

                      return (
                        <div style={{
                          marginBottom: 10, padding: '8px 12px', borderRadius: 8,
                          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <span style={{ fontSize: 16 }}>{sug.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>Bu hafta öneri</p>
                            <p style={{ fontSize: 11, color: '#64748b' }}>{sug.label} az çalıştı</p>
                          </div>
                          <button
                            onClick={() => setConfig(prev => ({ ...prev, focus: sug.focus }))}
                            style={{
                              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                              color: '#f59e0b', cursor: 'pointer',
                            }}>
                            Uygula
                          </button>
                        </div>
                      );
                    })()}
                                        <button onClick={() => {
                        if (Object.keys(logs).length > 0) {
                          setConfirmState({
                            message: 'Devam eden antrenmanda kayıtlı veri var. Yeni antrenman oluşturulursa kayıtlar silinir.',
                            variant: 'danger',
                            confirmLabel: 'Yine de Oluştur',
                            onConfirm: generateWorkout,
                          });
                        } else {
                          generateWorkout();
                        }
                      }} disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-2.5 rounded-lg shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
                      {loading ? <RefreshCw className="animate-spin" size={15} /> : <Flame size={15} />} ANTRENMAN OLUŞTUR
                    </button>
                  </div>
                )}
              </div>

              {workout && (
                <div className="space-y-1">
                  <div className="text-center mb-4 pt-1">
                    <h2 className={`text-base font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {workout.name}
                      {estimateDuration(workout) && (
                        <span className="text-xs text-slate-500 ml-2 font-normal normal-case">~{estimateDuration(workout)} dk</span>
                      )}
                    </h2>
                    <p className="text-[11px] text-amber-500/80 italic mt-1">"{workout.quote}"</p>
                    {(() => {
                      const todayKey = new Date().toISOString().split('T')[0];
                      const saved = JSON.parse(localStorage.getItem('recoveryScores') || '{}');
                      const scores = saved[todayKey];
                      if (!scores) return null;
                      const readiness = Math.round(((scores.sleep + scores.energy + (6 - scores.soreness)) / 3) * 20);
                      const color = readiness >= 70 ? '#22c55e' : readiness >= 40 ? '#f59e0b' : '#ef4444';
                      const label = readiness >= 70 ? 'Hazır' : readiness >= 40 ? 'Orta' : 'Düşük';
                      return (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold" style={{ color, borderColor: color + '40', background: color + '18' }}>
                          <span style={{ color }}>●</span> Toparlanma: {readiness}% · {label}
                        </div>
                      );
                    })()}
                    <div className="mt-2">
                      <button onClick={() => setShowChat(true)} className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] text-amber-400 hover:bg-amber-500/20 transition-all">
                        <Sparkles size={9} /> Kahine Sor
                      </button>
                      <ProactiveKahin workout={workout} darkMode={darkMode} />
                    </div>
                  </div>

                  <SectionCard title="Hazırlık" subTitle="Warm-Up" icon={RefreshCw} number={1}>
                    {workout.warmup.map((item, idx) => (
                      <ExerciseItem key={idx} exercise={item} onLogUpdate={handleLogUpdate} currentLog={logs[item.name]} />
                    ))}
                  </SectionCard>

                  <SectionCard
                    title="Güç Bloku"
                    subTitle={config.focus === 'prime' ? 'Prime' : config.focus.includes('gvt') ? 'GVT 10×10' : config.focus.includes('ovt') ? 'OVT Superset' : 'Strength'}
                    icon={config.focus === 'prime' ? Zap : Dumbbell}
                    number={2}
                  >
                    {workout.strength.map((block, bIdx) => (
                      <div key={bIdx} className="mb-2 last:mb-0">
                        <div className={`flex items-center gap-2 py-1 px-2 rounded-t border-b ${darkMode ? 'bg-slate-800/50 border-slate-700/30' : 'bg-gray-100 border-gray-200'}`}>
                          <span className="text-amber-500 font-bold text-[10px] font-mono">{String.fromCharCode(65 + bIdx)}</span>
                          <h4 className="text-slate-400 text-[10px] uppercase flex-1">{block.type}</h4>
                          {block.exercises.length > 1 && <Badge text="SUPERSET" color="bg-amber-900/40 text-amber-300" />}
                          {block.type.includes("10x10") && <Badge text="10×10" color="bg-red-900/40 text-red-200" />}
                          {block.type.includes("CLUSTER") && <Badge text="CLUSTER" color="bg-purple-900/40 text-purple-200" />}
                        </div>
                        {block.exercises.map((ex, eIdx) => (
                          <ExerciseItem key={eIdx} exercise={ex} onLogUpdate={handleLogUpdate} currentLog={logs[ex.name]} onSwap={() => swapExercise(bIdx, eIdx)} />
                        ))}
                      </div>
                    ))}
                  </SectionCard>

                  {workout.accessories && (
                    <SectionCard title="FBB & Aksesuar" subTitle="Functional Bodybuilding" icon={BicepsFlexed} number={3}>
                      {workout.accessories.map((move, idx) => (
                        <ExerciseItem key={idx} exercise={move} onLogUpdate={handleLogUpdate} currentLog={logs[move.name]} />
                      ))}
                    </SectionCard>
                  )}

                  {workout.metcon && workout.metcon.exercises && (
                    <SectionCard title="Kondisyon" subTitle={workout.metcon.structure || 'MetCon'} icon={Timer} number={workout.accessories ? 4 : 3}>
                      <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex justify-between items-center">
                        <span className="text-amber-400 font-bold text-xs">{workout.metcon.structure}</span>
                        <span className="text-slate-400 text-xs">{workout.metcon.rounds ? `${workout.metcon.rounds} Tur` : ''}{workout.metcon.time ? ` • ${workout.metcon.time} dk` : ''}</span>
                      </div>
                      {workout.metcon.exercises.map((move, idx) => (
                        <ExerciseItem key={idx} exercise={move} isMetcon={true} onLogUpdate={handleLogUpdate} currentLog={logs[move.name]} />
                      ))}
                      <MetconScoreLogger metcon={workout.metcon} darkMode={darkMode} />
                    </SectionCard>
                  )}

                  <SectionCard title="Merkez Bölge" subTitle="Iron Core" icon={Activity} number={workout.accessories ? (workout.metcon ? 5 : 4) : (workout.metcon ? 4 : 3)}>
                    {workout.core.map((move, idx) => (
                      <ExerciseItem key={idx} exercise={move} isMetcon={true} onLogUpdate={handleLogUpdate} currentLog={logs[move.name]} />
                    ))}
                  </SectionCard>

                  {workout.swim && (
                    <SectionCard title="Havuz" subTitle="Hydro Recovery" icon={Waves}>
                      <ExerciseItem exercise={workout.swim} isMetcon={true} onLogUpdate={handleLogUpdate} currentLog={logs[workout.swim.name]} />
                    </SectionCard>
                  )}

                  {/* FAB buttons – above bottom nav */}
                  <div className="fixed bottom-[80px] right-4 z-[90] flex flex-col gap-2">
                    {workout?.strength && workout.strength.length > 0 && (
                      <button onClick={() => setFocusMode('strength')}
                        className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-300 shadow-md'} border hover:border-amber-500 p-3 rounded-full shadow-xl transition-all`}
                        title="Güç Modu">
                        <Target size={20} className="text-amber-500" />
                      </button>
                    )}
                    {workout?.metcon && workout.metcon.exercises && (
                      <button onClick={() => setFocusMode('metcon')}
                        className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-300 shadow-md'} border hover:border-amber-500 p-3 rounded-full shadow-xl transition-all`}
                        title="Kondisyon Modu">
                        <Timer size={20} className="text-amber-500" />
                      </button>
                    )}
                    <button id="arete-save-btn" onClick={handleSaveWorkout}
                      className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-xl shadow-green-900/40 transition-all">
                      <Save size={20} />
                    </button>
                  </div>

                  <div className="mt-10 text-center opacity-40">
                    <div className="w-12 h-px bg-amber-600 mx-auto mb-3"></div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em]">Excellence is a habit</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── CALİSTHENİCS TAB ─── */}
          {activeTab === 'calisthenics' && (
            <div>
              <div className="text-center mb-4">
                <h2 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Calisthenics
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  Başlangıçtan elite'e · {CALISTHENICS_DB.reduce((acc, cat) => acc + cat.moves.length, 0)} hareket
                </p>
              </div>
              <CalisthenicsTab darkMode={darkMode} toast={toast} />
            </div>
          )}

          {/* ─── BESLENME TAB ─── */}
          {activeTab === 'nutrition' && (
            <div>
              {/* Mod bazlı beslenme stratejisi */}
              {workout && (
                <div style={{
                  marginBottom: 12, padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                    🍽️ Bugünkü Beslenme Stratejisi
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                    {(() => {
                      const f = workout.focus;
                      if (['gvt', 'gvt_legs', 'gvt_push', 'gvt_pull'].includes(f))
                        return '🍚 GVT günü: Yüksek karbonhidrat. Antrenman öncesi pirinç/makarna, sonrası protein + karbonhidrat kombinasyonu.';
                      if (['ovt', 'ovt_push', 'ovt_pull'].includes(f))
                        return '⚖️ OVT günü: Dengeli makro. Protein ağırlıklı, orta karbonhidrat, düşük yağ.';
                      if (f === 'engine' || f === 'metcon')
                        return '⚡ MetCon günü: Antrenman öncesi hızlı karbonhidrat (muz/hurma). Sonrası protein shake + karbonhidrat.';
                      if (f === 'recovery')
                        return '🥗 Recovery günü: Hafif ve besleyici. Anti-inflamatuar gıdalar (yaban mersini, zencefil, yeşil yapraklılar).';
                      if (f === 'prime' || f === 'hybrid')
                        return '💪 Güç günü: Yüksek protein + orta karbonhidrat. Kreatin varsa bugün al.';
                      if (f === 'fbb')
                        return '🎯 FBB günü: Dengeli makro. Protein her öğünde, karbonhidrat antrenman etrafında yoğunlaştır.';
                      return '🍽️ Dengeli beslenme. Protein her öğünde, karbonhidrat aktiviteye göre ayarla.';
                    })()}
                  </p>
                </div>
              )}
                            {/* Diyet Modu Butonları */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setDietMode('normal'); setDailyMeal(null); }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${dietMode === 'normal'
                      ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-900/30'
                      : darkMode ? 'bg-slate-800/60 text-slate-400 border border-slate-700/50' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                  🍳 Normal
                </button>
                <button
                  onClick={() => { setDietMode('vegan'); setDailyMeal(null); }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${dietMode === 'vegan'
                      ? 'bg-green-500 text-white shadow-md shadow-green-900/30'
                      : darkMode ? 'bg-slate-800/60 text-slate-400 border border-slate-700/50' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                  🌱 Vegan
                </button>
              </div>

              {/* Antrenman Durumu */}
              <div className={`flex items-center justify-between p-3 rounded-xl mb-4 border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'
                }`}>
                <div>
                  <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bugün antrenman yaptım</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {workedOutToday
                      ? '💪 Aktif gün — yüksek protein öğünleri'
                      : '😴 Dinlenme günü — hafif öğünler'}
                  </p>
                </div>
                <button
                  onClick={() => { setWorkedOutToday(p => !p); setDailyMeal(null); }}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${workedOutToday ? 'bg-amber-500' : darkMode ? 'bg-slate-700' : 'bg-gray-300'
                    }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${workedOutToday ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                </button>
              </div>

              {/* Makro Özet Kartı */}
              <MacroSummaryCard dailyMeal={dailyMeal} workedOutToday={workedOutToday} darkMode={darkMode} />

              {/* Öğün Oluşturulmadıysa */}
              {!dailyMeal && (
                <div className="text-center py-14">
                  <div className="mb-5 opacity-30">
                    <Utensils size={48} className="mx-auto text-amber-500" />
                  </div>
                  <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Günlük Öğün Planı</p>
                  <p className="text-[11px] text-slate-500 mb-6">
                    {dietMode === 'vegan' ? 'Vegan tarifleri' : workedOutToday ? 'Yüksek proteinli aktif gün öğünleri' : 'Dinlenme günü hafif öğünleri'}
                  </p>
                  <button
                    onClick={generateDailyMeal}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-900/30 active:scale-[0.97] transition-all flex items-center gap-2 mx-auto text-sm">
                    <Utensils size={16} /> Günlük Öğün Oluştur
                  </button>
                </div>
              )}

              {/* Oluşturulan Öğün Planı */}
              {dailyMeal && (
                <div className="animate-fade-in-scale">
                  <MealSection
                    emoji={dietMode === 'vegan' ? '🌱' : '🍳'}
                    title="Kahvaltı / Öğle"
                    time="12:00 - 13:00 Arası"
                    recipes={[dailyMeal.kahvaltilik]}
                    darkMode={darkMode}
                  />
                  <MealSection
                    emoji={dietMode === 'vegan' ? '🌱' : '🍪'}
                    title="Ara Öğün"
                    time="15:00 - 16:00 Arası"
                    recipes={[dailyMeal.tatli]}
                    darkMode={darkMode}
                  />
                  <MealSection
                    emoji={dietMode === 'vegan' ? '🌱' : workedOutToday ? '🍲' : '🥗'}
                    title={workedOutToday ? 'Akşam Yemeği' : 'Akşam (Hafif)'}
                    time="19:00 - 20:00 Arası"
                    recipes={[dailyMeal.aksam]}
                    darkMode={darkMode}
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={generateDailyMeal}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-[0.97] transition-all">
                      <RefreshCw size={13} /> Yeni Plan
                    </button>
                    <button
                      onClick={() => setDailyMeal(null)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700/50 hover:text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                      Sıfırla
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TOPARLANMA TAB ─── */}
          {activeTab === 'recovery' && (
            <RecoveryCheckIn toast={toast} darkMode={darkMode} />
          )}

          {/* ─── İSTATİSTİK TAB ─── */}
          {activeTab === 'stats' && <StatsTab darkMode={darkMode} />}

          {activeTab === 'program' && (
            <ProgramTab
              darkMode={darkMode}
              program={program}
              setProgram={setProgram}
              setConfig={setConfig}
              setActiveTab={setActiveTab}
              toast={toast}
              setConfirmState={setConfirmState}
            />
          )}

          {/* ─── AYARLAR TAB ─── */}
          {activeTab === 'settings' && (
            <div className="space-y-3">
              <h2 className={`text-xs font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Target className="text-amber-500" size={14} /> Ayarlar
              </h2>

              {/* Görünüm toggle */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Görünüm</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{darkMode ? '🌙 Karanlık Tema' : '☀️ Aydınlık Tema'}</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(p => !p)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-amber-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Geçmiş */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Antrenman Geçmişi</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Kaydedilen antrenmanlar</p>
                  </div>
                  <button onClick={() => setShowHistory(true)}
                    className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors">
                    Görüntüle
                  </button>
                </div>
              </div>

              {/* Rehber */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Antrenman Rehberi</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Metodoloji & açıklamalar</p>
                  </div>
                  <button onClick={() => setShowGuide(true)}
                    className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors">
                    Aç
                  </button>
                </div>
              </div>

              {/* Sohbet / Kahin */}
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kahin – AI Koç</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Antrenman sorularını sor</p>
                  </div>
                  <button onClick={() => setShowChat(true)}
                    className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors">
                    Aç
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-slate-900/30 border-slate-800/30' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] font-black text-amber-500">ARETE v2.5</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Philosophy of Strength · Excellence is a Habit</p>
              </div>
            </div>
          )}

        </main>

        {/* ─── COMPACT BOTTOM NAV ─── */}
        <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${darkMode ? 'bg-slate-900/96 border-slate-800/60' : 'bg-white/96 border-gray-200'}`}>
          <div className="max-w-3xl mx-auto flex items-stretch relative">

            {/* Antrenman */}
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'workout' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'workout' && <span className="text-[10px] font-semibold tracking-wide leading-none">Antrenman</span>}
              <Activity size={22} />
            </button>

            {/* Beslenme */}
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'nutrition' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'nutrition' && <span className="text-[10px] font-semibold tracking-wide leading-none">Beslenme</span>}
              <Utensils size={22} />
            </button>

            {/* Calisthenics */}
            <button
              onClick={() => setActiveTab('calisthenics')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'calisthenics' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'calisthenics' && <span className="text-[10px] font-semibold tracking-wide leading-none">Calisthenics</span>}
              <BicepsFlexed size={22} />
            </button>

            {/* ── Futuristic AI Button (center floating) ── */}
            <div className="relative flex flex-col items-center justify-start pt-1 pb-1" style={{ width: '72px', flexShrink: 0 }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-amber-500/20 blur-lg animate-pulse pointer-events-none" />
              <button
                onClick={() => setShowChat(true)}
                className="relative -top-4 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all duration-150"
                style={{
                  background: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fbbf24 70%, #f59e0b 100%)',
                  boxShadow: '0 0 0 3px rgba(245,158,11,0.25), 0 0 18px 4px rgba(217,119,6,0.45), 0 8px 24px rgba(0,0,0,0.5)',
                }}
                title="Kahin AI"
              >
                <div className="absolute inset-1 rounded-full border border-yellow-200/30 pointer-events-none" />
                <Sparkles size={22} className="text-slate-900 drop-shadow" />
              </button>
              <span className="text-[9px] font-black tracking-widest text-amber-400 -mt-5" style={{ letterSpacing: '0.18em' }}>KAHİN</span>
            </div>

            {/* İstatistik */}
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'stats' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'stats' && <span className="text-[10px] font-semibold tracking-wide leading-none">İstatistik</span>}
              <TrendingUp size={22} />
            </button>

            {/* Program */}
            <button
              onClick={() => setActiveTab('program')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'program' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'program' && <span className="text-[10px] font-semibold tracking-wide leading-none">Program</span>}
              <Calendar size={20} />
            </button>

            {/* Toparlanma */}
            <button
              onClick={() => setActiveTab('recovery')}
              className={`flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5 h-14 justify-end transition-colors ${activeTab === 'recovery' ? 'text-amber-400' : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'recovery' && <span className="text-[10px] font-semibold tracking-wide leading-none">Toparlanma</span>}
              <Heart size={22} />
            </button>


          </div>
        </nav>
      </div>
    </ThemeContext.Provider>


  );
}
