import React, { useState } from 'react';
import { Dumbbell, Flame, Trophy, TrendingUp, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    icon: Dumbbell,
    color: '#f59e0b',
    title: "ARETE'ye Hos Geldin",
    subtitle: 'Mukemmellik bir aliskanliктir.',
    body: 'ARETE, sana kisisellestirilmis antrenman programlari uretir. GVT, OVT, Hanik, Prime ve daha fazlasi - tek bir uygulamada.',
  },
  {
    icon: Flame,
    color: '#ef4444',
    title: 'Mod Sec, Olustur',
    subtitle: 'Her gun farkli bir sistem.',
    body: 'Antrenman sekmesinde modu ve sureyi sec. 45 dk kisaysa guç odakli. 90 dk varsa tam program. "Olustur" tusuna bas ve basla.',
  },
  {
    icon: Trophy,
    color: '#60a5fa',
    title: 'Rekorlarini Kaydet',
    subtitle: 'Kg ve tekrar her zaman logla.',
    body: 'Her egzersiz sonrasi agirlik ve tekrar sayini gir. Rekorların otomatik kaydedilir. +2.5 kg ilerleme onerisi her antrenmanda seni karsılar.',
  },
  {
    icon: TrendingUp,
    color: '#22c55e',
    title: 'Ilerleni Takip Et',
    subtitle: 'Istatistik sekmesi seni izliyor.',
    body: 'PR tablosu, agirlik grafikleri, haftalik hacim ve vucut agirligi trendi - hepsi Istatistik sekmesinde. Kahinden gunluk kocluk al.',
  },
];

const OnboardingModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: '#0f172a', border: '1px solid rgba(245,158,11,0.2)' }}>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-5 pb-2">
          {STEPS.map((_, i) => (
            <div key={i} className="rounded-full transition-all"
              style={{
                width: i === step ? 24 : 6, height: 6,
                background: i === step ? current.color : 'rgba(255,255,255,0.1)',
              }} />
          ))}
        </div>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${current.color}18`, border: `1px solid ${current.color}30` }}>
            <current.icon size={36} style={{ color: current.color }} />
          </div>

          <h2 className="text-xl font-black text-white mb-1 tracking-tight">{current.title}</h2>
          <p className="text-xs font-bold mb-4" style={{ color: current.color }}>{current.subtitle}</p>
          <p className="text-sm text-slate-400 leading-relaxed">{current.body}</p>
        </div>

        <div className="px-8 pb-8 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 border border-slate-800">
              Geri
            </button>
          )}
          <button
            onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-900 flex items-center justify-center gap-1"
            style={{ background: current.color }}>
            {isLast ? 'Basla!' : 'Ileri'}
            {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
