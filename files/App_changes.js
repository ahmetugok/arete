// ============================================================
// ARETE — App.js DEĞIŞIKLIK REHBERİ
// Bu dosyayı doğrudan çalıştırma, sadece referans olarak kullan.
// Her bölüm "NEREDE" ve "NE DEĞİŞECEK" şeklinde açıklanmıştır.
// ============================================================


// ─── 1. IMPORTS (dosyanın en üstü) ──────────────────────────
// Mevcut import satırına EKLE:

import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import ConfirmModal from './components/ui/ConfirmModal';
// useCallback zaten React'tan geliyor, sadece eksiksiz olduğundan emin ol:
import React, { useState, useRef, useEffect, useCallback } from 'react';


// ─── 2. focusMuscleLabel — EKSİK KEY'LER DÜZELTİLDİ ────────
// Mevcut focusMuscleLabel objesini TAMAMEN şununla değiştir:

const focusMuscleLabel = {
  gvt:              ['Bacak', 'Karın'],
  gvt_legs:         ['Bacak', 'Karın'],
  gvt_push:         ['Göğüs', 'Sırt', 'Omuz'],
  gvt_pull:         ['Göğüs', 'Sırt', 'Omuz'],
  ovt:              ['Göğüs', 'Sırt', 'İtiş', 'Çekiş'],
  ovt_push:         ['Göğüs', 'Omuz', 'Triseps'],
  ovt_pull:         ['Bacak', 'Alt Sırt', 'Hamstring'],
  hanik_push_legs:  ['Göğüs', 'Omuz', 'Bacak'],
  hanik_pull_core:  ['Sırt', 'Biseps', 'Karın'],
  fbb:              ['Full Body', 'Core'],
  engine:           ['Kondisyon', 'Full Body'],
  aesthetics:       ['Göğüs', 'Sırt', 'Kol'],
  hybrid:           ['Full Body'],
  prime:            ['Güç', 'Atletizm', 'Full Body'],  // ← EKLENDİ
  spartan_hybrid:   ['Full Body'],                     // ← EKLENDİ
  recovery:         ['Mobilite', 'Esneme'],
  strength:         ['Full Body'],
  metcon:           ['Kondisyon'],
};


// ─── 3. App() FONKSİYONU — STATE EKLEMELERI ─────────────────
// export default function App() { içinde, mevcut state'lerin yanına EKLE:

  const { toasts, toast, removeToast } = useToast();
  const [confirmState, setConfirmState] = useState(null);


// ─── 4. handleSaveWorkout — alert() DEĞİŞİKLİĞİ ─────────────
// Mevcut handleSaveWorkout fonksiyonunu TAMAMEN şununla değiştir:

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


// ─── 5. handleStrengthComplete — alert() DEĞİŞİKLİĞİ ────────
// Mevcut handleStrengthComplete fonksiyonunu şununla değiştir:

  const handleStrengthComplete = useCallback((setLogs) => {
    console.log('Antrenman tamamlandı:', setLogs);
    setFocusMode(null);
    toast.success('🏆 Güç Bloku Tamamlandı! Helal olsun!');
  }, [toast]);


// ─── 6. handleMetconComplete — alert() DEĞİŞİKLİĞİ ──────────
// Mevcut handleMetconComplete fonksiyonunu şununla değiştir:

  const handleMetconComplete = useCallback((results) => {
    console.log('MetCon tamamlandı:', results);
    setFocusMode(null);
    toast.success(`🔥 ${results.rounds} tur tamamlandı! Motor gibisin.`);
  }, [toast]);


// ─── 7. generateWorkout — useCallback + setTimeout kaldır ────
// Mevcut generateWorkout fonksiyonunu şununla değiştir:

  const generateWorkout = useCallback(() => {
    setLoading(true);
    setLogs({});

    // setTimeout kaldırıldı — gereksizdi, state güncellemesi zaten async
    const accessories = config.focus === 'aesthetics'
      ? [...getRandomItems(EXERCISE_DB.strength.push.accessory, 1),
         ...getRandomItems(EXERCISE_DB.fbb, 2)]
      : [];

    const isHanik   = config.focus.startsWith('hanik_');
    const isGVT     = config.focus.startsWith('gvt');
    const isOVT     = config.focus.startsWith('ovt');
    const noMetcon  = isHanik || isGVT || isOVT ||
                      config.focus === 'aesthetics' ||
                      config.focus === 'recovery';

    const newWorkout = {
      name:        generateName(config.focus),
      quote:       QUOTES[Math.floor(Math.random() * QUOTES.length)],
      warmup:      isHanik
                     ? getRandomItems(HANIK_DB.warmup, 7)
                     : getRandomItems(EXERCISE_DB.warmup, 4),
      strength:    generateStrengthBlock(config.focus),
      metcon:      noMetcon ? null : generateMetconBlock(config.focus),
      accessories: config.focus === 'aesthetics' ? accessories : null,
      core:        isHanik ? [] : getRandomItems(EXERCISE_DB.core, 3),
      swim:        (config.poolAccess && !isHanik)
                     ? getRandomItems(EXERCISE_DB.swim, 1)[0]
                     : null,
      focus:       config.focus,
    };

    setWorkout(newWorkout);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [config]); // generateStrengthBlock ve diğerleri dışarıya taşındığında buraya ekle


// ─── 8. HistoryModal — window.confirm DEĞİŞİKLİĞİ ───────────
// HistoryModal component'ına toast ve setConfirmState props olarak geçirilmeli.
//
// App() return'ünde şu satırı değiştir:
//   <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
// Şununla:
//   <HistoryModal
//     isOpen={showHistory}
//     onClose={() => setShowHistory(false)}
//     toast={toast}
//     setConfirmState={setConfirmState}
//   />
//
// HistoryModal içinde deleteEntry fonksiyonunu şununla değiştir:
//
//   const deleteEntry = (entryId, e) => {
//     e.stopPropagation();
//     setConfirmState({
//       message: 'Bu kayıt silinsin mi?',
//       variant: 'danger',
//       confirmLabel: 'Sil',
//       onConfirm: () => {
//         const newHistory = history.filter(h => h.id !== entryId);
//         localStorage.setItem('arete_history', JSON.stringify(newHistory));
//         setHistory(newHistory);
//         toast.success('Kayıt silindi.');
//       },
//     });
//   };
//
// Ayrıca "Tümünü Temizle" butonunu şununla değiştir:
//   onClick={() => setConfirmState({
//     message: 'Tüm kayıtlar silinsin mi?',
//     detail: 'Bu işlem geri alınamaz.',
//     variant: 'danger',
//     confirmLabel: 'Tümünü Sil',
//     onConfirm: () => { clearHistory(); setHistory([]); toast.success('Tüm kayıtlar silindi.'); },
//   })}


// ─── 9. App() RETURN — iki ekleme ────────────────────────────
// return( içinde, <GuideModal ... /> satırlarının YANINA EKLE:

  // (Mevcut modal satırlarının hemen altına)
  <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />
  <ToastContainer toasts={toasts} onRemove={removeToast} />


// ─── 10. SyllabusOverlay — runningIdx mutation DÜZELTİLDİ ───
// StrengthFocusScreen içindeki SyllabusOverlay'i TAMAMEN şununla değiştir:

  const SyllabusOverlay = () => {
    // useMemo ile hesapla — JSX içinde mutation yok
    const flatExercises = React.useMemo(() =>
      workout.strength.flatMap((block, bIdx) =>
        block.exercises.map((ex, eIdx) => ({
          ...ex,
          blockIndex: bIdx,
          blockLabel: block.type,
          globalIdx: workout.strength
            .slice(0, bIdx)
            .reduce((acc, b) => acc + b.exercises.length, 0) + eIdx,
        }))
      ),
    []);  // workout.strength değişmez, bağımlılık boş

    return (
      <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: 'rgba(13,27,42,0.97)' }}>
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid #1E3A5F' }}>
          <h2 className="text-white font-black text-xl tracking-widest uppercase">MÜFREDAT</h2>
          <button onClick={() => setShowSyllabus(false)} className="text-slate-400"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {workout.strength.map((block, bIdx) => (
            <div key={bIdx}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#E09F3E' }}>
                {block.type}
              </p>
              {block.exercises.map((ex, eIdx) => {
                const globalIdx = workout.strength
                  .slice(0, bIdx)
                  .reduce((acc, b) => acc + b.exercises.length, 0) + eIdx;
                const isDone    = completedSets.filter(k => k.startsWith(`${globalIdx}-`)).length >= (parseInt(ex.sets) || 5);
                const isActive  = globalIdx === currentExIdx;

                return (
                  <div key={eIdx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2"
                    style={{
                      background:  isActive ? 'rgba(224,159,62,0.12)' : 'rgba(30,58,92,0.5)',
                      border:      `1px solid ${isActive ? '#E09F3E' : '#1E3A5F'}`,
                      opacity:     isDone && !isActive ? 0.45 : 1,
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: isDone ? '#22c55e' : isActive ? '#E09F3E' : '#1E3A5F',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isDone   && <CheckCircle size={12} color="white" />}
                      {isActive && !isDone && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D1B2A' }} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: isActive ? '#E09F3E' : isDone ? '#64748b' : '#f1f5f9' }}>
                        {ex.name}
                      </p>
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
