// src/components/DashboardTab.js
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Play, Droplets, Plus, Minus, TrendingUp, Calendar, Zap, Flame, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getHistory = () => JSON.parse(localStorage.getItem('arete_history') || '[]');

const getWeeklyVolumeData = (history) => {
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const data = days.map(d => ({ day: d, volume: 0, active: false }));
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  history.filter(h => h.timestamp > oneWeekAgo).forEach(entry => {
    const d = new Date(entry.timestamp);
    const idx = d.getDay(); // 0=Sun
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
    const d = new Date(h.timestamp);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const yesterdayTs = todayTs - 86400000;
  if (!workoutDays.has(todayTs) && !workoutDays.has(yesterdayTs)) return 0;
  let streak = 0;
  let current = new Date(workoutDays.has(todayTs) ? todayTs : yesterdayTs);
  while (workoutDays.has(current.getTime())) {
    streak++;
    current = new Date(current.getTime() - 86400000);
  }
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
    if (s) {
      const p = JSON.parse(s);
      if (p.date === new Date().toDateString()) return p.readiness;
    }
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

// ── Su Takibi ─────────────────────────────────────────────────────────────────
const WaterTracker = ({ darkMode }) => {
  const GOAL = 2500;
  const STEP = 250;

  const [amount, setAmount] = useState(() => {
    try {
      const s = localStorage.getItem('arete_water');
      if (s) {
        const p = JSON.parse(s);
        if (p.date === new Date().toDateString()) return p.amount;
      }
    } catch (e) {}
    return 0;
  });

  const save = useCallback((newAmount) => {
    localStorage.setItem('arete_water', JSON.stringify({ date: new Date().toDateString(), amount: newAmount }));
  }, []);

  const add = () => { const n = Math.min(amount + STEP, GOAL + STEP); setAmount(n); save(n); };
  const sub = () => { const n = Math.max(amount - STEP, 0); setAmount(n); save(n); };

  const pct = Math.min((amount / GOAL) * 100, 100);
  const glasses = Math.round(amount / 250);
  const color = pct >= 100 ? '#22c55e' : pct >= 60 ? '#60a5fa' : '#94a3b8';

  return (
    <div style={{
      borderRadius: 20, padding: '16px 18px',
      background: darkMode ? 'rgba(255,255,255,0.03)' : '#fff',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Droplets size={16} style={{ color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Günlük Su</span>
        </div>
        <span style={{ fontSize: 11, color: '#64748b' }}>Hedef: {GOAL / 1000}L</span>
      </div>

      <div style={{ height: 8, background: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${pct}%`,
          background: `linear-gradient(90deg, #3b82f6, ${color})`,
          transition: 'width 0.4s ease',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 24, fontWeight: 900, color, fontFamily: 'monospace' }}>
            {amount >= 1000 ? `${(amount / 1000).toFixed(1)}L` : `${amount}ml`}
          </span>
          <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6 }}>{glasses} bardak</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={sub} style={{
            width: 32, height: 32, borderRadius: 10, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            background: 'transparent', color: '#64748b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Minus size={14} />
          </button>
          <button onClick={add} style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#60a5fa', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Kahin Insight ─────────────────────────────────────────────────────────────
const callGemini = async (prompt, system) => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        setMsg(cached.text);
        setGenerated(true);
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
    const userPrompt = `Bugün: ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}.
Streak: ${streak} gün. Toparlanma: ${recovery ? `${recovery}/100` : 'bilinmiyor'}.
Son antrenmalar: ${JSON.stringify(history)}.
Aktif mod: ${workout?.focus ? focusLabelMap[workout.focus] || workout.focus : 'seçilmemiş'}.
Kısa bir insight yaz.`;

    const response = await callGemini(userPrompt, system);
    if (response) {
      setMsg(response);
      setGenerated(true);
      localStorage.setItem('arete_kahin_insight', JSON.stringify({ date: new Date().toDateString(), text: response }));
    }
    setLoading(false);
  };

  return (
    <div style={{
      borderRadius: 20, padding: '14px 16px',
      background: 'linear-gradient(135deg, rgba(146,64,14,0.2), rgba(245,158,11,0.08))',
      border: '1px solid rgba(245,158,11,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Sparkles size={14} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Kahin Insight
        </span>
        {generated && (
          <button onClick={() => { setGenerated(false); setMsg(null); generate(); }}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
            <RefreshCw size={11} />
          </button>
        )}
      </div>
      {generated && msg ? (
        <p style={{ fontSize: 13, color: darkMode ? '#cbd5e1' : '#475569', lineHeight: 1.65 }}>{msg}</p>
      ) : (
        <button onClick={generate} disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: '#f59e0b', fontWeight: 600, padding: 0,
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
  darkMode,
  workout,
  config,
  setConfig,
  setActiveTab,
  workedOutToday,
  program,
  generateWorkout,
}) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const greeting = getTodayGreeting();
  const userName = getUserName();
  const streak = getStreak(history);
  const thisWeek = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const weeklyData = getWeeklyVolumeData(history);
  const recovery = getRecovery();
  const recentWorkouts = history.slice(0, 3);

  const todaySlot = (() => { const d = new Date().getDay(); return d === 0 ? 7 : d; })();
  const todayProgram = program?.schedule?.find(s => s.weekdaySlot === todaySlot);

  const card = {
    borderRadius: 20,
    background: darkMode ? 'rgba(255,255,255,0.03)' : '#fff',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
    padding: '16px 18px',
  };

  return (
    <div style={{ paddingBottom: 96 }}>

      {/* ── HEADER ── */}
      <div style={{ padding: '20px 20px 12px' }}>
        <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>
          {greeting}
        </p>
        <h1 style={{
          fontSize: 28, fontWeight: 900,
          color: darkMode ? '#f1f5f9' : '#0f172a',
          letterSpacing: '-0.02em', lineHeight: 1.1,
          marginBottom: 4,
        }}>
          {userName ? `${userName}! 👋` : 'ARETE'}
        </h1>
        <p style={{ fontSize: 12, color: '#64748b' }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── STAT CHIPS ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { icon: Flame, value: streak, label: 'Gün seri', color: streak >= 7 ? '#ef4444' : '#f59e0b' },
            { icon: Zap, value: thisWeek, label: 'Bu hafta', color: '#60a5fa' },
            { icon: TrendingUp, value: recovery ? `${recovery}%` : '—', label: 'Hazırlık', color: recovery >= 70 ? '#22c55e' : recovery >= 40 ? '#f59e0b' : '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, borderRadius: 16, padding: '12px 10px', textAlign: 'center',
              background: darkMode ? 'rgba(255,255,255,0.03)' : '#fff',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0'}`,
            }}>
              <stat.icon size={14} style={{ color: stat.color, margin: '0 auto 4px' }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: stat.color, fontFamily: 'monospace', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 9, color: '#64748b', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── KAHİN INSIGHT ── */}
        <KahinInsight workout={workout} darkMode={darkMode} />

        {/* ── BUGÜNKÜ ANTRENMAN ── */}
        {workedOutToday ? (
          <div style={{
            ...card,
            background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.04))',
            border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>Bugün tamamlandı!</p>
                <p style={{ fontSize: 11, color: '#64748b' }}>Harika iş. Dinlenme zamanı.</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(146,64,14,0.3) 0%, rgba(245,158,11,0.15) 50%, rgba(15,23,42,0.8) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
            padding: '18px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                  {todayProgram ? 'Program Günü' : 'Bugünün Antrenmanı'}
                </p>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {workout
                    ? workout.name.split('//').pop()?.trim() || workout.name
                    : todayProgram
                      ? todayProgram.label
                      : 'Antrenman Oluştur'}
                </h2>
                {workout && (
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    {workout.duration} dk · {focusLabelMap[workout.focus] || workout.focus}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {workout ? (
                <button onClick={() => setActiveTab('workout')}
                  style={{
                    flex: 1, padding: '11px 0', borderRadius: 12,
                    background: 'linear-gradient(135deg, #92400e, #f59e0b)',
                    color: '#0f172a', fontWeight: 800, fontSize: 13,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <Play size={14} /> Antrenmana Git
                </button>
              ) : (
                <button onClick={() => {
                  if (todayProgram) setConfig(prev => ({ ...prev, focus: todayProgram.focus }));
                  generateWorkout();
                  setActiveTab('workout');
                }}
                  style={{
                    flex: 1, padding: '11px 0', borderRadius: 12,
                    background: 'linear-gradient(135deg, #92400e, #f59e0b)',
                    color: '#0f172a', fontWeight: 800, fontSize: 13,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <Zap size={14} /> {todayProgram ? `${todayProgram.label} Başlat` : 'Antrenman Oluştur'}
                </button>
              )}
              {workout && (
                <button onClick={() => generateWorkout()}
                  style={{
                    padding: '11px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#94a3b8', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── HAFTALIK GELİŞİM ── */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Haftalık Gelişim</p>
            <button onClick={() => setActiveTab('stats')}
              style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }}>
              Tümü <ChevronRight size={11} />
            </button>
          </div>
          {weeklyData.some(d => d.volume > 0) ? (
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#0f172a' : '#fff',
                    border: '1px solid #334155', borderRadius: 8, fontSize: 10
                  }}
                  formatter={(v) => [`${v > 1000 ? `${(v / 1000).toFixed(1)}t` : `${v}kg`}`, 'Hacim']}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]} fill="#f59e0b" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#334155' }}>
              <p style={{ fontSize: 11 }}>Bu hafta henüz antrenman yok</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 9, color: '#475569' }}>{thisWeek} antrenman bu hafta</span>
            {streak > 0 && (
              <span style={{ fontSize: 9, color: '#f59e0b' }}>🔥 {streak} günlük seri</span>
            )}
          </div>
        </div>

        {/* ── SU TAKİBİ ── */}
        <WaterTracker darkMode={darkMode} />

        {/* ── SON ANTRENMALAR ── */}
        {recentWorkouts.length > 0 && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Son Antrenmalar</p>
              <button onClick={() => setActiveTab('workout')}
                style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Calendar size={11} /> Takvim
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentWorkouts.map((entry) => {
                const logCount = Object.keys(entry.exercises || {}).length;
                const volume = Object.values(entry.exercises || {}).reduce((acc, log) => {
                  return acc + (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0);
                }, 0);
                const isToday = new Date(entry.timestamp).toDateString() === new Date().toDateString();
                return (
                  <div key={entry.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 12,
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    border: `1px solid ${isToday ? 'rgba(245,158,11,0.2)' : darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 700,
                        color: darkMode ? '#e2e8f0' : '#1e293b',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {entry.workoutName?.split('//').pop()?.trim() || entry.workoutName}
                      </p>
                      <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                        {isToday ? 'Bugün' : entry.date?.split(' ').slice(0, 3).join(' ')}
                        {logCount > 0 && ` · ${logCount} kayıt`}
                      </p>
                    </div>
                    {volume > 0 && (
                      <div style={{ textAlign: 'right', marginLeft: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                          {volume >= 1000 ? `${(volume / 1000).toFixed(1)}t` : `${Math.round(volume)}kg`}
                        </p>
                        <p style={{ fontSize: 9, color: '#475569' }}>hacim</p>
                      </div>
                    )}
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
