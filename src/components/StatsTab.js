import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Trophy, TrendingUp, Zap, Scale, Flame, Calendar, ChevronRight } from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────────────
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

const card = (extra = {}) => ({
  borderRadius: 20,
  background: T.surface,
  border: `1px solid ${T.outline}`,
  ...extra,
});

// ── Helper: Get all PR records from history ──
const getPRRecords = (history) => {
  const prs = {};
  [...history].reverse().forEach(entry => {
    Object.entries(entry.exercises || {}).forEach(([name, log]) => {
      const w = parseFloat(log.weight) || 0;
      if (w > 0) {
        if (!prs[name] || w > prs[name].weight) {
          prs[name] = { weight: w, reps: log.reps, date: entry.date, rpe: log.rpe };
        }
      }
    });
  });
  return prs;
};

const getExerciseProgress = (history, exerciseName) => {
  return history
    .filter(entry => entry.exercises?.[exerciseName]?.weight)
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      weight: parseFloat(entry.exercises[exerciseName].weight),
      reps: parseInt(entry.exercises[exerciseName].reps) || 0,
      volume: parseFloat(entry.exercises[exerciseName].weight) * (parseInt(entry.exercises[exerciseName].reps) || 1),
    }))
    .reverse()
    .slice(-12);
};

const getStreak = (history) => {
  if (!history.length) return 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const workoutDays = new Set(history.map(h => {
    const d = new Date(h.timestamp); d.setHours(0, 0, 0, 0); return d.getTime();
  }));
  let streak = 0;
  const todayTs = today.getTime();
  const yesterdayTs = todayTs - 86400000;
  if (!workoutDays.has(todayTs) && !workoutDays.has(yesterdayTs)) return 0;
  let current = new Date(!workoutDays.has(todayTs) ? yesterdayTs : todayTs);
  while (workoutDays.has(current.getTime())) { streak++; current = new Date(current.getTime() - 86400000); }
  return streak;
};

const getWeeklyVolume = (history) => {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = history.filter(h => h.timestamp > oneWeekAgo);
  const volume = { 'Pazartesi': 0, 'Salı': 0, 'Çarşamba': 0, 'Perşembe': 0, 'Cuma': 0, 'Cumartesi': 0, 'Pazar': 0 };
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  recent.forEach(entry => {
    const d = new Date(entry.timestamp);
    const dayName = days[d.getDay()];
    const v = Object.values(entry.exercises || {}).reduce((acc, log) =>
      acc + (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0), 0);
    if (volume[dayName] !== undefined) volume[dayName] += v;
  });
  return Object.entries(volume).map(([day, vol]) => ({ day: day.slice(0, 3), volume: Math.round(vol) }));
};

// ── Section Tab ───────────────────────────────────────────────────────────────
const SectionPill = ({ id, label, icon: Icon, active, onClick }) => (
  <button onClick={() => onClick(id)}
    style={{
      flex: 1, padding: '9px 4px', borderRadius: 12,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
      background: active ? T.accent : 'transparent',
      color: active ? '#0C0E11' : T.muted,
      border: 'none', cursor: 'pointer', transition: 'all 0.15s',
      fontFamily: 'Lexend, sans-serif',
    }}>
    <Icon size={13} />
    {label}
  </button>
);

// ── StatsTab ──────────────────────────────────────────────────────────────────
const StatsTab = ({ darkMode }) => {
  const [history, setHistory] = useState([]);
  const [bodyWeightLog, setBodyWeightLog] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [bodyWeightInput, setBodyWeightInput] = useState('');
  const [activeSection, setActiveSection] = useState('prs');

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('arete_history') || '[]'));
    setBodyWeightLog(JSON.parse(localStorage.getItem('arete_bodyweight') || '[]'));
  }, []);

  const prs           = getPRRecords(history);
  const streak        = getStreak(history);
  const totalWorkouts = history.length;
  const thisWeek      = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const progressData  = selectedExercise ? getExerciseProgress(history, selectedExercise) : [];
  const weeklyVolume  = getWeeklyVolume(history);

  const saveBodyWeight = () => {
    const w = parseFloat(bodyWeightInput);
    if (!w || w < 30 || w > 250) return;
    const newLog = [
      { date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }), timestamp: Date.now(), weight: w },
      ...bodyWeightLog.filter(l => new Date(l.timestamp).toDateString() !== new Date().toDateString()),
    ].slice(0, 60);
    setBodyWeightLog(newLog);
    localStorage.setItem('arete_bodyweight', JSON.stringify(newLog));
    setBodyWeightInput('');
  };

  const bodyWeightChartData = [...bodyWeightLog].reverse().slice(-20).map(l => ({ date: l.date, weight: l.weight }));
  const latestBodyWeight    = bodyWeightLog[0]?.weight;
  const bodyWeightChange    = bodyWeightLog.length >= 2
    ? (bodyWeightLog[0].weight - bodyWeightLog[1].weight).toFixed(1) : null;

  // Weekly PR change for highlight card
  const weekHistory = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyWorkouts = weekHistory.length;

  const sections = [
    { id: 'prs', label: 'Rekorlar', icon: Trophy },
    { id: 'progress', label: 'İlerleme', icon: TrendingUp },
    { id: 'body', label: 'Vücut', icon: Scale },
    { id: 'volume', label: 'Hacim', icon: Flame },
  ];

  const tooltipStyle = {
    background: T.surfaceHi,
    border: `1px solid ${T.outline}`,
    borderRadius: 10,
    fontSize: 10,
    color: T.text,
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>

      {/* ── HIGHLIGHT CARD (lime) ── */}
      {weeklyWorkouts > 0 && (
        <div style={{
          margin: '12px 16px 0',
          borderRadius: 22, padding: '18px 20px',
          background: T.accent,
        }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8, fontFamily: 'Lexend, sans-serif' }}>
            AZ ÖZET
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0C0E11', lineHeight: 1.2, fontFamily: 'Lexend, sans-serif', marginBottom: 10 }}>
            Bu haftaki başarınız:{' '}
            <span style={{ color: '#2D4500' }}>%{weeklyWorkouts * 14} gelişim</span>
          </h2>
          <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}>
            {weeklyWorkouts} antrenman tamamlandı. Haftalık antrenman frekansı artıyor.
          </p>
        </div>
      )}

      {/* ── HEADER STATS ── */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'TOPLAM', value: totalWorkouts, unit: 'antrenman', icon: Calendar, color: T.accent },
            { label: 'BU HAFTA', value: thisWeek, unit: 'gün', icon: Zap, color: '#60a5fa' },
            { label: 'SERİ', value: streak, unit: 'gün', icon: Flame, color: streak >= 7 ? '#ef4444' : T.accent },
          ].map(stat => (
            <div key={stat.label} style={card({ padding: '14px 10px', textAlign: 'center' })}>
              <stat.icon size={15} style={{ color: stat.color, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: stat.color, fontFamily: 'Lexend, sans-serif', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 9, color: T.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: 4, borderRadius: 16,
          background: T.surface, marginBottom: 4,
        }}>
          {sections.map(s => (
            <SectionPill key={s.id} {...s} active={activeSection === s.id} onClick={setActiveSection} />
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 16px' }}>

        {/* ── PR RECORDS ── */}
        {activeSection === 'prs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.keys(prs).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted }}>
                <Trophy size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 13 }}>Henüz kayıtlı rekor yok.</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>Antrenman bitince kg/reps kaydet.</p>
              </div>
            ) : (
              Object.entries(prs)
                .sort((a, b) => b[1].weight - a[1].weight)
                .map(([name, pr]) => (
                  <div key={name}
                    onClick={() => { setSelectedExercise(name === selectedExercise ? null : name); setActiveSection('progress'); }}
                    style={{
                      ...card({ padding: '14px 16px' }),
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer',
                      border: `1px solid ${selectedExercise === name ? T.accentBorder : T.outline}`,
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {name}
                      </p>
                      <p style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{pr.date}</p>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 12, flexShrink: 0 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: 'Lexend, sans-serif' }}>
                        {pr.weight}
                      </span>
                      <span style={{ fontSize: 11, color: T.muted }}> kg</span>
                      {pr.reps && <span style={{ fontSize: 11, color: T.muted }}> ×{pr.reps}</span>}
                      {pr.rpe && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: parseInt(pr.rpe) >= 9 ? '#ef4444' : T.accent }}>
                          RPE {pr.rpe}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={14} style={{ color: T.muted, marginLeft: 6 }} />
                  </div>
                ))
            )}
          </div>
        )}

        {/* ── PROGRESS CHART ── */}
        {activeSection === 'progress' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {Object.keys(prs).slice(0, 12).map(name => (
                <button key={name} onClick={() => setSelectedExercise(name)}
                  style={{
                    fontSize: 10, padding: '6px 12px', borderRadius: 99,
                    border: `1px solid ${selectedExercise === name ? T.accentBorder : T.outline}`,
                    background: selectedExercise === name ? T.accentDim : 'transparent',
                    color: selectedExercise === name ? T.accent : T.muted,
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  {name.split(' ').slice(0, 3).join(' ')}
                </button>
              ))}
            </div>

            {selectedExercise && progressData.length > 0 ? (
              <div style={card({ padding: '18px 16px' })}>
                <p style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 2 }}>{selectedExercise}</p>
                <p style={{ fontSize: 10, color: T.muted, marginBottom: 14 }}>Ağırlık (kg) — son {progressData.length} giriş</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.surfaceHi} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.muted }} />
                    <YAxis tick={{ fontSize: 9, fill: T.muted }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, 'Ağırlık']} />
                    <Line type="monotone" dataKey="weight" stroke={T.accent} strokeWidth={2.5}
                      dot={{ fill: T.accent, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
                {progressData.length >= 2 && (
                  <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                    {[
                      { label: 'BAŞLANGIÇ', value: `${progressData[0]?.weight} kg` },
                      { label: 'SON', value: `${progressData[progressData.length - 1]?.weight} kg` },
                      {
                        label: 'FARK',
                        value: `${progressData[progressData.length - 1]?.weight > progressData[0]?.weight ? '+' : ''}${(progressData[progressData.length - 1]?.weight - progressData[0]?.weight).toFixed(1)} kg`,
                        color: progressData[progressData.length - 1]?.weight > progressData[0]?.weight ? '#22c55e' : '#ef4444',
                      },
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: item.color || T.accent, fontFamily: 'Lexend, sans-serif' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: T.muted }}>
                <TrendingUp size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 13 }}>{selectedExercise ? 'Bu egzersiz için yeterli veri yok.' : 'Bir egzersiz seç.'}</p>
              </div>
            )}
          </div>
        )}

        {/* ── BODY WEIGHT ── */}
        {activeSection === 'body' && (
          <div>
            <div style={card({ padding: '18px 16px', marginBottom: 10 })}>
              <p style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: 'Lexend, sans-serif', marginBottom: 12 }}>
                Bugünkü Vücut Ağırlığı
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number" value={bodyWeightInput}
                  onChange={e => setBodyWeightInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveBodyWeight()}
                  placeholder="kg" step="0.1" min="30" max="250"
                  style={{
                    flex: 1, borderRadius: 12, padding: '12px 16px',
                    textAlign: 'center', fontFamily: 'Lexend, sans-serif',
                    fontSize: 18, fontWeight: 800,
                    background: T.surfaceHi, border: `1px solid ${T.outline}`,
                    color: T.text, outline: 'none',
                  }}
                />
                <button onClick={saveBodyWeight}
                  style={{
                    padding: '12px 20px', borderRadius: 12,
                    background: T.accent, color: '#0C0E11',
                    fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer',
                    fontFamily: 'Lexend, sans-serif',
                  }}>
                  Kaydet
                </button>
              </div>
              {latestBodyWeight && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <span style={{ fontSize: 10, color: T.muted }}>Son:</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: T.accent, fontFamily: 'Lexend, sans-serif' }}>{latestBodyWeight} kg</span>
                  {bodyWeightChange !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: parseFloat(bodyWeightChange) <= 0 ? '#22c55e' : '#ef4444',
                    }}>
                      {parseFloat(bodyWeightChange) > 0 ? '+' : ''}{bodyWeightChange} kg
                    </span>
                  )}
                </div>
              )}
            </div>

            {bodyWeightChartData.length >= 2 ? (
              <div style={card({ padding: '18px 16px' })}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TREND — son {bodyWeightChartData.length} giriş
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={bodyWeightChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.surfaceHi} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.muted }} />
                    <YAxis tick={{ fontSize: 9, fill: T.muted }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, 'Ağırlık']} />
                    <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2.5}
                      dot={{ fill: '#60a5fa', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: T.muted }}>
                <Scale size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 13 }}>En az 2 giriş gerekli grafik için.</p>
              </div>
            )}
          </div>
        )}

        {/* ── WEEKLY VOLUME ── */}
        {activeSection === 'volume' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={card({ padding: '18px 16px' })}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                BU HAFTAKI GÜNLÜK HACİM (kg)
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyVolume} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.surfaceHi} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: T.muted }} />
                  <YAxis tick={{ fontSize: 9, fill: T.muted }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, 'Hacim']} />
                  <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                    {weeklyVolume.map((entry, index) => (
                      <Cell key={index} fill={entry.volume > 0 ? T.accent : T.surfaceHi} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top exercises */}
            <div style={card({ padding: '18px 16px' })}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                BU HAFTA EN ÇOK ÇALIŞILAN
              </p>
              {(() => {
                const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                const recent = history.filter(h => h.timestamp > oneWeekAgo);
                const exCount = {};
                recent.forEach(entry => {
                  Object.keys(entry.exercises || {}).forEach(name => {
                    exCount[name] = (exCount[name] || 0) + 1;
                  });
                });
                const sorted = Object.entries(exCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
                if (!sorted.length) return (
                  <p style={{ fontSize: 12, color: T.muted }}>Bu hafta kayıt yok.</p>
                );
                return sorted.map(([name, count]) => (
                  <div key={name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: `1px solid ${T.outline}`,
                  }}>
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: T.accent,
                      fontFamily: 'Lexend, sans-serif',
                      background: T.accentDim, padding: '2px 8px', borderRadius: 99,
                    }}>{count}×</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsTab;
