import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, TrendingUp, Zap, Scale, Flame, Calendar } from 'lucide-react';

// ── Helper: Get all PR records from history ──
const getPRRecords = (history) => {
  const prs = {}; // { exerciseName: { weight, reps, date, rpe } }
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

// ── Helper: Get progress data for a specific exercise ──
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
    .slice(-12); // son 12 giriş
};

// ── Helper: Calculate streak ──
const getStreak = (history) => {
  if (!history.length) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workoutDays = new Set(
    history.map(h => {
      const d = new Date(h.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let streak = 0;
  let current = new Date(today);

  // Check if worked out today or yesterday (grace period)
  const todayTs = today.getTime();
  const yesterdayTs = todayTs - 86400000;
  if (!workoutDays.has(todayTs) && !workoutDays.has(yesterdayTs)) return 0;

  if (!workoutDays.has(todayTs)) current = new Date(yesterdayTs);

  while (workoutDays.has(current.getTime())) {
    streak++;
    current = new Date(current.getTime() - 86400000);
  }
  return streak;
};

// ── Helper: Get weekly volume by muscle group ──
const getWeeklyVolume = (history) => {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = history.filter(h => h.timestamp > oneWeekAgo);

  const volume = { 'Pazartesi': 0, 'Salı': 0, 'Çarşamba': 0, 'Perşembe': 0, 'Cuma': 0, 'Cumartesi': 0, 'Pazar': 0 };
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  recent.forEach(entry => {
    const d = new Date(entry.timestamp);
    const dayName = days[d.getDay()];
    const v = Object.values(entry.exercises || {}).reduce((acc, log) => {
      return acc + (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0);
    }, 0);
    if (volume[dayName] !== undefined) volume[dayName] += v;
  });

  return Object.entries(volume).map(([day, vol]) => ({ day: day.slice(0, 3), volume: Math.round(vol) }));
};

const StatsTab = ({ darkMode }) => {
  const [history, setHistory] = useState([]);
  const [bodyWeightLog, setBodyWeightLog] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [bodyWeightInput, setBodyWeightInput] = useState('');
  const [activeSection, setActiveSection] = useState('prs'); // 'prs' | 'progress' | 'body' | 'volume'

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('arete_history') || '[]'));
    setBodyWeightLog(JSON.parse(localStorage.getItem('arete_bodyweight') || '[]'));
  }, []);

  const prs = getPRRecords(history);
  const streak = getStreak(history);
  const totalWorkouts = history.length;
  const thisWeek = history.filter(h => h.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const progressData = selectedExercise ? getExerciseProgress(history, selectedExercise) : [];
  const weeklyVolume = getWeeklyVolume(history);

  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-slate-200' : 'text-gray-800';
  const subtext = darkMode ? 'text-slate-500' : 'text-gray-400';

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
  const latestBodyWeight = bodyWeightLog[0]?.weight;
  const bodyWeightChange = bodyWeightLog.length >= 2 ? (bodyWeightLog[0].weight - bodyWeightLog[1].weight).toFixed(1) : null;

  const sections = [
    { id: 'prs', label: 'Rekorlar', icon: Trophy },
    { id: 'progress', label: 'İlerleme', icon: TrendingUp },
    { id: 'body', label: 'Vücut', icon: Scale },
    { id: 'volume', label: 'Hacim', icon: Flame },
  ];

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header Stats */}
      <div className="px-4 pt-4 pb-3">
        <h2 className={`text-xl font-black tracking-widest mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
          İSTATİSTİK
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Toplam', value: totalWorkouts, unit: 'antrenman', icon: Calendar, color: '#f59e0b' },
            { label: 'Bu Hafta', value: thisWeek, unit: 'gün', icon: Zap, color: '#60a5fa' },
            { label: 'Seri', value: streak, unit: 'gün', icon: Flame, color: streak >= 7 ? '#ef4444' : '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-3 text-center ${card}`}>
              <stat.icon size={16} style={{ color: stat.color, margin: '0 auto 4px' }} />
              <div className="text-2xl font-black" style={{ color: stat.color, fontFamily: 'monospace' }}>{stat.value}</div>
              <div className={`text-[9px] uppercase tracking-wider ${subtext}`}>{stat.unit}</div>
              <div className={`text-[8px] ${subtext}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section tabs */}
        <div className={`flex gap-1 p-1 rounded-xl ${darkMode ? 'bg-slate-900' : 'bg-gray-200'}`}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5
                ${activeSection === s.id
                  ? 'bg-amber-500 text-slate-900'
                  : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500'
                }`}>
              <s.icon size={12} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* PR Records */}
        {activeSection === 'prs' && (
          <div>
            {Object.keys(prs).length === 0 ? (
              <div className={`text-center py-12 ${subtext}`}>
                <Trophy size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Henüz kayıtlı rekor yok.</p>
                <p className="text-xs mt-1">Antrenman bitince kg/reps kaydet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(prs)
                  .sort((a, b) => b[1].weight - a[1].weight)
                  .map(([name, pr]) => (
                    <div key={name} className={`rounded-xl border p-3 flex justify-between items-center cursor-pointer transition-all
                      ${card} ${selectedExercise === name ? 'border-amber-500/50' : ''}`}
                      onClick={() => { setSelectedExercise(name === selectedExercise ? null : name); setActiveSection('progress'); }}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${text}`}>{name}</p>
                        <p className={`text-[10px] ${subtext}`}>{pr.date}</p>
                      </div>
                      <div className="text-right ml-3">
                        <span className="text-lg font-black text-amber-500 font-mono">{pr.weight}</span>
                        <span className={`text-xs ${subtext}`}> kg</span>
                        {pr.reps && <span className={`text-xs ${subtext} ml-1`}>x {pr.reps}</span>}
                        {pr.rpe && <span className={`text-[10px] ml-1`} style={{ color: parseInt(pr.rpe) >= 9 ? '#ef4444' : '#f59e0b' }}>RPE {pr.rpe}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Chart */}
        {activeSection === 'progress' && (
          <div>
            {/* Exercise selector */}
            <div className="mb-3">
              <p className={`text-xs ${subtext} mb-2`}>Egzersiz sec:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(prs).slice(0, 12).map(name => (
                  <button key={name} onClick={() => setSelectedExercise(name)}
                    className={`text-[10px] px-3 py-1.5 rounded-full border font-medium transition-all
                      ${selectedExercise === name
                        ? 'bg-amber-500 text-slate-900 border-amber-500'
                        : darkMode ? 'border-slate-700 text-slate-400 hover:border-slate-500' : 'border-gray-300 text-gray-500'
                      }`}>
                    {name.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {selectedExercise && progressData.length > 0 ? (
              <div className={`rounded-2xl border p-4 ${card}`}>
                <p className={`text-xs font-bold mb-1 ${text}`}>{selectedExercise}</p>
                <p className={`text-[10px] mb-4 ${subtext}`}>Agirlik (kg) - son {progressData.length} giris</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`${v} kg`, 'Agirlik']}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
                {progressData.length >= 2 && (
                  <div className="mt-3 flex gap-4">
                    <div>
                      <p className={`text-[9px] ${subtext} uppercase`}>Baslangic</p>
                      <p className="text-sm font-bold text-amber-500 font-mono">{progressData[0]?.weight} kg</p>
                    </div>
                    <div>
                      <p className={`text-[9px] ${subtext} uppercase`}>Son</p>
                      <p className="text-sm font-bold text-amber-500 font-mono">{progressData[progressData.length - 1]?.weight} kg</p>
                    </div>
                    <div>
                      <p className={`text-[9px] ${subtext} uppercase`}>Fark</p>
                      <p className={`text-sm font-bold font-mono ${progressData[progressData.length - 1]?.weight > progressData[0]?.weight ? 'text-green-400' : 'text-red-400'}`}>
                        {progressData[progressData.length - 1]?.weight > progressData[0]?.weight ? '+' : ''}
                        {(progressData[progressData.length - 1]?.weight - progressData[0]?.weight).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-10 ${subtext}`}>
                <TrendingUp size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">{selectedExercise ? 'Bu egzersiz icin yeterli veri yok.' : 'Bir egzersiz sec.'}</p>
              </div>
            )}
          </div>
        )}

        {/* Body Weight */}
        {activeSection === 'body' && (
          <div>
            {/* Input */}
            <div className={`rounded-2xl border p-4 mb-3 ${card}`}>
              <p className={`text-xs font-bold mb-3 ${text}`}>Bugunku Vucut Agirligi</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bodyWeightInput}
                  onChange={e => setBodyWeightInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveBodyWeight()}
                  placeholder="kg"
                  step="0.1"
                  min="30"
                  max="250"
                  className={`flex-1 rounded-xl px-4 py-3 text-center font-mono text-lg font-bold border outline-none
                    ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
                <button onClick={saveBodyWeight}
                  className="px-5 py-3 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm">
                  Kaydet
                </button>
              </div>
              {latestBodyWeight && (
                <div className="flex items-center gap-3 mt-3">
                  <span className={`text-[10px] ${subtext}`}>Son: </span>
                  <span className="text-amber-500 font-mono font-bold">{latestBodyWeight} kg</span>
                  {bodyWeightChange !== null && (
                    <span className={`text-xs font-bold ${parseFloat(bodyWeightChange) <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(bodyWeightChange) > 0 ? '+' : ''}{bodyWeightChange} kg
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Chart */}
            {bodyWeightChartData.length >= 2 ? (
              <div className={`rounded-2xl border p-4 ${card}`}>
                <p className={`text-xs font-bold mb-4 ${text}`}>Trend - son {bodyWeightChartData.length} giris</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={bodyWeightChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                      formatter={(v) => [`${v} kg`, 'Agirlik']}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={`text-center py-8 ${subtext}`}>
                <Scale size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">En az 2 giris gerekli grafik icin.</p>
              </div>
            )}
          </div>
        )}

        {/* Weekly Volume */}
        {activeSection === 'volume' && (
          <div>
            <div className={`rounded-2xl border p-4 mb-3 ${card}`}>
              <p className={`text-xs font-bold mb-4 ${text}`}>Bu Haftaki Gunluk Hacim (kg)</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyVolume} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 9, fill: darkMode ? '#475569' : '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${v} kg`, 'Hacim']}
                  />
                  <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top exercises this week */}
            <div className={`rounded-2xl border p-4 ${card}`}>
              <p className={`text-xs font-bold mb-3 ${text}`}>Bu Hafta En Cok Calisilan</p>
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
                if (!sorted.length) return <p className={`text-xs ${subtext}`}>Bu hafta kayit yok.</p>;
                return sorted.map(([name, count]) => (
                  <div key={name} className={`flex justify-between items-center py-2 border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                    <span className={`text-xs ${text}`}>{name}</span>
                    <span className="text-xs font-bold text-amber-500 font-mono">{count}x</span>
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
