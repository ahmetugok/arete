// src/components/ProgramTab.js
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Play, Trash2, Zap, BicepsFlexed, Target, Heart } from 'lucide-react';

// ─── PROGRAM TEMPLATES ───────────────────────────────────────────────────────
const PROGRAM_TEMPLATES = {
  hypertrophy: {
    label: 'Hipertrofi',
    subtitle: 'Kas kütlesi ve hacim',
    color: '#f59e0b',
    Icon: BicepsFlexed,
    description: 'GVT + Hanik kombinasyonu. Yüksek hacim, orta yoğunluk.',
    schedules: {
      3: [
        { weekdaySlot: 1, focus: 'gvt_push',  label: 'GVT Push'  },
        { weekdaySlot: 3, focus: 'gvt_legs',  label: 'GVT Legs'  },
        { weekdaySlot: 5, focus: 'aesthetics',label: 'Aesthetics' },
      ],
      4: [
        { weekdaySlot: 1, focus: 'hanik_push_legs', label: 'Push & Legs' },
        { weekdaySlot: 2, focus: 'hanik_pull_core', label: 'Pull & Core' },
        { weekdaySlot: 4, focus: 'gvt_legs',        label: 'GVT Legs'   },
        { weekdaySlot: 5, focus: 'aesthetics',       label: 'Aesthetics' },
      ],
      5: [
        { weekdaySlot: 1, focus: 'gvt_push',        label: 'GVT Push'   },
        { weekdaySlot: 2, focus: 'gvt_legs',         label: 'GVT Legs'   },
        { weekdaySlot: 3, focus: 'hanik_pull_core',  label: 'Pull & Core'},
        { weekdaySlot: 5, focus: 'aesthetics',        label: 'Aesthetics' },
        { weekdaySlot: 6, focus: 'fbb',               label: 'FBB'        },
      ],
    },
  },
  strength: {
    label: 'Güç',
    subtitle: 'Maksimum kuvvet gelişimi',
    color: '#ef4444',
    Icon: Zap,
    description: 'GVT + OVT sistemi. Ağır yükler, düşük tekrar.',
    schedules: {
      3: [
        { weekdaySlot: 1, focus: 'gvt_push', label: 'GVT Push'  },
        { weekdaySlot: 3, focus: 'gvt_legs', label: 'GVT Legs'  },
        { weekdaySlot: 5, focus: 'ovt',      label: 'OVT Power' },
      ],
      4: [
        { weekdaySlot: 1, focus: 'gvt_push',  label: 'GVT Push'  },
        { weekdaySlot: 2, focus: 'gvt_legs',  label: 'GVT Legs'  },
        { weekdaySlot: 4, focus: 'ovt',       label: 'OVT Upper' },
        { weekdaySlot: 5, focus: 'ovt_pull',  label: 'OVT Lower' },
      ],
      5: [
        { weekdaySlot: 1, focus: 'gvt_push',  label: 'GVT Push'  },
        { weekdaySlot: 2, focus: 'gvt_legs',  label: 'GVT Legs'  },
        { weekdaySlot: 3, focus: 'gvt_pull',  label: 'GVT Pull'  },
        { weekdaySlot: 5, focus: 'ovt',       label: 'OVT Power' },
        { weekdaySlot: 6, focus: 'prime',     label: 'Prime'     },
      ],
    },
  },
  athleticism: {
    label: 'Atletizm',
    subtitle: 'Patlayıcılık ve kondisyon',
    color: '#60a5fa',
    Icon: Target,
    description: 'Prime + Hanik + Engine. Güç, hız ve dayanıklılık.',
    schedules: {
      3: [
        { weekdaySlot: 1, focus: 'prime',  label: 'Prime'   },
        { weekdaySlot: 3, focus: 'engine', label: 'Engine'  },
        { weekdaySlot: 5, focus: 'hybrid', label: 'Hybrid'  },
      ],
      4: [
        { weekdaySlot: 1, focus: 'prime',           label: 'Prime'       },
        { weekdaySlot: 2, focus: 'hanik_pull_core', label: 'Pull & Core' },
        { weekdaySlot: 4, focus: 'engine',          label: 'Engine'      },
        { weekdaySlot: 5, focus: 'hanik_push_legs', label: 'Push & Legs' },
      ],
      5: [
        { weekdaySlot: 1, focus: 'prime',           label: 'Prime'       },
        { weekdaySlot: 2, focus: 'hanik_pull_core', label: 'Pull & Core' },
        { weekdaySlot: 3, focus: 'engine',          label: 'Engine'      },
        { weekdaySlot: 5, focus: 'hanik_push_legs', label: 'Push & Legs' },
        { weekdaySlot: 6, focus: 'fbb',             label: 'FBB'         },
      ],
    },
  },
  general: {
    label: 'Genel Kondisyon',
    subtitle: 'Dengeli ve sürdürülebilir',
    color: '#22c55e',
    Icon: Heart,
    description: 'FBB + Engine + Hybrid. Her yeteneği dengeli geliştirir.',
    schedules: {
      3: [
        { weekdaySlot: 1, focus: 'fbb',    label: 'FBB Full Body' },
        { weekdaySlot: 3, focus: 'engine', label: 'Engine'        },
        { weekdaySlot: 5, focus: 'hybrid', label: 'Hybrid'        },
      ],
      4: [
        { weekdaySlot: 1, focus: 'fbb',              label: 'FBB'         },
        { weekdaySlot: 2, focus: 'engine',            label: 'Engine'      },
        { weekdaySlot: 4, focus: 'hanik_push_legs',  label: 'Push & Legs' },
        { weekdaySlot: 5, focus: 'hanik_pull_core',  label: 'Pull & Core' },
      ],
      5: [
        { weekdaySlot: 1, focus: 'fbb',             label: 'FBB'         },
        { weekdaySlot: 2, focus: 'engine',           label: 'Engine'      },
        { weekdaySlot: 3, focus: 'hanik_push_legs', label: 'Push & Legs' },
        { weekdaySlot: 5, focus: 'hanik_pull_core', label: 'Pull & Core' },
        { weekdaySlot: 6, focus: 'hybrid',           label: 'Hybrid'      },
      ],
    },
  },
};

// ─── PHASE MAPS ───────────────────────────────────────────────────────────────
const buildPhases = (goal, totalWeeks) => {
  if (totalWeeks === 4) return [
    { name: 'Adaptasyon', startWeek: 1, endWeek: 1, color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 2, endWeek: 3, color: '#f59e0b' },
    { name: 'Tepe',       startWeek: 4, endWeek: 4, color: '#ef4444' },
  ];
  if (totalWeeks === 8) return [
    { name: 'Adaptasyon', startWeek: 1, endWeek: 2, color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 3, endWeek: 5, color: '#f59e0b' },
    { name: 'Yoğunluk',  startWeek: 6, endWeek: 7, color: '#f97316' },
    { name: 'Tepe',       startWeek: 8, endWeek: 8, color: '#ef4444' },
  ];
  // 12 weeks
  return [
    { name: 'Adaptasyon', startWeek: 1,  endWeek: 3,  color: '#60a5fa' },
    { name: 'Hacim',      startWeek: 4,  endWeek: 7,  color: '#f59e0b' },
    { name: 'Yoğunluk',  startWeek: 8,  endWeek: 10, color: '#f97316' },
    { name: 'Tepe',       startWeek: 11, endWeek: 11, color: '#ef4444' },
    { name: 'Deload',     startWeek: 12, endWeek: 12, color: '#64748b' },
  ];
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getCurrentWeek = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - start) / 86400000);
  return Math.max(1, Math.floor(diffDays / 7) + 1);
};

const isDeloadWeek = (weekNum) => weekNum % 4 === 0;

const getPhaseForWeek = (phases, weekNum) =>
  phases.find(p => weekNum >= p.startWeek && weekNum <= p.endWeek) || phases[phases.length - 1];

const getTodaySlot = () => {
  // Returns 1=Mon ... 7=Sun
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 7 : d;
};

const WEEKDAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const buildProgram = ({ goal, totalWeeks, daysPerWeek }) => {
  const template = PROGRAM_TEMPLATES[goal];
  const scheduleTemplate = template.schedules[daysPerWeek];
  const phases = buildPhases(goal, totalWeeks);
  const schedule = scheduleTemplate.map((s, i) => ({
    dayIndex: i,
    weekdaySlot: s.weekdaySlot,
    focus: s.focus,
    label: s.label,
  }));
  return {
    id: Date.now(),
    goal,
    totalWeeks,
    daysPerWeek,
    startDate: new Date().toISOString().split('T')[0],
    completedDays: {},
    phases,
    schedule,
  };
};

// ─── WIZARD ──────────────────────────────────────────────────────────────────
const ProgramWizard = ({ darkMode, onCreate }) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [totalWeeks, setTotalWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-slate-200' : 'text-gray-800';
  const sub  = darkMode ? 'text-slate-500' : 'text-gray-400';

  const selectedTemplate = goal ? PROGRAM_TEMPLATES[goal] : null;
  const hasSchedule = selectedTemplate?.schedules?.[daysPerWeek];

  const handleCreate = () => {
    if (!goal || !hasSchedule) return;
    onCreate(buildProgram({ goal, totalWeeks, daysPerWeek }));
  };

  // Step 0 — Goal
  if (step === 0) return (
    <div className="px-4 py-6">
      <h3 className={`text-lg font-black tracking-wider mb-1 ${text}`}>Hedefinizi Seçin</h3>
      <p className={`text-xs mb-5 ${sub}`}>Program buna göre oluşturulacak.</p>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PROGRAM_TEMPLATES).map(([key, t]) => (
          <button key={key} onClick={() => { setGoal(key); setStep(1); }}
            className={`rounded-2xl border p-4 text-left transition-all active:scale-95 ${card}`}
            style={{ borderColor: goal === key ? t.color : undefined }}>
            <t.Icon size={24} style={{ color: t.color, marginBottom: 8 }} />
            <p className={`text-sm font-bold ${text}`}>{t.label}</p>
            <p className={`text-[10px] mt-0.5 ${sub}`}>{t.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 1 — Duration + Days
  if (step === 1) return (
    <div className="px-4 py-6">
      <button onClick={() => setStep(0)} className={`flex items-center gap-1 text-xs mb-5 ${sub}`}>
        <ChevronLeft size={14} /> Geri
      </button>
      <h3 className={`text-lg font-black tracking-wider mb-1 ${text}`}>Program Süresi</h3>
      <p className={`text-xs mb-5 ${sub}`}>Kaç hafta ve kaç gün?</p>

      <div className="space-y-5">
        <div>
          <p className={`text-xs font-bold mb-2 ${sub} uppercase tracking-wider`}>Toplam Süre</p>
          <div className="flex gap-2">
            {[4, 8, 12].map(w => (
              <button key={w} onClick={() => setTotalWeeks(w)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all
                  ${totalWeeks === w ? 'bg-amber-500 text-slate-900 border-amber-500' : `${card} ${text}`}`}>
                {w} Hafta
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={`text-xs font-bold mb-2 ${sub} uppercase tracking-wider`}>Haftada Kaç Gün</p>
          <div className="flex gap-2">
            {[3, 4, 5].map(d => {
              const available = !!PROGRAM_TEMPLATES[goal]?.schedules?.[d];
              return (
                <button key={d} onClick={() => available && setDaysPerWeek(d)}
                  disabled={!available}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all
                    ${!available ? 'opacity-30 cursor-not-allowed' : ''}
                    ${daysPerWeek === d && available ? 'bg-amber-500 text-slate-900 border-amber-500' : `${card} ${text}`}`}>
                  {d} Gün
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={() => setStep(2)}
          disabled={!hasSchedule}
          className="w-full py-4 rounded-2xl bg-amber-500 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          Önizlemeye Geç <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  // Step 2 — Preview
  const preview = buildProgram({ goal, totalWeeks, daysPerWeek });
  const phases = buildPhases(goal, totalWeeks);
  const tmpl = PROGRAM_TEMPLATES[goal];

  return (
    <div className="px-4 py-6">
      <button onClick={() => setStep(1)} className={`flex items-center gap-1 text-xs mb-5 ${sub}`}>
        <ChevronLeft size={14} /> Geri
      </button>
      <h3 className={`text-lg font-black tracking-wider mb-1 ${text}`}>Program Özeti</h3>
      <p className={`text-xs mb-4 ${sub}`}>{tmpl.description}</p>

      {/* Weekly structure preview */}
      <div className={`rounded-2xl border p-3 mb-4 ${card}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${sub}`}>Haftalık Yapı</p>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((day, i) => {
            const slot = i + 1;
            const sched = preview.schedule.find(s => s.weekdaySlot === slot);
            return (
              <div key={day} className="text-center">
                <p className={`text-[8px] font-bold mb-1 ${sub}`}>{day}</p>
                <div className={`rounded-lg py-2 px-0.5 ${sched
                  ? 'bg-amber-500/15 border border-amber-500/30'
                  : darkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                  {sched
                    ? <p className="text-[7px] font-bold text-amber-500 leading-tight">{sched.label.split(' ').slice(0, 2).join(' ')}</p>
                    : <p className={`text-[7px] ${sub}`}>—</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase timeline */}
      <div className={`rounded-2xl border p-3 mb-5 ${card}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${sub}`}>Fazlar</p>
        <div className="flex gap-1">
          {phases.map(p => (
            <div key={p.name}
              className="rounded-lg px-2 py-2 text-center"
              style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, flex: p.endWeek - p.startWeek + 1 }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: p.color }}>{p.name}</p>
              <p style={{ fontSize: 7, color: '#64748b' }}>H{p.startWeek}{p.endWeek > p.startWeek ? `–${p.endWeek}` : ''}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleCreate}
        className="w-full py-4 rounded-2xl text-slate-900 font-bold text-sm flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${tmpl.color}, ${tmpl.color}cc)` }}>
        <Play size={16} /> Programı Başlat
      </button>
    </div>
  );
};

// ─── ACTIVE PROGRAM VIEW ──────────────────────────────────────────────────────
const ActiveProgramView = ({ program, setProgram, darkMode, setConfig, setActiveTab, toast, setConfirmState }) => {
  const currentWeek = Math.min(getCurrentWeek(program.startDate), program.totalWeeks);
  const isComplete  = getCurrentWeek(program.startDate) > program.totalWeeks;
  const phase       = getPhaseForWeek(program.phases, currentWeek);
  const deload      = isDeloadWeek(currentWeek);
  const tmpl        = PROGRAM_TEMPLATES[program.goal];
  const todaySlot   = getTodaySlot();

  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-slate-200' : 'text-gray-800';
  const sub  = darkMode ? 'text-slate-500' : 'text-gray-400';

  const toggleDay = (weekNum, dayIndex) => {
    const key = `W${weekNum}D${dayIndex}`;
    const updated = {
      ...program,
      completedDays: {
        ...program.completedDays,
        [key]: !program.completedDays[key],
      },
    };
    setProgram(updated);
    localStorage.setItem('arete_program', JSON.stringify(updated));
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
      variant: 'danger',
      confirmLabel: 'Sil',
      onConfirm: () => {
        setProgram(null);
        localStorage.removeItem('arete_program');
        toast.success('Program silindi.');
      },
    });
  };

  if (isComplete) return (
    <div className="px-4 py-10 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h3 className={`text-xl font-black mb-2 ${text}`}>Program Tamamlandı!</h3>
      <p className={`text-sm mb-6 ${sub}`}>{program.totalWeeks} haftalık {tmpl?.label} programını bitirdin.</p>
      <button onClick={handleDelete}
        className="w-full py-4 rounded-2xl bg-amber-500 text-slate-900 font-bold">
        Yeni Program Başlat
      </button>
    </div>
  );

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className={`rounded-2xl border p-4 ${card}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {tmpl && <tmpl.Icon size={16} style={{ color: tmpl.color }} />}
              <h3 className={`text-base font-black ${text}`}>{tmpl?.label || program.goal}</h3>
              {deload && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 uppercase">
                  Deload
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${phase.color}18`, color: phase.color }}>
                {phase.name}
              </span>
              <span className={`text-[10px] ${sub}`}>Hafta {currentWeek}/{program.totalWeeks}</span>
            </div>
          </div>
          <button onClick={handleDelete} className="text-slate-600 hover:text-red-400 p-1">
            <Trash2 size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className={`rounded-full overflow-hidden h-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${(currentWeek / program.totalWeeks) * 100}%`, background: tmpl?.color || '#f59e0b' }} />
        </div>
        <p className={`text-[9px] mt-1 text-right ${sub}`}>{Math.round((currentWeek / program.totalWeeks) * 100)}% tamamlandı</p>
      </div>

      {/* Weekly Calendar */}
      <div className={`rounded-2xl border p-3 ${card}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${sub}`}>
          Bu Hafta — Hafta {currentWeek}
        </p>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((day, i) => {
            const slot = i + 1;
            const sched = program.schedule.find(s => s.weekdaySlot === slot);
            const isToday = slot === todaySlot;
            const isDone = !!program.completedDays[`W${currentWeek}D${sched?.dayIndex}`];

            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <p className={`text-[8px] font-bold ${isToday ? 'text-amber-400' : sub}`}>{day}</p>
                <div
                  onClick={() => sched && toggleDay(currentWeek, sched.dayIndex)}
                  className={`w-full rounded-xl py-3 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${sched
                      ? isDone
                        ? 'bg-green-500/15 border border-green-500/30'
                        : isToday
                          ? 'border-2 border-amber-500/70 bg-amber-500/10'
                          : darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-gray-100 border border-gray-200'
                      : darkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                    }`}>
                  {sched ? (
                    isDone
                      ? <Check size={14} className="text-green-400" />
                      : <div className="w-2 h-2 rounded-full" style={{ background: deload ? '#64748b' : (tmpl?.color || '#f59e0b') }} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700/50" />
                  )}
                </div>
                {sched && (
                  <p className={`text-[7px] text-center leading-tight font-medium ${isDone ? 'text-green-400' : isToday ? 'text-amber-400' : sub}`}>
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
        if (!todaySchedule) return (
          <div className={`rounded-2xl border p-4 ${card}`}>
            <p className={`text-xs font-bold ${text}`}>Bugün — Dinlenme Günü</p>
            <p className={`text-xs mt-1 ${sub}`}>Kaslara toparlanma zamanı. Hafif yürüyüş veya mobilite yeterli.</p>
          </div>
        );
        const isDone = !!program.completedDays[`W${currentWeek}D${todaySchedule.dayIndex}`];
        return (
          <div className="rounded-2xl p-4 border"
            style={{ background: `${tmpl?.color || '#f59e0b'}0d`, borderColor: `${tmpl?.color || '#f59e0b'}30` }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold" style={{ color: tmpl?.color || '#f59e0b' }}>Bugünün Antrenmanı</p>
              {deload && <span className="text-[9px] text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">Deload — Hafif tut</span>}
            </div>
            <p className={`text-base font-black mb-3 ${text}`}>{todaySchedule.label}</p>
            {isDone ? (
              <div className="flex items-center gap-2 text-green-400">
                <Check size={16} />
                <span className="text-sm font-bold">Tamamlandı!</span>
              </div>
            ) : (
              <button onClick={() => handleStartDay(todaySchedule.focus)}
                className="w-full py-3 rounded-xl font-bold text-sm text-slate-900 flex items-center justify-center gap-2"
                style={{ background: tmpl?.color || '#f59e0b' }}>
                <Play size={15} /> Antrenmanı Başlat
              </button>
            )}
          </div>
        );
      })()}

      {/* Phase timeline */}
      <div className={`rounded-2xl border p-3 ${card}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${sub}`}>Program Fazları</p>
        <div className="flex gap-1">
          {program.phases.map(p => (
            <div key={p.name}
              className="rounded-lg px-1 py-2 text-center"
              style={{
                flex: p.endWeek - p.startWeek + 1,
                background: `${p.color}15`,
                border: `1px solid ${p.color}30`,
                opacity: currentWeek >= p.startWeek && currentWeek <= p.endWeek ? 1 : 0.5,
              }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: p.color }}>{p.name}</p>
              <p style={{ fontSize: 7, color: '#64748b' }}>
                H{p.startWeek}{p.endWeek > p.startWeek ? `–${p.endWeek}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming days */}
      <div className={`rounded-2xl border p-3 ${card}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${sub}`}>Bu Haftanın Geri Kalanı</p>
        {program.schedule
          .filter(s => s.weekdaySlot > todaySlot)
          .slice(0, 3)
          .map(s => (
            <div key={s.dayIndex} className={`flex justify-between items-center py-2 border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <span className={`text-xs ${text}`}>{WEEKDAY_LABELS[s.weekdaySlot - 1]}</span>
              <span className="text-xs font-bold" style={{ color: tmpl?.color || '#f59e0b' }}>{s.label}</span>
            </div>
          ))}
        {program.schedule.filter(s => s.weekdaySlot > todaySlot).length === 0 && (
          <p className={`text-xs ${sub}`}>Bu haftanın antrenmanları bitti!</p>
        )}
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const ProgramTab = ({ darkMode, program, setProgram, setConfig, setActiveTab, toast, setConfirmState }) => {
  const handleCreate = (newProgram) => {
    setProgram(newProgram);
    localStorage.setItem('arete_program', JSON.stringify(newProgram));
    toast.success('Program oluşturuldu!');
  };

  if (!program) return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="px-4 pt-6 pb-2">
        <h2 className={`text-xl font-black tracking-widest ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
          PROGRAM
        </h2>
        <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Sana özel periodizasyon programı oluştur.
        </p>
      </div>
      <ProgramWizard darkMode={darkMode} onCreate={handleCreate} />
    </div>
  );

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="px-4 pt-6 pb-2">
        <h2 className={`text-xl font-black tracking-widest ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
          PROGRAM
        </h2>
      </div>
      <ActiveProgramView
        program={program}
        setProgram={setProgram}
        darkMode={darkMode}
        setConfig={setConfig}
        setActiveTab={setActiveTab}
        toast={toast}
        setConfirmState={setConfirmState}
      />
    </div>
  );
};

export default ProgramTab;
