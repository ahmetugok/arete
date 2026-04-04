import React, { useState } from 'react';
import { Dumbbell, Flame, Trophy, TrendingUp, ChevronRight, Target } from 'lucide-react';


// ── Design tokens ──────────────────────────────────────────────────────────────
const T = {
  surface:     '#161A1D',
  surfaceHi:   '#1E2226',
  accent:      '#D1FF26',
  accentDim:   'rgba(209,255,38,0.12)',
  accentBorder:'rgba(209,255,38,0.22)',
  outline:     'rgba(255,255,255,0.06)',
  muted:       '#7A7C80',
  text:        '#F9F9FD',
};

const STEPS_INFO = [
  {
    icon: Dumbbell,
    color: T.accent,
    textColor: '#0C0E11',
    title: "ARETE'ye Hoş Geldin",
    subtitle: 'Mükemmellik bir alışkanlıktır.',
    body: 'ARETE, sana kişiselleştirilmiş antrenman programları üretir. GVT, OVT, Hanik, Prime ve daha fazlası — tek bir uygulamada.',
  },
  {
    icon: Flame,
    color: '#ef4444',
    textColor: '#fff',
    title: 'Mod Seç, Oluştur',
    subtitle: 'Her gün farklı bir sistem.',
    body: 'Antrenman sekmesinde modu ve süreyi seç. 45 dk kısaysa güç odaklı. 90 dk varsa tam program. "Oluştur" tuşuna bas ve başla.',
  },
  {
    icon: Trophy,
    color: '#60a5fa',
    textColor: '#fff',
    title: 'Rekorlarını Kaydet',
    subtitle: 'Kg ve tekrar her zaman logla.',
    body: 'Her egzersiz sonrası ağırlık ve tekrar sayını gir. Rekortların otomatik kaydedilir. +2.5 kg ilerleme önerisi her antrenmanda seni karşılar.',
  },
  {
    icon: TrendingUp,
    color: '#22c55e',
    textColor: '#fff',
    title: 'İlerieni Takip Et',
    subtitle: 'İstatistik sekmesi seni izliyor.',
    body: 'PR tablosu, ağırlık grafikleri, haftalık hacim ve vücut ağırlığı trendi — hepsi İstatistik sekmesinde. Kahin\'den günlük koçluk al.',
  },
  {
    icon: Target,
    color: T.accent,
    textColor: '#0C0E11',
    title: 'Hedefinizi Belirleyin',
    subtitle: 'Program buna göre optimize edilecek.',
    body: null, // custom goal selector
  },
];

const GOALS = [
  { key: 'bulk',   emoji: '💪', label: 'Hacim',      sub: 'Kas kütlesi kazan',   color: '#f97316' },
  { key: 'recomp', emoji: '⚖️', label: 'Recomp',     sub: 'Yağ yak, kas koru',   color: T.accent  },
  { key: 'cut',    emoji: '🔥', label: 'Yağ Yakma',  sub: 'Vücut yağını düşür',  color: '#ef4444' },
];

const OnboardingModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const current = STEPS_INFO[step];
  const isLast = step === STEPS_INFO.length - 1;
  const isGoalStep = step === STEPS_INFO.length - 1;

  const handleFinish = () => {
    if (selectedGoal) {
      localStorage.setItem('arete_goal', selectedGoal);
    }
    onClose();
  };

  const canProceed = !isGoalStep || selectedGoal !== null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        borderRadius: '28px 28px 0 0',
        background: '#0C0E11',
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
        overflow: 'hidden',
      }}>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 20, paddingBottom: 8 }}>
          {STEPS_INFO.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2,
              width: i === step ? 24 : 6,
              background: i === step ? current.color : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${current.color}18`,
            border: `1px solid ${current.color}30`,
          }}>
            <current.icon size={32} style={{ color: current.color }} />
          </div>

          <h2 style={{
            fontSize: 22, fontWeight: 900, color: T.text, textAlign: 'center',
            fontFamily: 'Lexend, sans-serif', letterSpacing: '-0.02em', marginBottom: 6,
          }}>{current.title}</h2>
          <p style={{ fontSize: 12, fontWeight: 700, color: current.color, textAlign: 'center', marginBottom: 16 }}>
            {current.subtitle}
          </p>

          {/* Body or Goal Selector */}
          {isGoalStep ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {GOALS.map(g => (
                <button key={g.key}
                  onClick={() => setSelectedGoal(g.key)}
                  style={{
                    borderRadius: 16, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', cursor: 'pointer',
                    background: selectedGoal === g.key ? `${g.color}15` : T.surface,
                    border: `1.5px solid ${selectedGoal === g.key ? g.color : T.outline}`,
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: 24 }}>{g.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 800, color: selectedGoal === g.key ? g.color : T.text,
                      fontFamily: 'Lexend, sans-serif',
                    }}>{g.label}</p>
                    <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{g.sub}</p>
                  </div>
                  {selectedGoal === g.key && (
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 11, color: '#0C0E11', fontWeight: 900 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: T.muted, textAlign: 'center', lineHeight: 1.7 }}>{current.body}</p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: '0 28px 32px', display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 14,
                fontSize: 13, fontWeight: 700, color: T.muted,
                background: 'transparent', border: `1px solid ${T.outline}`, cursor: 'pointer',
              }}>
              Geri
            </button>
          )}
          <button
            onClick={() => isLast ? handleFinish() : setStep(s => s + 1)}
            disabled={!canProceed}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 14,
              fontSize: 13, fontWeight: 900, color: current.textColor,
              background: canProceed ? current.color : 'rgba(255,255,255,0.08)',
              border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'Lexend, sans-serif',
              transition: 'all 0.15s',
              opacity: canProceed ? 1 : 0.5,
            }}>
            {isLast ? 'Başla!' : 'İleri'}
            {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
