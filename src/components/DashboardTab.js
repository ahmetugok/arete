// src/components/DashboardTab.js
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Play, Droplets, Plus, Minus, TrendingUp, Zap, Flame, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  surface:    '#161A1D',
  surfaceLo:  '#111417',
  surfaceHi:  '#1E2226',
  accent:     '#D1FF26',
  accentDim:  'rgba(209,255,38,0.12)',
  accentBorder:'rgba(209,255,38,0.22)',
  outline:    'rgba(255,255,255,0.06)',
  muted:      '#7A7C80',
  text:       '#F9F9FD',
};

const card = (extra = {}) => ({
  borderRadius: 20,
  background: T.surface,
  border: `1px solid ${T.outline}`,
  borderTop: '1px solid rgba(255,255,255,0.12)', // Üstten vuran ince ışık
  boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)',  // Zemin derinliği
  ...extra,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const getHistory = () => JSON.parse(localStorage.getItem('arete_history') || '[]');

const getWeeklyVolumeData = (history) => {
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const data = days.map(d => ({ day: d, volume: 0, active: false }));
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  history.filter(h => h.timestamp > oneWeekAgo).forEach(entry => {
    const d = new Date(entry.timestamp);
    const idx = d.getDay();
    const v = Object.values(entry.exercises || {}).reduce((acc, log) => {
      return acc + (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0);
    }, 0);
    data[idx].volume += Math.round(v);
    data[idx].active = true;
  });
  const todayIdx = new Date().getDay();
  data[todayIdx].isToday = true;
  return data;
};

const getStreak = (history) => {
  if (!history.length) return 0;
  const workoutDays = new Set(history.map(h => {
    const d = new Date(h.timestamp); d.setHours(0, 0, 0, 0); return d.getTime();
  }));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const yesterdayTs = todayTs - 86400000;
  if (!workoutDays.has(todayTs) && !workoutDays.has(yesterdayTs)) return 0;
  let streak = 0;
  let current = new Date(workoutDays.has(todayTs) ? todayTs : yesterdayTs);
  while (workoutDays.has(current.getTime())) { streak++; current = new Date(current.getTime() - 86400000); }
  return streak;
};

const getTodayGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi öğleden sonralar';
  return 'İyi akşamlar';
};

const getUserName = () => {
  try { return JSON.parse(localStorage.getItem('arete_config') || '{}').userName || null; } catch { return null; }
};

const getRecovery = () => {
  try {
    const s = localStorage.getItem('arete_recovery');
    if (s) { const p = JSON.parse(s); if (p.date === new Date().toDateString()) return p.readiness; }
  } catch (e) {}
  return null;
};

const focusLabelMap = {
  gvt: 'GVT Bacak', gvt_legs: 'GVT Bacak', gvt_push: 'GVT Push', gvt_pull: 'GVT Pull',
  ovt: 'OVT Güç', ovt_push: 'OVT Push', ovt_pull: 'OVT Pull',
  hanik_push_legs: 'Push & Legs', hanik_pull_core: 'Pull & Core',
  fbb: 'Fonksiyonel', engine: 'Engine MetCon', aesthetics: 'Estetik Split',
  hybrid: 'Hybrid', prime: 'Prime Athlete', recovery: 'Aktif Onarım', metcon: 'MetCon',
};

const getMuscleFreq = (history) => {
  const focusMap = {
    gvt: 'legs', gvt_legs: 'legs', gvt_push: 'push', gvt_pull: 'pull',
    ovt: 'push', ovt_push: 'push', ovt_pull: 'legs',
    hanik_push_legs: 'push', hanik_pull_core: 'pull',
    aesthetics: 'push', prime: 'push', hybrid: 'push',
    fbb: 'core', engine: 'cardio', metcon: 'cardio', recovery: 'core', strength: 'push',
  };
  const freq = { push: 0, pull: 0, legs: 0, core: 0, cardio: 0 };
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  history.filter(h => h.timestamp > oneWeekAgo).forEach(w => {
    const cat = focusMap[w.focus];
    if (cat) freq[cat]++;
  });
  return freq;
};

const getPRCount = (history) => {
  const prs = {};
  [...history].reverse().forEach(entry => {
    Object.entries(entry.exercises || {}).forEach(([name, log]) => {
      const w = parseFloat(log.weight) || 0;
      if (w > 0 && (!prs[name] || w > prs[name])) prs[name] = w;
    });
  });
  return Object.keys(prs).length;
};

const MUSCLE_META = [
  { key: 'push',   label: 'İtiş',     emoji: '💪' },
  { key: 'pull',   label: 'Çekiş',    emoji: '🏋️' },
  { key: 'legs',   label: 'Bacak',    emoji: '🦵' },
  { key: 'core',   label: 'Core',     emoji: '⚡' },
  { key: 'cardio', label: 'Kondisyon',emoji: '🔥' },
];


// ── Su Takibi ─────────────────────────────────────────────────────────────────
const WaterTracker = ({ darkMode }) => {
  const GOAL = 2500;
  const STEP = 250;
  const [amount, setAmount] = useState(() => {
    try {
      const s = localStorage.getItem('arete_water');
      if (s) { const p = JSON.parse(s); if (p.date === new Date().toDateString()) return p.amount; }
    } catch (e) {}
    return 0;
  });
  const save = useCallback((n) => {
    localStorage.setItem('arete_water', JSON.stringify({ date: new Date().toDateString(), amount: n }));
  }, []);
  const add = () => { const n = Math.min(amount + STEP, GOAL + STEP); setAmount(n); save(n); };
  const sub = () => { const n = Math.max(amount - STEP, 0); setAmount(n); save(n); };
  const pct = Math.min((amount / GOAL) * 100, 100);

  return (
    <div style={card({ padding: '18px 20px' })}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Droplets size={16} style={{ color: '#60a5fa' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif' }}>
            Daily Hydration
          </span>
        </div>
        <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>GOAL: {GOAL / 1000}L</span>
      </div>

      {/* Big value */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: T.accent, fontFamily: 'Lexend, sans-serif', lineHeight: 1 }}>
          {amount >= 1000 ? `${(amount / 1000).toFixed(1)}` : `${amount}`}
        </span>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.accent, marginLeft: 3 }}>
          {amount >= 1000 ? 'L' : 'ml'}
        </span>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{Math.round(pct)}% COMPLETED</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: T.surfaceHi, borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{
          height: '100%', borderRadius: 3, width: `${pct}%`,
          background: `linear-gradient(90deg, #3b82f6 0%, ${T.accent} 100%)`,
          boxShadow: pct > 0 ? `4px 0 12px ${T.accent}` : 'none', // Ucunda ışık hüzmesi
          transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Yayılı animasyon
        }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={sub} style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1px solid ${T.outline}`, background: 'transparent',
          color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Minus size={14} />
        </button>
        <button onClick={add} style={{
          width: 36, height: 36, borderRadius: 10,
          background: T.accentDim, border: `1px solid ${T.accentBorder}`,
          color: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

// ── Kahin Insight ─────────────────────────────────────────────────────────────
const callGemini = async (prompt, system) => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction: system || '' }),
    });
    const data = await res.json();
    return data.text || null;
  } catch (e) { return null; }
};

const KahinInsight = ({ workout, darkMode }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('arete_kahin_insight') || 'null');
      if (cached?.date === new Date().toDateString() && cached?.text) {
        setMsg(cached.text); setGenerated(true);
      }
    } catch (e) {}
  }, []);

  const generate = async () => {
    setLoading(true);
    const history = getHistory().slice(0, 5).map(h => ({
      name: h.workoutName, focus: h.focus, date: h.date,
      exerciseCount: Object.keys(h.exercises || {}).length,
    }));
    const recovery = getRecovery();
    const streak = getStreak(getHistory());
    const system = `Sen ARETE'nin AI koçu Kahin'sin. Türkçe, kısa (2-3 cümle), motive edici ve kişisel bir günlük insight yaz. Emoji kullanabilirsin.`;
    const userPrompt = `Bugün: ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}.\nStreak: ${streak} gün. Toparlanma: ${recovery ? `${recovery}/100` : 'bilinmiyor'}.\nSon antrenmalar: ${JSON.stringify(history)}.\nAktif mod: ${workout?.focus ? focusLabelMap[workout.focus] || workout.focus : 'seçilmemiş'}.\nKısa bir insight yaz.`;
    const response = await callGemini(userPrompt, system);
    if (response) {
      setMsg(response); setGenerated(true);
      localStorage.setItem('arete_kahin_insight', JSON.stringify({ date: new Date().toDateString(), text: response }));
    }
    setLoading(false);
  };

  return (
    <div style={{
      borderRadius: 20, padding: '16px 18px',
      background: 'linear-gradient(135deg, rgba(209,255,38,0.07), rgba(209,255,38,0.03))',
      border: `1px solid ${T.accentBorder}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, background: T.accentDim,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={11} style={{ color: T.accent }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'Lexend, sans-serif' }}>
          AI Pulse Insight
        </span>
        {generated && (
          <button onClick={() => { setGenerated(false); setMsg(null); generate(); }}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T.muted }}>
            <RefreshCw size={11} />
          </button>
        )}
      </div>
      {generated && msg ? (
        <p style={{ fontSize: 13, color: darkMode ? '#cbd5e1' : '#475569', lineHeight: 1.7 }}>{msg}</p>
      ) : (
        <button onClick={generate} disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: T.accent, fontWeight: 600, padding: 0,
        }}>
          {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {loading ? 'Kahin düşünüyor...' : 'Günlük insight al'}
        </button>
      )}
    </div>
  );
};

// ── Ana DashboardTab ──────────────────────────────────────────────────────────
const DashboardTab = ({
  darkMode, workout, config, setConfig,
  setActiveTab, workedOutToday, program, generateWorkout,
}) => {
  const [history, setHistory] = useState([]);
  useEffect(() => { setHistory(getHistory()); }, []);

  const greeting    = getTodayGreeting();
  const userName    = getUserName();
  const streak      = getStreak(history);
  const thisWeek    = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const weeklyData  = getWeeklyVolumeData(history);
  const recovery    = getRecovery();
  const recentWorkouts = history.slice(0, 3);
  const todaySlot   = (() => { const d = new Date().getDay(); return d === 0 ? 7 : d; })();
  const todayProgram = program?.schedule?.find(s => s.weekdaySlot === todaySlot);
  const muscleFreq  = getMuscleFreq(history);
  const prCount     = getPRCount(history);
  const totalVol    = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
    .reduce((sum, entry) => sum + Object.values(entry.exercises || {}).reduce((a, l) => a + (parseFloat(l.weight)||0)*(parseInt(l.reps)||0), 0), 0);
  const maxFreq     = Math.max(...Object.values(muscleFreq), 1);

  return (
    <div style={{ paddingBottom: 96 }}>

      {/* ── HEADER ── */}
      <div style={{ padding: '24px 20px 8px' }}>
        <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 4, letterSpacing: '0.04em' }}>
          {greeting}
        </p>
        <h1 style={{
          fontSize: 32, fontWeight: 900,
          color: T.text,
          fontFamily: 'Lexend, sans-serif',
          letterSpacing: '-0.03em', lineHeight: 1.1,
          marginBottom: 6,
        }}>
          {userName ? `Merhaba, ${userName}!` : 'ARETE'}
        </h1>
        <p style={{ fontSize: 12, color: T.muted }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── STAT CHIPS ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'GÜN SERİ', value: streak, color: streak >= 7 ? '#ef4444' : T.accent, icon: Flame },
            { label: 'BU HAFTA', value: thisWeek, color: '#60a5fa', icon: Zap },
            { label: 'HAZIRLIK', value: recovery ? `${recovery}%` : '—', color: recovery >= 70 ? '#22c55e' : recovery >= 40 ? T.accent : '#ef4444', icon: TrendingUp },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, borderRadius: 18, padding: '14px 10px', textAlign: 'center',
              background: T.surface, border: `1px solid ${T.outline}`,
            }}>
              <stat.icon size={14} style={{ color: stat.color, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, fontFamily: 'Lexend, sans-serif', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 8, color: T.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── KAHİN INSIGHT ── */}
        <KahinInsight workout={workout} darkMode={darkMode} />

        {/* ── BUGÜNKÜ ANTRENMAN ── */}
        {workedOutToday ? (
          /* ─ TAMAMLANDI ─ */
          <div style={card({
            padding: '20px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03))',
            border: '1px solid rgba(34,197,94,0.2)',
          })}>
            <div style={{
              position: 'absolute', top: 8, right: -8,
              fontSize: 52, fontWeight: 900, fontFamily: 'Lexend, sans-serif',
              color: 'rgba(34,197,94,0.06)', letterSpacing: '-0.04em', lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none',
            }}>DONE</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: todayProgram ? 14 : 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>✅</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', fontFamily: 'Lexend, sans-serif' }}>Bugün Tamamlandı!</p>
                <p style={{ fontSize: 11, color: T.muted }}>Harika iş. Dinlenme zamanı.</p>
              </div>
            </div>

            {todayProgram && (
              <div style={{ borderTop: '1px solid rgba(34,197,94,0.15)', paddingTop: 12, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 9, color: '#22c55e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>PROGRAM MODÜLÜ</p>
                  <p style={{ fontSize: 14, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em' }}>{todayProgram.label}</p>
                  <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{focusLabelMap[todayProgram.focus] || todayProgram.focus}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 900, padding: '5px 12px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>✓ Tamamlandı</span>
              </div>
            )}
          </div>

        ) : program && !todayProgram ? (
          /* ─ DİNLENME GÜNÜ (aktif program var ama bugün antrenman yok) ─ */
          <div style={card({
            padding: '20px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(96,165,250,0.02))',
            border: '1px solid rgba(96,165,250,0.18)',
          })}>
            <div style={{
              position: 'absolute', top: 8, right: -8,
              fontSize: 52, fontWeight: 900, fontFamily: 'Lexend, sans-serif',
              color: 'rgba(96,165,250,0.06)', letterSpacing: '-0.04em', lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none',
            }}>REST</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>🌙</span>
              </div>
              <div>
                <p style={{ fontSize: 9, color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>
                  {program?.title || 'AKTİF PROGRAM'}
                </p>
                <p style={{ fontSize: 14, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif' }}>Bugün Dinlenme Günü</p>
                <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Programda bugün antrenman yok. Kaslara yan gel 💤</p>
              </div>
            </div>
          </div>

        ) : workout ? (
          /* ─ ANTRENMAN OLUŞTURULMUŞ ─ */
          <div style={{
            borderRadius: 22, overflow: 'hidden',
            background: 'linear-gradient(140deg, #1A1F14 0%, #161A1D 60%, #0C0E11 100%)',
            border: '1px solid rgba(209,255,38,0.18)',
            padding: '20px', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 10, right: 8,
              fontSize: 52, fontWeight: 900, fontFamily: 'Lexend, sans-serif',
              color: 'rgba(209,255,38,0.06)', letterSpacing: '-0.04em', lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none',
            }}>
              {(focusLabelMap[workout?.focus] || 'FOCUS').toUpperCase().split(' ')[0]}
            </div>

            <div style={{ marginBottom: 14 }}>
              {todayProgram ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, fontWeight: 900, background: 'rgba(209,255,38,0.12)', color: T.accent, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.12em', border: '1px solid rgba(209,255,38,0.22)' }}>
                    {program?.title || 'PROGRAM'}
                  </span>
                </div>
              ) : (
                <p style={{ fontSize: 9, color: T.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8, fontFamily: 'Lexend, sans-serif' }}>
                  BUGÜNKÜ ODAK
                </p>
              )}
              <h2 style={{ fontSize: 28, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
                {todayProgram ? todayProgram.label : (workout.name.split('//').pop()?.trim() || workout.name)}
              </h2>
              <p style={{ fontSize: 11, color: T.muted }}>
                {workout.duration} Dakika · {focusLabelMap[workout.focus] || workout.focus}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setActiveTab('workout')}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 14,
                  background: T.accent, color: '#0C0E11',
                  fontWeight: 900, fontSize: 13, fontFamily: 'Lexend, sans-serif',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 0 24px rgba(209,255,38,0.25), inset 0 1px 1px rgba(255,255,255,0.6)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}>
                <Play size={14} fill="#0C0E11" /> Antrenmana Git
              </button>
              <button onClick={() => generateWorkout()}
                style={{
                  padding: '13px 16px', borderRadius: 14,
                  background: T.surfaceHi, border: `1px solid ${T.outline}`,
                  color: T.muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

        ) : (
          /* ─ ANTRENMAN YOK, HENÜZ OLUŞTURULMADI ─ */
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            background: 'linear-gradient(140deg, #1A1F14 0%, #161A1D 60%, #0C0E11 100%)',
            border: '1px solid rgba(209,255,38,0.18)',
            padding: '24px 20px', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 10, right: -10,
              fontSize: 64, fontWeight: 900, fontFamily: 'Lexend, sans-serif',
              color: 'rgba(209,255,38,0.04)', letterSpacing: '-0.04em', lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none',
            }}>
              {todayProgram ? 'GÖREV' : 'ODAK'}
            </div>

            <div style={{ marginBottom: 20, position: 'relative', zIndex: 10 }}>
              {todayProgram ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 9, fontWeight: 900, background: 'rgba(209,255,38,0.12)', color: T.accent, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.12em', border: '1px solid rgba(209,255,38,0.22)' }}>
                      PROGRAM GÜNÜ
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {program?.title || 'ARETE SİSTEMİ'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, color: T.text, fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
                    {todayProgram.label}
                  </h2>
                  <p style={{ fontSize: 12, color: T.muted }}>
                    Bugünün modülü: <strong style={{ color: T.text }}>{focusLabelMap[todayProgram.focus] || todayProgram.focus}</strong>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 10, color: T.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8, fontFamily: 'Lexend, sans-serif' }}>
                    SERBEST ANTRENMAN
                  </p>
                  <h2 style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15, color: T.text }}>
                    Mod Seç & Başla
                  </h2>
                  <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                    Herhangi bir program seçili değil.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => {
                if (todayProgram) setConfig(prev => ({ ...prev, focus: todayProgram.focus }));
                generateWorkout();
                setActiveTab('workout');
              }}
              style={{
                width: '100%', padding: '15px 0', borderRadius: 16,
                background: T.accent, color: '#0C0E11',
                fontWeight: 900, fontSize: 14, fontFamily: 'Lexend, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 0 24px rgba(209,255,38,0.2), inset 0 1px 1px rgba(255,255,255,0.6)',
                position: 'relative', zIndex: 10,
              }}>
              <Zap size={16} fill="#0C0E11" />
              {todayProgram ? 'GÖREVİ BAŞLAT' : 'ANTRENMAN OLUŞTUR'}
            </button>
          </div>
        )}
        {/* ── HAFTALIK GELİŞİM ── */}
        <div style={card({ padding: '18px 20px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif' }}>Haftalık Gelişim</p>
              <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Aktif kalori trendi</p>
            </div>
            <button onClick={() => setActiveTab('stats')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, color: T.accent,
                background: T.accentDim, border: `1px solid ${T.accentBorder}`,
                padding: '4px 10px', borderRadius: 99, cursor: 'pointer',
              }}>
              +{thisWeek > 0 ? Math.round(thisWeek * 12) : 0}% Artış
            </button>
          </div>
          {weeklyData.some(d => d.volume > 0) ? (
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: T.muted }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: '#1E2226', border: `1px solid ${T.outline}`, borderRadius: 10, fontSize: 10 }}
                  formatter={(v) => [`${v > 1000 ? `${(v / 1000).toFixed(1)}t` : `${v}kg`}`, 'Hacim']}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isToday ? T.accent : entry.active ? 'rgba(209,255,38,0.35)' : T.surfaceHi}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: T.muted }}>
              <p style={{ fontSize: 11 }}>Bu hafta henüz antrenman yok</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 9, color: T.muted }}>
              {weeklyData.map(d => d.isToday ? d.day : '').filter(Boolean)[0] || ''} · {thisWeek} antrenman
            </span>
            {streak > 0 && (
              <span style={{ fontSize: 9, color: T.accent, fontWeight: 700 }}>🔥 {streak} günlük seri</span>
            )}
          </div>
        </div>

        {/* ── KAS DENGESİ ── */}
        <div style={card({ padding: '18px 20px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif' }}>Kas Dengesi</p>
              <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>Bu hafta · kas grubu frekansı</p>
            </div>
            <span style={{ fontSize: 9, color: T.muted, background: T.surfaceHi, padding: '3px 8px', borderRadius: 99 }}>Haftalık</span>
          </div>
          {Object.values(muscleFreq).every(v => v === 0) ? (
            <p style={{ fontSize: 11, color: T.muted, textAlign: 'center', padding: '12px 0' }}>Bu hafta antrenman kaydı yok</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MUSCLE_META.map(({ key, label, emoji }) => {
                const freq = muscleFreq[key];
                const pct  = (freq / maxFreq) * 100;
                const isLow = freq <= 1 && maxFreq > 1;
                const barColor = isLow ? '#ef4444' : T.accent;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, width: 20, flexShrink: 0 }}>{emoji}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: isLow ? '#ef4444' : T.text,
                      width: 56, flexShrink: 0,
                    }}>{label}</span>
                    <div style={{ flex: 1, height: 6, background: T.surfaceHi, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: freq === 0 ? '2px' : `${pct}%`,
                        background: freq === 0 ? T.surfaceHi : barColor,
                        transition: 'width 0.5s',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: freq === 0 ? T.muted : isLow ? '#ef4444' : T.accent,
                      fontFamily: 'Lexend, sans-serif', width: 22, textAlign: 'right',
                    }}>{freq}×</span>
                    {isLow && (
                      <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700 }}>↑</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PERFORMANS ÖZETİ — STATS'A BAĞLI ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Toplam PR', value: prCount, unit: 'rekor', color: T.accent },
            { label: 'Toplam Antrenman', value: history.length, unit: 'seans', color: '#60a5fa' },
            { label: 'Haftalık Hacim', value: totalVol >= 1000 ? `${(totalVol/1000).toFixed(1)}t` : `${Math.round(totalVol)}kg`, unit: '', color: '#f97316' },
          ].map(stat => (
            <button key={stat.label} onClick={() => setActiveTab('stats')}
              style={{
                flex: 1, ...card({ padding: '12px 8px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${T.outline}` }),
                background: T.surfaceLo, transition: 'all 0.15s',
              }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, fontFamily: 'Lexend, sans-serif', lineHeight: 1 }}>
                {stat.value}
              </div>
              {stat.unit && <div style={{ fontSize: 8, color: T.muted, marginTop: 3 }}>{stat.unit}</div>}
              <div style={{ fontSize: 8, color: T.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>
                {stat.label}
              </div>
            </button>
          ))}
        </div>

        {/* ── SU TAKİBİ ── */}
        <WaterTracker darkMode={darkMode} />

        {/* ── SON ANTRENMALAR ── */}
        {recentWorkouts.length > 0 && (
          <div style={card({ padding: '18px 20px' })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif' }}>Geçmiş Antrenmalar</p>
              <button onClick={() => setActiveTab('workout')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700,
                  color: T.accent, background: 'none', border: 'none', cursor: 'pointer',
                }}>
                TÜMÜNÜ GÖR <ChevronRight size={11} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentWorkouts.map((entry) => {
                const logCount = Object.keys(entry.exercises || {}).length;
                const volume = Object.values(entry.exercises || {}).reduce((acc, log) => {
                  return acc + (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0);
                }, 0);
                const isToday = new Date(entry.timestamp).toDateString() === new Date().toDateString();
                const focusLabel = focusLabelMap[entry.focus] || entry.focus || '';
                return (
                  <div key={entry.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', borderRadius: 14,
                    background: T.surfaceLo,
                    border: `1px solid ${isToday ? T.accentBorder : T.outline}`,
                  }}>
                    {/* Left: icon + info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: T.surfaceHi,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Zap size={14} style={{ color: T.accent }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: 12, fontWeight: 800, color: T.text,
                          fontFamily: 'Lexend, sans-serif',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {entry.workoutName?.split('//').pop()?.trim() || entry.workoutName}
                        </p>
                        <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                          {isToday ? 'Bugün' : entry.date?.split(' ').slice(0, 3).join(' ')}
                          {logCount > 0 && ` · ${logCount} kayıt`}
                        </p>
                      </div>
                    </div>
                    {/* Right: volume + badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 8, flexShrink: 0 }}>
                      {focusLabel && (
                        <span style={{
                          fontSize: 8, fontWeight: 700, color: T.accent,
                          background: T.accentDim, border: `1px solid ${T.accentBorder}`,
                          padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                        }}>
                          {focusLabel}
                        </span>
                      )}
                      {volume > 0 && (
                        <p style={{ fontSize: 12, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif' }}>
                          {volume >= 1000 ? `${(volume / 1000).toFixed(1)}t` : `${Math.round(volume)}kg`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardTab;
