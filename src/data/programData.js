export const PROGRAM_PLANS = [
  // --- YENİ EKLENEN İLK HEDEFLER ---
  {
    id: 'fat_loss',
    icon: '🔥',
    title: 'Yağ Yakımı & Definasyon',
    desc: 'Yüksek nabız, kalori açığını destekleyen kondisyon ve kas koruyucu hipertrofi.',
    schedule: [
      { weekdaySlot: 1, focus: 'engine', label: 'MetCon (Kondisyon)' },
      { weekdaySlot: 2, focus: 'aesthetics', label: 'Üst Vücut (İzolasyon)' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Aktif Dinlenme / Yürüyüş' },
      { weekdaySlot: 4, focus: 'hybrid', label: 'Spartan Hybrid (Full Body)' },
      { weekdaySlot: 5, focus: 'metcon', label: 'Endurance (Kardiyo)' },
      { weekdaySlot: 6, focus: 'recovery', label: 'Mobilite & Esneme' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  },
  {
    id: 'recomp',
    icon: '⚖️',
    title: 'Body Recomposition (Recomp)',
    desc: 'Aynı anda yağ yakıp kas kütlesi inşa etme. Güç ve kondisyonun mükemmel dengesi.',
    schedule: [
      { weekdaySlot: 1, focus: 'ovt_pull', label: 'Alt Vücut Güç (OVT)' },
      { weekdaySlot: 2, focus: 'ovt_push', label: 'Üst Vücut Güç (OVT)' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Aktif Onarım' },
      { weekdaySlot: 4, focus: 'engine', label: 'Kondisyon (Engine)' },
      { weekdaySlot: 5, focus: 'fbb', label: 'Fonksiyonel (FBB)' },
      { weekdaySlot: 6, focus: 'metcon', label: 'MetCon' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  },

  // --- MEVCUT ARETE PROGRAMLARI ---
  {
    id: 'arete_hybrid',
    icon: '🏛️',
    title: 'The Arete Split (Hybrid)',
    desc: 'Mevcut sistem. Güç, estetik ve kondisyonun kusursuz birleşimi.',
    schedule: [
      { weekdaySlot: 1, focus: 'strength', label: 'Alt Vücut (Güç)' },
      { weekdaySlot: 2, focus: 'aesthetics', label: 'Üst Vücut (Estetik)' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Aktif Dinlenme' },
      { weekdaySlot: 4, focus: 'prime', label: 'Arete Prime (Atletizm)' },
      { weekdaySlot: 5, focus: 'engine', label: 'Engine (MetCon)' },
      { weekdaySlot: 6, focus: 'recovery', label: 'Mobilite' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  },
  {
    id: 'olympus_gvt',
    icon: '👑',
    title: 'Olympus Hypertrophy (GVT)',
    desc: 'Alman Hacim Sistemi (10x10) ile maksimum kas büyümesi.',
    schedule: [
      { weekdaySlot: 1, focus: 'gvt_legs', label: 'GVT Bacak & Karın' },
      { weekdaySlot: 2, focus: 'gvt_push', label: 'GVT Göğüs & Omuz' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Aktif Dinlenme' },
      { weekdaySlot: 4, focus: 'gvt_pull', label: 'GVT Sırt & Biseps' },
      { weekdaySlot: 5, focus: 'aesthetics', label: 'Eksik Bölge İzolasyon' },
      { weekdaySlot: 6, focus: 'recovery', label: 'Hafif Kardiyo' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  },
  {
    id: 'titan_ovt',
    icon: '⚡',
    title: 'Titan Strength (OVT)',
    desc: 'Optimum Hacim Antrenmanı ile ağır kilolar ve sinir sistemi adaptasyonu.',
    schedule: [
      { weekdaySlot: 1, focus: 'ovt_pull', label: 'OVT Alt Vücut Güç' },
      { weekdaySlot: 2, focus: 'ovt_push', label: 'OVT Üst Vücut Güç' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Tam Dinlenme' },
      { weekdaySlot: 4, focus: 'ovt_pull', label: 'OVT Alt Vücut Hacim' },
      { weekdaySlot: 5, focus: 'ovt_push', label: 'OVT Üst Vücut Hacim' },
      { weekdaySlot: 6, focus: 'recovery', label: 'Mobilite' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  },
  {
    id: 'hanik_protocol',
    icon: '🪓',
    title: 'Hanik Protokolü',
    desc: 'Yüksek hacimli, patlayıcı vücut ağırlığı ve kettlebell kombinasyonları.',
    schedule: [
      { weekdaySlot: 1, focus: 'hanik_push_legs', label: 'Hanik Push & Legs' },
      { weekdaySlot: 2, focus: 'hanik_pull_core', label: 'Hanik Pull & Core' },
      { weekdaySlot: 3, focus: 'recovery', label: 'Mobilite' },
      { weekdaySlot: 4, focus: 'hanik_push_legs', label: 'Hanik Push & Legs' },
      { weekdaySlot: 5, focus: 'hanik_pull_core', label: 'Hanik Pull & Core' },
      { weekdaySlot: 6, focus: 'metcon', label: 'Hanik Finisher' },
      { weekdaySlot: 7, focus: 'recovery', label: 'Tam Dinlenme' }
    ]
  }
];
