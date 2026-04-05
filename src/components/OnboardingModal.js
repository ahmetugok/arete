import React, { useState } from 'react';
import { Dumbbell, Flame, Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { PROGRAM_PLANS } from '../data/programData';

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
    body: "PR tablosu, ağırlık grafikleri, haftalık hacim ve vücut ağırlığı trendi — hepsi İstatistik sekmesinde. Kahin'den günlük koçluk al.",
  },
  {
    icon: Dumbbell,
    color: T.accent,
    textColor: '#0C0E11',
    title: 'Hedefini Seç',
    subtitle: 'Program buna göre optimize edilecek.',
    body: null, // custom goal selector
  },
];

// Onboarding'de gösterilecek hedef programlar (PROGRAM_PLANS'dan seç)
const GOAL_IDS = ['fat_loss', 'recomp', 'arete_hybrid'];
const GOAL_PLANS = PROGRAM_PLANS.filter(p => GOAL_IDS.includes(p.id));

const OnboardingModal = ({ onClose }) => {
  const [step, setStep]             = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const current   = STEPS_INFO[step];
  const isLast    = step === STEPS_INFO.length - 1;
  const isGoalStep = step === STEPS_INFO.length - 1;

  const handleFinish = () => {
    if (selectedGoalId) {
      const plan = PROGRAM_PLANS.find(p => p.id === selectedGoalId);
      if (plan) {
        // Hedef seçildi → localStorage'a hem goal key hem de tam program yaz
        localStorage.setItem('arete_goal', selectedGoalId);
        const programRecord = {
          id:            Date.now(),
          goal:          selectedGoalId,
          title:         plan.title,
          totalWeeks:    8,
          daysPerWeek:   plan.schedule.filter(s => s.focus !== 'recovery').length,
          startDate:     new Date().toISOString().split('T')[0],
          completedDays: {},
          phases: [
            { name: 'Adaptasyon', startWeek: 1, endWeek: 2, color: '#60a5fa' },
            { name: 'Hacim',      startWeek: 3, endWeek: 5, color: T.accent  },
            { name: 'Yoğunluk',  startWeek: 6, endWeek: 7, color: '#f97316' },
            { name: 'Tepe',       startWeek: 8, endWeek: 8, color: '#ef4444' },
          ],
          schedule: plan.schedule,
        };
        localStorage.setItem('arete_program', JSON.stringify(programRecord));
      }
    }
    onClose();
  };

  const canProceed = !isGoalStep || selectedGoalId !== null;

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
              {GOAL_PLANS.map(plan => (
                <button key={plan.id}
                  onClick={() => setSelectedGoalId(plan.id)}
                  style={{
                    borderRadius: 16, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', cursor: 'pointer',
                    background: selectedGoalId === plan.id ? 'rgba(209,255,38,0.08)' : T.surface,
                    border: `1.5px solid ${selectedGoalId === plan.id ? T.accent : T.outline}`,
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{plan.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 800,
                      color: selectedGoalId === plan.id ? T.accent : T.text,
                      fontFamily: 'Lexend, sans-serif',
                    }}>{plan.title}</p>
                    <p style={{ fontSize: 11, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{plan.desc}</p>
                  </div>
                  {selectedGoalId === plan.id && (
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
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
