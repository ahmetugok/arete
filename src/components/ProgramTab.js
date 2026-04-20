// src/components/ProgramTab.js
import React, { useState } from 'react';
import { PROGRAM_PLANS } from '../data/programData';
import { ChevronRight, ChevronLeft, Check, Play, Trash2, Zap } from 'lucide-react';

// ── Design tokens ──────────────────────────────────────────────────────────────
const T = {
  surface:     '#161A1D',
  surfaceLo:   '#111417',
  surfaceHi:   '#1E2226',
  accent:      '#D1FF26',
  accentDim:   'rgba(209,255,38,0.12)',
  accentBorder:'rgba(209,255,38,0.22)',
  outline:     'rgba(255,255,255,0.06)',
  muted:       '#7A7C80',
  text:        '#F9F9FD',
};
const card = (extra = {}) => ({ borderRadius: 20, background: T.surface, border: `1px solid ${T.outline}`, ...extra });

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const buildPhases = (planId, totalWeeks) => {
  if (totalWeeks === 4) return [
    { name: 'Adaptasyon', startWeek: 1, endWeek: 1, color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 2, endWeek: 3, color: T.accent },
    { name: 'Tepe',       startWeek: 4, endWeek: 4, color: '#ef4444' },
  ];
  if (totalWeeks === 8) return [
    { name: 'Adaptasyon', startWeek: 1, endWeek: 2, color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 3, endWeek: 5, color: T.accent },
    { name: 'Yoğunluk',  startWeek: 6, endWeek: 7, color: '#f97316' },
    { name: 'Tepe',       startWeek: 8, endWeek: 8, color: '#ef4444' },
  ];
  return [
    { name: 'Adaptasyon', startWeek: 1,  endWeek: 3,  color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 4,  endWeek: 7,  color: T.accent },
    { name: 'Yoğunluk',  startWeek: 8,  endWeek: 10, color: '#f97316' },
    { name: 'Tepe',       startWeek: 11, endWeek: 11, color: '#ef4444' },
    { name: 'Deload',     startWeek: 12, endWeek: 12, color: '#475569' },
  ];
};

const getCurrentWeek = (startDate) => {
  const start = new Date(startDate); const today = new Date();
  start.setHours(0,0,0,0); today.setHours(0,0,0,0);
  return Math.max(1, Math.floor((today - start) / 86400000 / 7) + 1);
};
const isDeloadWeek = (w) => w % 4 === 0;
const getPhaseForWeek = (phases, w) => phases.find(p => w >= p.startWeek && w <= p.endWeek) || phases[phases.length - 1];
const getTodaySlot = () => { const d = new Date().getDay(); return d === 0 ? 7 : d; };
const WEEKDAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/**
 * Build a program object from a PROGRAM_PLANS entry.
 * If customSlots provided, remap training days to those slots.
 */
const buildProgram = ({ planId, totalWeeks, daysPerWeek, customSlots }) => {
  const plan = PROGRAM_PLANS.find(p => p.id === planId);
  if (!plan) return null;

  let schedule;
  if (customSlots && customSlots.length > 0) {
    const trainingDays = plan.schedule.filter(s => s.focus !== 'recovery');
    const sortedSlots = [...customSlots].sort((a, b) => a - b);
    const assignedTraining = trainingDays.slice(0, sortedSlots.length).map((s, i) => ({
      ...s, weekdaySlot: sortedSlots[i], dayIndex: i,
    }));
    const usedSlots = new Set(sortedSlots);
    const restSlots = [1,2,3,4,5,6,7].filter(sl => !usedSlots.has(sl));
    const restDays = plan.schedule.filter(s => s.focus === 'recovery');
    const assignedRest = restDays.slice(0, restSlots.length).map((s, i) => ({
      ...s, weekdaySlot: restSlots[i], dayIndex: trainingDays.length + i,
    }));
    schedule = [...assignedTraining, ...assignedRest].sort((a, b) => a.weekdaySlot - b.weekdaySlot);
  } else {
    schedule = plan.schedule.map((s, i) => ({ ...s, dayIndex: i }));
  }

  return {
    id: Date.now(),
    goal: planId,
    title: plan.title,
    totalWeeks,
    daysPerWeek,
    startDate: new Date().toISOString().split('T')[0],
    completedDays: {},
    phases: buildPhases(planId, totalWeeks),
    schedule,
  };
};

// ─── WIZARD ───────────────────────────────────────────────────────────────────
const ProgramWizard = ({ darkMode, onCreate }) => {
  const [step, setStep]              = useState(0);
  const [goal, setGoal]              = useState(null); // planId
  const [totalWeeks, setTotalWeeks]  = useState(8);
  const [daysPerWeek, setDaysPerWeek]= useState(4);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const plan = goal ? PROGRAM_PLANS.find(p => p.id === goal) : null;
  const trainingCount = plan ? plan.schedule.filter(s => s.focus !== 'recovery').length : 0;

  const initDayPicker = () => {
    // default: plan'ın kendi weekdaySlot'larını kullan
    const defaults = plan
      ? plan.schedule.filter(s => s.focus !== 'recovery').map(s => s.weekdaySlot).slice(0, daysPerWeek)
      : [1,3,5].slice(0, daysPerWeek);
    setSelectedSlots(defaults);
    setStep(2);
  };

  const toggleSlot = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot);
      if (prev.length >= daysPerWeek) {
        const sorted = [...prev].sort((a, b) => a - b);
        return [...sorted.slice(1), slot].sort((a, b) => a - b);
      }
      return [...prev, slot].sort((a, b) => a - b);
    });
  };

  const handleCreate = () => {
    if (!goal) return;
    onCreate(buildProgram({ planId: goal, totalWeeks, daysPerWeek, customSlots: selectedSlots }));
  };

  const planTrainingSessions = plan
    ? plan.schedule.filter(s => s.focus !== 'recovery').slice(0, daysPerWeek)
    : [];
  const sortedSlots = [...selectedSlots].sort((a, b) => a - b);

  // ── STEP 0: Program Seç ──
  if (step === 0) return (
    <div style={{ padding: '16px 16px 24px' }}>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 4 }}>
        Program Seçin
      </h3>
      <p style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>Hedefinize göre optimize edilmiş programı seçin.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PROGRAM_PLANS.map(p => (
          <button key={p.id} onClick={() => { setGoal(p.id); setStep(1); }}
            style={{
              ...card({
                padding: '16px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                border: `1px solid ${goal === p.id ? T.accent : T.outline}`,
                background: goal === p.id ? T.accentDim : T.surface,
              }),
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.15s',
            }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{p.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: goal === p.id ? T.accent : T.text, fontFamily: 'Lexend, sans-serif' }}>{p.title}</p>
              <p style={{ fontSize: 10, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{p.desc}</p>
            </div>
            {goal === p.id && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: '#0C0E11', fontWeight: 900 }}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // ── STEP 1: Süre + Gün ──
  if (step === 1) return (
    <div style={{ padding: '16px 16px 24px' }}>
      <button onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        <ChevronLeft size={14} /> Geri
      </button>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 4 }}>Program Süresi</h3>
      <p style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>Kaç hafta ve kaç gün?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Toplam Süre</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[4, 8, 12].map(w => (
              <button key={w} onClick={() => setTotalWeeks(w)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 14, fontSize: 13, fontWeight: 800,
                  fontFamily: 'Lexend, sans-serif', cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: totalWeeks === w ? T.accent : T.surfaceHi,
                  color: totalWeeks === w ? '#0C0E11' : T.muted,
                }}>
                {w} Hafta
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Haftada Kaç Antrenman Günü</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[3, 4, 5, 6].map(d => {
              const available = trainingCount >= d;
              return (
                <button key={d} onClick={() => available && setDaysPerWeek(d)}
                  disabled={!available}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 14, fontSize: 13, fontWeight: 800,
                    fontFamily: 'Lexend, sans-serif', cursor: available ? 'pointer' : 'not-allowed',
                    border: 'none', transition: 'all 0.15s', opacity: available ? 1 : 0.3,
                    background: daysPerWeek === d && available ? T.accent : T.surfaceHi,
                    color: daysPerWeek === d && available ? '#0C0E11' : T.muted,
                  }}>
                  {d} Gün
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={initDayPicker}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 16, border: 'none',
            background: T.accent, color: '#0C0E11', fontWeight: 900, fontSize: 14,
            fontFamily: 'Lexend, sans-serif', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          Günleri Ayarla <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  // ── STEP 2: Gün Seçici ──
  if (step === 2) return (
    <div style={{ padding: '16px 16px 24px' }}>
      <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        <ChevronLeft size={14} /> Geri
      </button>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 4 }}>Antrenman Günleri</h3>
      <p style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>
        {daysPerWeek} günü seçin — antrenman tipi seçim sırasına göre atanır.
      </p>

      {/* 7 day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 20 }}>
        {WEEKDAY_LABELS.map((day, i) => {
          const slot = i + 1;
          const isSelected = selectedSlots.includes(slot);
          const orderIdx = sortedSlots.indexOf(slot);
          const session = isSelected && planTrainingSessions[orderIdx] ? planTrainingSessions[orderIdx] : null;
          return (
            <button key={day} onClick={() => toggleSlot(slot)}
              style={{
                borderRadius: 14, padding: '10px 4px', textAlign: 'center',
                border: `1.5px solid ${isSelected ? T.accentBorder : T.outline}`,
                background: isSelected ? T.accentDim : T.surfaceLo,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: isSelected ? T.accent : T.muted, textTransform: 'uppercase', marginBottom: 6 }}>{day}</p>
              <div style={{
                width: 24, height: 24, borderRadius: 8, margin: '0 auto 4px',
                background: isSelected ? T.accent : T.surfaceHi,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected
                  ? <span style={{ fontSize: 10, fontWeight: 900, color: '#0C0E11' }}>{orderIdx + 1}</span>
                  : <span style={{ fontSize: 9, color: T.muted }}>—</span>
                }
              </div>
              {session && (
                <p style={{ fontSize: 7, color: T.accent, fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
                  {session.label.split(' ').slice(0, 2).join(' ')}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Assignment preview */}
      <div style={{ ...card({ padding: '14px 16px' }), marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Atama Önizlemesi</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {planTrainingSessions.map((s, i) => {
            const assignedSlot = sortedSlots[i];
            const dayLabel = assignedSlot ? WEEKDAY_LABELS[assignedSlot - 1] : '?';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, color: assignedSlot ? T.accent : T.muted,
                  background: assignedSlot ? T.accentDim : T.surfaceHi,
                  padding: '3px 8px', borderRadius: 99, minWidth: 32, textAlign: 'center',
                }}>
                  {dayLabel}
                </span>
                <span style={{ fontSize: 12, color: assignedSlot ? T.text : T.muted, fontWeight: 600 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => setStep(3)} disabled={selectedSlots.length !== daysPerWeek}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 16, border: 'none',
          background: selectedSlots.length === daysPerWeek ? T.accent : T.surfaceHi,
          color: selectedSlots.length === daysPerWeek ? '#0C0E11' : T.muted,
          fontWeight: 900, fontSize: 14, fontFamily: 'Lexend, sans-serif', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: selectedSlots.length === daysPerWeek ? 1 : 0.5,
        }}>
        Önizlemeye Geç <ChevronRight size={16} />
      </button>
    </div>
  );

  // ── STEP 3: Önizleme ──
  const preview = buildProgram({ planId: goal, totalWeeks, daysPerWeek, customSlots: selectedSlots });
  const phases  = buildPhases(goal, totalWeeks);

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      <button onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        <ChevronLeft size={14} /> Geri
      </button>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 4 }}>Program Özeti</h3>
      <p style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>{plan?.desc}</p>

      {/* Weekly structure */}
      <div style={{ ...card({ padding: '14px 12px' }), marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Haftalık Yapı</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {WEEKDAY_LABELS.map((day, i) => {
            const slot = i + 1;
            const sched = preview?.schedule.find(s => s.weekdaySlot === slot);
            const isTraining = sched && sched.focus !== 'recovery';
            return (
              <div key={day} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: T.muted, marginBottom: 4 }}>{day}</p>
                <div style={{
                  borderRadius: 10, padding: '8px 2px',
                  background: isTraining ? T.accentDim : T.surfaceLo,
                  border: `1px solid ${isTraining ? T.accentBorder : T.outline}`,
                  minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isTraining
                    ? <p style={{ fontSize: 7, fontWeight: 800, color: T.accent, lineHeight: 1.2 }}>{sched.label.split(' ').slice(0, 2).join(' ')}</p>
                    : <p style={{ fontSize: 8, color: T.muted }}>—</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase timeline */}
      <div style={{ ...card({ padding: '14px 12px' }), marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Fazlar</p>
        <div style={{ display: 'flex', gap: 4 }}>
          {phases.map(p => (
            <div key={p.name} style={{
              flex: p.endWeek - p.startWeek + 1, borderRadius: 10, padding: '8px 4px', textAlign: 'center',
              background: `${p.color}15`, border: `1px solid ${p.color}30`,
            }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: p.color }}>{p.name}</p>
              <p style={{ fontSize: 7, color: T.muted }}>H{p.startWeek}{p.endWeek > p.startWeek ? `–${p.endWeek}` : ''}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleCreate}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 16, border: 'none',
          background: T.accent, color: '#0C0E11',
          fontWeight: 900, fontSize: 14, fontFamily: 'Lexend, sans-serif', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        <Play size={16} /> Programı Başlat
      </button>
    </div>
  );
};

// ─── ACTIVE PROGRAM VIEW ──────────────────────────────────────────────────────
const ActiveProgramView = ({ program, setProgram, darkMode, setConfig, setActiveTab, toast, setConfirmState, setWorkedOutToday }) => {
  const [editingSlots, setEditingSlots] = useState(false);
  const [pendingSlots, setPendingSlots]  = useState(null);

  const currentWeek = Math.min(getCurrentWeek(program.startDate), program.totalWeeks);
  const isComplete  = getCurrentWeek(program.startDate) > program.totalWeeks;
  const phase       = getPhaseForWeek(program.phases, currentWeek);
  const deload      = isDeloadWeek(currentWeek);
  const planInfo    = PROGRAM_PLANS.find(p => p.id === program.goal);
  const todaySlot   = getTodaySlot();
  const accentColor = T.accent;

  const trainingSlots = program.schedule
    .filter(s => s.focus !== 'recovery')
    .map(s => s.weekdaySlot)
    .sort((a, b) => a - b);
  const daysPerWeek = trainingSlots.length;

  const toggleDay = (weekNum, dayIndex, slotNum) => {
    const key = `W${weekNum}D${dayIndex}`;
    const nowDone = !program.completedDays[key];
    const updated = { ...program, completedDays: { ...program.completedDays, [key]: nowDone } };
    setProgram(updated);
    localStorage.setItem('arete_program', JSON.stringify(updated));
    if (nowDone && slotNum === todaySlot && setWorkedOutToday) {
      setWorkedOutToday(true);
    }
  };

  const openSlotEditor = () => {
    setPendingSlots(trainingSlots);
    setEditingSlots(true);
  };

  const togglePendingSlot = (slot) => {
    setPendingSlots(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot);
      if (prev.length >= daysPerWeek) {
        return [...prev.slice(1), slot].sort((a, b) => a - b);
      }
      return [...prev, slot].sort((a, b) => a - b);
    });
  };

  const applySlots = () => {
    if (!pendingSlots || pendingSlots.length !== daysPerWeek) return;
    const trainingDays = program.schedule.filter(s => s.focus !== 'recovery');
    const sortedSlots  = [...pendingSlots].sort((a, b) => a - b);
    const newTraining  = trainingDays.map((s, i) => ({ ...s, weekdaySlot: sortedSlots[i] }));
    const usedSlots    = new Set(sortedSlots);
    const restSlots    = [1,2,3,4,5,6,7].filter(sl => !usedSlots.has(sl));
    const restDays     = program.schedule.filter(s => s.focus === 'recovery');
    const newRest      = restDays.map((s, i) => ({ ...s, weekdaySlot: restSlots[i] ?? s.weekdaySlot }));
    const newSchedule  = [...newTraining, ...newRest].sort((a, b) => a.weekdaySlot - b.weekdaySlot);
    const updated      = { ...program, schedule: newSchedule };
    setProgram(updated);
    localStorage.setItem('arete_program', JSON.stringify(updated));
    setEditingSlots(false);
    toast.success('Antrenman günleri güncellendi!');
  };

  const handleStartDay = (focus) => {
    const duration = deload ? '45' : '60';
    setConfig(prev => ({ ...prev, focus, duration }));
    setActiveTab('workout');
    toast.success('Program günü yüklendi — Antrenmanı oluştur!');
  };

  const handleDelete = () => {
    setConfirmState({
      message: 'Aktif programı sil? Tüm ilerleme kaybolacak.',
      variant: 'danger', confirmLabel: 'Sil',
      onConfirm: () => { setProgram(null); localStorage.removeItem('arete_program'); toast.success('Program silindi.'); },
    });
  };

  if (isComplete) return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
      <h3 style={{ fontSize: 24, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 8 }}>Program Tamamlandı!</h3>
      <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>{program.totalWeeks} haftalık {planInfo?.title || program.goal} programını bitirdin.</p>
      <button onClick={handleDelete}
        style={{ width: '100%', padding: '15px 0', borderRadius: 16, border: 'none', background: T.accent, color: '#0C0E11', fontWeight: 900, fontSize: 14, fontFamily: 'Lexend, sans-serif', cursor: 'pointer' }}>
        Yeni Program Başlat
      </button>
    </div>
  );

  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={card({ padding: '18px 16px' })}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{planInfo?.icon || '🏋️'}</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif' }}>
                {program.title || planInfo?.title || program.goal}
              </h3>
              {deload && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: T.surfaceHi, color: T.muted, textTransform: 'uppercase' }}>
                  Deload
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${phase.color}18`, color: phase.color }}>
                {phase.name}
              </span>
              <span style={{ fontSize: 10, color: T.muted }}>Hafta {currentWeek}/{program.totalWeeks}</span>
            </div>
          </div>
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 4 }}>
            <Trash2 size={15} />
          </button>
        </div>
        <div style={{ height: 6, background: T.surfaceHi, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, width: `${(currentWeek / program.totalWeeks) * 100}%`, background: accentColor, transition: 'width 0.4s' }} />
        </div>
        <p style={{ fontSize: 9, color: T.muted, textAlign: 'right', marginTop: 4 }}>{Math.round((currentWeek / program.totalWeeks) * 100)}% tamamlandı</p>
      </div>

      {/* Weekly Calendar */}
      <div style={card({ padding: '16px 12px' })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Bu Hafta — Hafta {currentWeek}
          </p>
          <button onClick={openSlotEditor} style={{
            fontSize: 9, fontWeight: 700, color: T.accent,
            background: T.accentDim, border: `1px solid ${T.accentBorder}`,
            padding: '3px 10px', borderRadius: 99, cursor: 'pointer',
          }}>
            Günleri Düzenle
          </button>
        </div>

        {/* Slot editor */}
        {editingSlots && (
          <div style={{ marginBottom: 14, padding: '12px', background: T.surfaceLo, borderRadius: 14, border: `1px solid ${T.accentBorder}` }}>
            <p style={{ fontSize: 10, color: T.accent, fontWeight: 700, marginBottom: 10 }}>
              {daysPerWeek} antrenman günü seç
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 10 }}>
              {WEEKDAY_LABELS.map((day, i) => {
                const slot = i + 1;
                const isSelected = (pendingSlots || []).includes(slot);
                return (
                  <button key={day} onClick={() => togglePendingSlot(slot)} style={{
                    borderRadius: 10, padding: '8px 2px', textAlign: 'center',
                    border: `1.5px solid ${isSelected ? T.accentBorder : T.outline}`,
                    background: isSelected ? T.accentDim : T.surfaceHi,
                    cursor: 'pointer', fontSize: 8, fontWeight: 700,
                    color: isSelected ? T.accent : T.muted,
                  }}>
                    {day}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditingSlots(false)} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, border: `1px solid ${T.outline}`,
                background: 'transparent', color: T.muted, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>İptal</button>
              <button
                onClick={applySlots}
                disabled={(pendingSlots || []).length !== daysPerWeek}
                style={{
                  flex: 2, padding: '9px 0', borderRadius: 10, border: 'none',
                  background: (pendingSlots || []).length === daysPerWeek ? T.accent : T.surfaceHi,
                  color: (pendingSlots || []).length === daysPerWeek ? '#0C0E11' : T.muted,
                  fontSize: 11, fontWeight: 900, cursor: 'pointer',
                }}>
                Kaydet
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {WEEKDAY_LABELS.map((day, i) => {
            const slot = i + 1;
            const sched = program.schedule.find(s => s.weekdaySlot === slot);
            const isToday = slot === todaySlot;
            const isTraining = sched && sched.focus !== 'recovery';
            const isDone = !!program.completedDays[`W${currentWeek}D${sched?.dayIndex}`];
            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: isToday ? T.accent : T.muted }}>{day}</p>
                <div onClick={() => isTraining && toggleDay(currentWeek, sched.dayIndex, slot)}
                  style={{
                    width: '100%', borderRadius: 12, paddingTop: 10, paddingBottom: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: isTraining ? 'pointer' : 'default', transition: 'all 0.15s',
                    background: isTraining ? (isDone ? 'rgba(34,197,94,0.12)' : isToday ? T.accentDim : T.surfaceLo) : T.surfaceLo,
                    border: `1.5px solid ${isTraining ? (isDone ? 'rgba(34,197,94,0.3)' : isToday ? T.accentBorder : T.outline) : T.outline}`,
                  }}>
                  {isTraining ? (
                    isDone
                      ? <Check size={14} style={{ color: '#22c55e' }} />
                      : <div style={{ width: 8, height: 8, borderRadius: '50%', background: deload ? '#475569' : accentColor }} />
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.surfaceHi }} />
                  )}
                </div>
                {isTraining && (
                  <p style={{ fontSize: 7, textAlign: 'center', lineHeight: 1.2, fontWeight: 700, color: isDone ? '#22c55e' : isToday ? T.accent : T.muted }}>
                    {sched.label.split(' ')[0]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's workout */}
      {(() => {
        const todaySchedule = program.schedule.find(s => s.weekdaySlot === todaySlot);
        const isTrainingToday = todaySchedule && todaySchedule.focus !== 'recovery';
        if (!isTrainingToday) return (
          <div style={card({ padding: '16px' })}>
            <p style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 4 }}>Bugün — Dinlenme Günü</p>
            <p style={{ fontSize: 12, color: T.muted }}>Kaslara toparlanma zamanı. Hafif yürüyüş veya mobilite yeterli.</p>
          </div>
        );
        const isDone = !!program.completedDays[`W${currentWeek}D${todaySchedule.dayIndex}`];
        return (
          <div style={{ borderRadius: 20, padding: '18px 16px', background: `${accentColor}10`, border: `1px solid ${accentColor}30` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Lexend, sans-serif' }}>Bugünün Antrenmanı</p>
              {deload && <span style={{ fontSize: 9, color: T.muted, border: `1px solid ${T.outline}`, padding: '2px 8px', borderRadius: 99 }}>Deload — Hafif tut</span>}
            </div>
            <p style={{ fontSize: 18, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 14 }}>{todaySchedule.label}</p>
            {isDone ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e' }}>
                <Check size={16} /><span style={{ fontSize: 13, fontWeight: 800 }}>Tamamlandı!</span>
              </div>
            ) : (
              <button onClick={() => handleStartDay(todaySchedule.focus)}
                style={{
                  width: '100%', padding: '13px 0', borderRadius: 14, border: 'none',
                  background: accentColor, color: '#0C0E11', fontWeight: 900, fontSize: 13,
                  fontFamily: 'Lexend, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                <Play size={14} fill="#0C0E11" /> Antrenmanı Başlat
              </button>
            )}
          </div>
        );
      })()}

      {/* Phase timeline */}
      <div style={card({ padding: '14px 12px' })}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Program Fazları</p>
        <div style={{ display: 'flex', gap: 4 }}>
          {program.phases.map(p => (
            <div key={p.name} style={{
              flex: p.endWeek - p.startWeek + 1, borderRadius: 10, padding: '8px 4px', textAlign: 'center',
              background: `${p.color}15`, border: `1px solid ${p.color}30`,
              opacity: currentWeek >= p.startWeek && currentWeek <= p.endWeek ? 1 : 0.45,
            }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: p.color }}>{p.name}</p>
              <p style={{ fontSize: 7, color: T.muted }}>H{p.startWeek}{p.endWeek > p.startWeek ? `–${p.endWeek}` : ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      {program.schedule.filter(s => s.weekdaySlot > todaySlot && s.focus !== 'recovery').length > 0 && (
        <div style={card({ padding: '14px 16px' })}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Bu Haftanın Geri Kalanı</p>
          {program.schedule.filter(s => s.weekdaySlot > todaySlot && s.focus !== 'recovery').slice(0, 3).map(s => (
            <div key={s.dayIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.outline}` }}>
              <span style={{ fontSize: 12, color: T.muted }}>{WEEKDAY_LABELS[s.weekdaySlot - 1]}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const ProgramTab = ({ darkMode, program, setProgram, setConfig, setActiveTab, toast, setConfirmState }) => {
  const handleCreate = (newProgram) => {
    if (!newProgram) return;
    setProgram(newProgram);
    localStorage.setItem('arete_program', JSON.stringify(newProgram));
    toast.success('Program oluşturuldu!');
  };
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>
      <div style={{ padding: '24px 16px 8px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.accent, fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em' }}>PROGRAM</h2>
        {!program && <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Sana özel periodizasyon programı oluştur.</p>}
      </div>
      {!program
        ? <ProgramWizard darkMode={darkMode} onCreate={handleCreate} />
        : <ActiveProgramView program={program} setProgram={setProgram} darkMode={darkMode} setConfig={setConfig} setActiveTab={setActiveTab} toast={toast} setConfirmState={setConfirmState} />
      }
    </div>
  );
};

export default ProgramTab;
