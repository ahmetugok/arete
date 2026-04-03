# ARETE — Frontend Tasarım & Özellik Spesifikasyonu

> Bu doküman, ARETE uygulamasının tüm görsel ve kullanıcı arayüzü özelliklerini,
> ekranları, bileşenlerini ve davranışlarını frontendciye madde madde aktarmak
> amacıyla hazırlanmıştır.

---

## İÇİNDEKİLER

1. [Genel Uygulama Yapısı](#1-genel-uygulama-yapısı)
2. [Tasarım Sistemi (Design System)](#2-tasarım-sistemi)
3. [Navigasyon — Alt Menü (Bottom Nav)](#3-navigasyon--alt-menü-bottom-nav)
4. [Header (Üst Çubuk)](#4-header-üst-çubuk)
5. [Ekran 1 — Antrenman (Workout Tab)](#5-ekran-1--antrenman-workout-tab)
6. [Antrenman Akışı — Kuvvet Bölümü](#6-antrenman-akışı--kuvvet-bölümü)
7. [Antrenman Akışı — MetCon Timer](#7-antrenman-akışı--metcon-timer)
8. [Antrenman Özeti Modalı](#8-antrenman-özeti-modalı)
9. [Ekran 2 — Beslenme (Nutrition Tab)](#9-ekran-2--beslenme-nutrition-tab)
10. [Ekran 3 — Calisthenics Tab](#10-ekran-3--calisthenics-tab)
11. [Ekran 4 — İstatistik (Stats Tab)](#11-ekran-4--i̇statistik-stats-tab)
12. [Ekran 5 — Program Tab](#12-ekran-5--program-tab)
13. [Ekran 6 — Toparlanma (Recovery Tab)](#13-ekran-6--toparlanma-recovery-tab)
14. [Ekran 7 — Ayarlar (Settings Tab)](#14-ekran-7--ayarlar-settings-tab)
15. [Modal — Sistem Kitabesi (Guide)](#15-modal--sistem-kitabesi-guide)
16. [Modal — Takvim (Calendar)](#16-modal--takvim-calendar)
17. [Modal — Antrenman Geçmişi (History)](#17-modal--antrenman-geçmişi-history)
18. [Modal — Kahin (AI Coach Chat)](#18-modal--kahin-ai-coach-chat)
19. [Modal — 1RM Hesaplayıcı](#19-modal--1rm-hesaplayıcı)
20. [Modal — Onboarding (İlk Açılış)](#20-modal--onboarding-i̇lk-açılış)
21. [Modal — Onay Diyaloğu (Confirm Modal)](#21-modal--onay-diyaloğu-confirm-modal)
22. [Toast Bildirimleri](#22-toast-bildirimleri)
23. [Veri Modelleri](#23-veri-modelleri)
24. [API Katmanı](#24-api-katmanı)
25. [LocalStorage Anahtarları](#25-localstorage-anahtarları)
26. [Animasyonlar & Geçiş Efektleri](#26-animasyonlar--geçiş-efektleri)
27. [Erişilebilirlik & Responsive Notlar](#27-erişilebilirlik--responsive-notlar)

---

## 1. Genel Uygulama Yapısı

| Özellik | Değer |
|---------|-------|
| Tip | Progressive Web App (PWA), Mobil-öncelikli SPA |
| Framework | React 19 |
| Stil | Tailwind CSS 3.4 + özel CSS |
| İkon kütüphanesi | Lucide React |
| Grafik kütüphanesi | Recharts |
| Veri saklama | Browser LocalStorage (offline-first, sunucu yok) |
| Dağıtım | Vercel (Serverless Functions) |
| Dil | Türkçe |
| Varsayılan tema | Koyu (dark), ayrıca açık (light) modu var |
| PWA desteği | `manifest.json` ile tam ekran / ana ekrana ekle |

### Dosya Yapısı (Özet)
```
src/
├── Arete.js               — Ana uygulama bileşeni (~4800 satır)
├── App.js                 — Kök sarmalayıcı
├── index.js               — React entry point
├── index.css              — Tailwind + özel CSS sınıfları
├── components/
│   ├── StatsTab.js        — İstatistik ve ilerleme ekranı
│   ├── ProgramTab.js      — Program oluşturma & yönetim
│   ├── OneRMModal.js      — 1RM hesaplayıcı modalı
│   ├── OnboardingModal.js — 4 adımlı ilk açılış eğitimi
│   └── ui/
│       ├── Toast.jsx      — Toast bildirim sistemi
│       └── ConfirmModal.jsx — Onay diyalogları
├── data/
│   ├── exerciseData.js    — Egzersiz veritabanı
│   ├── calisthenicsData.js — Calisthenics egzersiz & ilerlemesi
│   └── exerciseImages.js  — Görsel URL yardımcıları
├── beslenmeData.js        — Beslenme/tarif veritabanı
└── hanikData.js           — Hanik antrenman veritabanı

api/
└── gemini.js              — Groq AI proxy (Vercel serverless)
```

---

## 2. Tasarım Sistemi

### 2.1 Renk Paleti

#### Arka Plan (Karanlık Mod)
| Amaç | Tailwind Sınıfı | Hex |
|------|-----------------|-----|
| Ana arka plan | `bg-slate-950` | `#020617` |
| Kart / yüzey | `bg-slate-900` | `#0f172a` |
| İkincil yüzey | `bg-slate-800` | `#1e293b` |
| Üçüncül yüzey | `bg-slate-700` | `#334155` |

#### Arka Plan (Açık Mod)
| Amaç | Tailwind Sınıfı |
|------|-----------------|
| Ana arka plan | `bg-gray-50` |
| Kart / yüzey | `bg-white` |
| Sınır | `border-gray-200` |

#### Birincil Renk — Amber (Vurgu)
| Ton | Tailwind | Hex |
|-----|----------|-----|
| Çok koyu | `amber-900` | `#451a03` |
| Koyu | `amber-700` | `#b45309` |
| Orta | `amber-600` | `#d97706` |
| **Ana** | **`amber-500`** | **`#f59e0b`** |
| Açık | `amber-400` | `#fbbf24` |
| Çok açık | `amber-300` | `#fcd34d` |

#### Durum Renkleri
| Durum | Renk |
|-------|------|
| Başarı | `green-500` (#22c55e) |
| Uyarı | `yellow-500` (#eab308) |
| Hata | `red-500` (#ef4444) |
| Bilgi | `blue-500` (#3b82f6) |
| PR (kişisel rekor) | `amber-400` |
| Tabata — Çalış | `green-400` (#4ade80) |
| Tabata — Dinlen | `blue-400` (#60a5fa) |

#### Metin Renkleri (Karanlık Mod)
| Kullanım | Sınıf |
|----------|-------|
| Başlık / birincil | `text-white` |
| İkincil metin | `text-slate-300` |
| Pasif / ipucu | `text-slate-400` |
| Çok pasif | `text-slate-500` |
| Vurgu | `text-amber-400` / `text-amber-500` |

### 2.2 Tipografi

| Kullanım | Sınıflar |
|----------|----------|
| Ana başlık | `text-2xl font-black tracking-widest` |
| Alt başlık | `text-xl font-bold tracking-wide` |
| Bölüm başlığı | `text-sm font-bold uppercase tracking-widest` |
| Gövde metni | `text-sm` veya `text-base` |
| İkincil metin | `text-xs text-slate-400` |
| Sayısal değerler | `tabular-nums` sınıfı (font-variant-numeric: tabular-nums) |
| Gradient metin | `.gradient-text` sınıfı (amber gradient) |
| Parlayan metin | `.text-glow` (amber glow efekti) |
| Metin gölgesi (küçük) | `.text-shadow-sm` |
| Metin gölgesi (büyük) | `.text-shadow-lg` |

**Font ailesi**: Sistem fontu (Tailwind varsayılanı — sans-serif)

### 2.3 Özel CSS Sınıfları (`index.css`)

```css
/* Glassmorphism kart */
.glass {
  background: rgba(15, 23, 42, 0.70);  /* slate-900/70 */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.10);
}

/* Amber tonlu glassmorphism */
.glass-amber {
  background: rgba(120, 53, 15, 0.20);  /* amber-900/20 */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(245, 158, 11, 0.20);
}

/* Amber gradient metin */
.gradient-text {
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, #fbbf24, #f59e0b, #d97706);
}

/* Amber parlayan kenarlık */
.glow-border {
  box-shadow: 0 0 20px -5px rgba(217, 119, 6, 0.5);
}

/* Mavi parlayan kenarlık */
.glow-border-blue {
  box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.5);
}

/* Kart hover efekti */
.card-hover {
  transition: all 300ms;
  /* hover: translateY(-2px) + shadow-2xl */
}
```

### 2.4 Animasyon Sınıfları

| Sınıf | Efekt | Süre |
|-------|-------|------|
| `.shimmer` | Soldan sağa ışıltı (yükleme) | 1.5s infinite |
| `.pulse-ring` | Dışa doğru halka yayılma | 2s infinite |
| `.float` | Yukarı-aşağı süzülme (-10px) | 3s infinite |
| `.progress-bar` | Genişlik sıfırdan hedefe | 0.5s ease-out |
| `.animated-gradient` | Arka plan rengi geçişi | 15s infinite |
| `.animate-slide-up` | Aşağıdan yukarı kayma | — |
| `.animate-fade-in-scale` | Küçükten büyüyerek belirme | — |

### 2.5 Kenarlık Yarıçapları (Border Radius)
- Kart/bölüm: `rounded-2xl` (16px)
- Buton: `rounded-xl` (12px) veya `rounded-full`
- Küçük etiket: `rounded-full` veya `rounded-md`
- Modal: `rounded-2xl` veya `rounded-t-3xl` (bottom-sheet)

### 2.6 Gölgeler
- Kart gölgesi: `shadow-2xl shadow-black/60`
- Amber vurgulu gölge: `shadow-lg shadow-amber-900/10`
- Modal overlay: `bg-black/80 backdrop-blur-xl`

### 2.7 Scrollbar Tasarımı
- Genişlik: 8px
- Track: `bg-slate-900`
- Thumb: `bg-slate-700 rounded-full`
- Thumb hover: `bg-amber-600`

### 2.8 SVG Logo
Arete logosu özel bir SVG'dir: İyon sütunu (Ionic column) + halter (barbell) kombinasyonu.
- Sütun rengi: Amber gradient (#f59e0b → #d97706)
- Halter rengi: Beyaz/gri
- Ana ekranda ortalanmış büyük versiyon ile alt navigasyonda küçük versiyon olarak kullanılır.

---

## 3. Navigasyon — Alt Menü (Bottom Nav)

Sabit konumlu (`fixed bottom-0`), tam genişlikte alt navigasyon çubuğu.

| Sekme | İkon (Lucide) | Etiket | `activeTab` değeri |
|-------|---------------|--------|--------------------|
| Antrenman | `Activity` | Antrenman | `'workout'` |
| Beslenme | `Utensils` | Beslenme | `'nutrition'` |
| Calisthenics | `BicepsFlexed` | Calisthenics | `'calisthenics'` |
| İstatistik | `TrendingUp` | İstatistik | `'stats'` |
| Program | `Calendar` | Program | `'program'` |
| Toparlanma | `Heart` | Toparlanma | `'recovery'` |

**Tasarım:**
- Arka plan: `bg-slate-900/96 backdrop-blur-md` (karanlık) / `bg-white/96` (açık)
- Üst kenarlık: `border-t border-slate-800/60` (karanlık) / `border-gray-200` (açık)
- Her sekme düğmesi: `flex-1 flex flex-col items-center`, yükseklik `h-[68px]`
- **Aktif sekme:** İkon + metin birlikte gösterilir, renk `text-amber-400`
  - Üstte etiket metni (`text-[10px] font-semibold tracking-wide`)
  - Altta ikon (`size={22}`)
- **Pasif sekme:** Sadece ikon, renk `text-slate-500` (karanlık) / `text-gray-400` (açık)
- Hover: `hover:text-slate-300` (karanlık) / `hover:text-gray-600` (açık)

**Floating Action Button (FAB):**  
Alt navigasyonun hemen üzerinde, sağ alt köşede Kahin (AI Coach) butonu yer alır.
- Yuvarlak buton: `rounded-full`
- Renk: `bg-amber-500 hover:bg-amber-400`
- İkon: `MessageSquare` (Lucide)
- Konum: `fixed` konumlu, alt navigasyonun üst tarafında (`bottom: ~80px`)

---

## 4. Header (Üst Çubuk)

Her sekmenin üstünde sabit konumlu bir header bulunur.

**İçerik (soldan sağa):**
1. **Arete logosu** — SVG ikon (küçük)
2. **ARETE** — büyük harf, `gradient-text` sınıfı
3. **Takvim ikonu** (`Calendar`) — Takvim modalını açar
4. **Geçmiş ikonu** (`BookOpen` veya `Save`) — Antrenman geçmişini açar
5. **Rehber ikonu** (`BookOpen`) — Sistem kitabesi modalını açar
6. **Ayarlar ikonu** (`Settings`) — Ayarlar sekmesine geçer
7. **Tema değiştirici** — Güneş/Ay ikonu ile koyu/açık mod toggle

---

## 5. Ekran 1 — Antrenman (Workout Tab)

### 5.1 Yapılandırma Ekranı (Workout Config)

Henüz antrenman oluşturulmamışken gösterilen ekran.

**Bölümler:**

#### a) Antrenman Modu Seçici
Izgara (grid) düzeninde mod kartları.

| Mod ID | Türkçe Etiket | İkon | Renk |
|--------|---------------|------|------|
| `gvt_push` | GVT Push | `Dumbbell` | Amber |
| `gvt_pull` | GVT Pull | `Dumbbell` | Amber |
| `gvt_legs` | GVT Bacak | `Dumbbell` | Amber |
| `ovt_push` | OVT İtiş | `Flame` | Kırmızı/Turuncu |
| `ovt_pull` | OVT Çekiş | `Flame` | Kırmızı/Turuncu |
| `hanik_push_legs` | Hanik İtiş+Bacak | `BicepsFlexed` | Mor |
| `hanik_pull_core` | Hanik Çekiş+Core | `BicepsFlexed` | Mor |
| `fbb` | FBB | `Activity` | Mavi |
| `engine` | Engine | `Flame` | Turuncu |
| `aesthetics` | Estetik | `Crown` | Altın |
| `hybrid` | Hibrit | `Zap` | Yeşil |
| `prime` | Prime | `Target` | Kırmızı |
| `spartan_hybrid` | Spartan | `Landmark` | Gri |
| `recovery` | Toparlanma | `Heart` | Yeşil |
| `strength` | Güç | `Dumbbell` | Amber |
| `metcon` | MetCon | `Timer` | Mavi |

Her kart:
- Seçili: `border-amber-500 bg-amber-500/10` (parlayan kenarlık)
- Seçili değil: `border-slate-700 bg-slate-800/50`
- Hover: `hover:border-amber-500/50`

#### b) Süre Seçici
3 düğme: **45 dk** / **60 dk** / **90 dk**
- Seçili: `bg-amber-500 text-black font-bold`
- Seçili değil: `bg-slate-800 text-slate-300`

#### c) Havuz Erişimi
Checkbox veya toggle: "Havuz Erişimim Var" (`Waves` ikonu)
- Aktif: Yeşil kenarlık + arka plan tonu

#### d) Antrenman Oluştur Butonu
- Tam genişlik, büyük buton
- `bg-gradient-to-r from-amber-500 to-amber-600`
- Metin: **"ANTRENMAN OLUŞTUR"** (`Dumbbell` + `Sparkles` ikonu ile)
- Yükleme animasyonu: `shimmer` efekti veya spinner

### 5.2 Oluşturulmuş Antrenman Görünümü

Antrenman oluşturulduktan sonra ekranda görünen kart yapısı.

#### Antrenman Başlığı Kartı
- Antrenman adı: Büyük harf, gradient renk (ör. `ARETE // GVT PUSH DAY`)
- Motivasyonel alıntı: Küçük, italik, `text-slate-400`
- Odak etiketi + süre rozeti
- Kas grubu etiketleri (ör. `Göğüs`, `Sırt`, `Omuz`)
- **Yenile butonu** (`RefreshCw` ikonu) — Yeni antrenman oluşturur
- **Başla butonu** → Antrenman akışına geçer

#### Isınma Bölümü (Warmup)
- Başlık: `ISINMA` + `Flame` ikonu
- Her egzersiz satır halinde:
  - Egzersiz adı
  - Set × Tekrar (ör. `2×10`)
  - Açıklama (opsiyonel)
  - Egzersiz görseli/URL'si (tıklanabilir → YouTube/GIF)

#### Güç Blokları (Strength Blocks)
- Blok başlığı: `BLOK A`, `BLOK B`, vb. + blok türü (ör. `Main Power`)
- Her egzersiz kartı:
  - İsim + set/rep/dinlenme bilgisi
  - Tempo (ör. `30X1`) — özel görselleştirme (4 kutu: İniş/Bekleme/Patlayıcı/Sıkış)
  - RPE hedefi (opsiyonel)
  - Not satırı (opsiyonel)

#### MetCon Bölümü
- Başlık: `METCON` + tip badge (ör. `AMRAP`, `EMOM`, `FOR TIME`, `TABATA`)
- Süre/yapı: ör. `AMRAP × 15 Dakika`
- Egzersiz listesi (her biri ikon + ad + tekrar)

#### Core Bölümü
- Başlık: `CORE`
- Egzersiz listesi

#### Aksesuar Bölümü (sadece 90 dk + estetik modda)
- Başlık: `AKSESUARLAR`

#### Yüzme Bölümü (sadece havuz erişimi + 90 dk)
- `Waves` ikonu + içerik

---

## 6. Antrenman Akışı — Kuvvet Bölümü

**Tam ekran distraksiyon-özgür yürütme arayüzü.**

### 6.1 Genel Yapı
- Üst çubuk: `Blok A / Egzersiz 2/4` tarzı ilerleme göstergesi + X (kapat) butonu
- Egzersiz başlığı, set/rep hedefi, tempo
- Görsel/video bağlantısı (tıklanınca YouTube'a yönlendirir)
- **Egzersiz Formu Rehberi** — genişletilebilir `<details>` bölümü

### 6.2 Set Loglama
Her set için:
- **Ağırlık girişi** (kg) — `<input type="number">`
- **Tekrar girişi** — `<input type="number">`
- **RPE seçimi** — 1-10 arası düğmeler veya slider
- **Not alanı** — kısa metin
- **Onayla butonu** — Set tamamlandı → sonraki sete geç

**PR tespiti:**
- Yeni ağırlık önceki maksimumdan büyükse → `🏆 KİŞİSEL REKOR!` banner'ı (amber arka plan)
- `+2.5 kg artış önerisi` pop-up'ı

### 6.3 Dinlenme Zamanlayıcısı
- Büyük sayı sayacı (geri sayım)
- Varsayılan süre: Set dinlenme süresi (antrenman datasından)
- Sesli alarm (HTML5 Audio `beep`)
- Alarm aktifken: Sayaç amber rengine döner
- Durdur / Yeniden başlat düğmeleri

### 6.4 Blok Geçişi
- Blok biterken `BLOK A TAMAMLANDI` kartı → `BLOK B'ye Geç` butonu

### 6.5 Superset
- İki egzersiz yan yana (A1 / A2 formatında) gösterilebilir

### 6.6 Antrenman Tamamlandı
- `WorkoutSummaryModal` açılır (bkz. [Bölüm 8](#8-antrenman-özeti-modalı))

---

## 7. Antrenman Akışı — MetCon Timer

**Tam ekran kondisyon zamanlayıcısı.**

### 7.1 Standart MetCon (AMRAP / EMOM / FOR TIME)
- Dairesel (SVG) sayaç görselleştirmesi
  - Boyut: ~250×250 px SVG circle
  - Renkler: Aktif → amber, Bitti → yeşil
- Büyük sayısal zamanlayıcı (ortada, `font-black tabular-nums`, ~52px)
- Üst kısımda MetCon tipi etiketi (ör. `AMRAP × 15 DAKİKA`)
- Kontroller: ▶ Başlat / ⏸ Durdur / ⏹ Sıfırla
- Egzersiz listesi (checkbox ile tamamlandı işaretleme)
- `MetconScoreLogger` — Tur/tekrar skoru giriş alanı

**10 saniyelik geri sayım** (başlamadan önce):
- Mavi renk, büyük sayı
- `Hazırlan` metni

### 7.2 TABATA Modu

Özel Tabata arayüzü (standart zamanlayıcıdan farklı):

| Faz | Renk | Metin |
|-----|------|-------|
| `idle` | Slate/Amber | `Hazır mısın?` |
| `countdown` | Mavi | `Hazırlan` + büyük sayaç |
| `work` | **Yeşil** (`green-400`) | `ÇALIŞ 💪` |
| `rest` | **Mavi** (`blue-400`) | `DİNLEN 😮‍💨` |
| `done` | Amber | `Tamamlandı 🏆` |

**Tabata Yapısı:**
- Çalış: 20 sn (yeşil)
- Dinlen: 10 sn (mavi)
- 8 tur / egzersiz
- Egzersiz sayısı: `Egzersiz X / Y`
- Tur sayacı: `Tur X / 8`
- SVG dairesel ilerleme çubuğu (`stroke-dashoffset` animasyonu)

---

## 8. Antrenman Özeti Modalı

`WorkoutSummaryModal` — Antrenman tamamlandıktan sonra açılır.

**İçerik:**
- `🏆 ANTRENMAN TAMAMLANDI!` başlık
- Toplam süre, toplam hacim (kg×tekrar), log edilen egzersiz sayısı — 3 istatistik kartı
- Egzersiz bazlı log özeti (her egzersiz: ağırlık, tekrar, RPE)
- **Kaydet butonu** — LocalStorage'a yazar, toast gösterir
- **Çıkış butonu** — Kaydedmeden kapat (onay modalı gerektirir)

---

## 9. Ekran 2 — Beslenme (Nutrition Tab)

### 9.1 Makro Özeti Kartı (`MacroSummaryCard`)

**Üst kısım:**
- Eğer bugün antrenman yapıldıysa: `+250 kcal antrenman bonusu` etiketi

**Solda — Donut (Halka) Grafik:**
- SVG tabanlı, Recharts değil
- Merkezde: Toplam kalori (sayı)
- Dilimler: Protein (kırmızı/pembe) / Karbonhidrat (sarı) / Yağ (mavi)
- Hedef değerler:
  - Kalori: 2100 kcal (antrenman günü: +250 = 2350)
  - Protein: 160g (+20 antrenman günü)
  - Karbonhidrat: 230g (+30 antrenman günü)
  - Yağ: 60g

**Sağda — İlerleme Çubukları:**
Herbiri için:
- Besin adı + ikon
- `bg-gradient-to-r` progress bar
- Tüketilen / Hedef değer
- Yüzde doluluk

### 9.2 Beslenme Modu Seçici

3 mod:
| Mod | Türkçe |
|-----|--------|
| `normal` | Normal |
| `vegan` | Vegan |
| `custom` | Özel |

### 9.3 Öğün Bölümleri (`MealSection`)

Her bölüm:
- Emoji + başlık + öğün saati
- Alt bölüm sınırı

**Bölümler:**
1. 🌅 **Kahvaltı** (07:00-09:00)
2. 🥜 **Ara Öğün** (10:30-11:30)
3. 🍽️ **Öğle** (12:30-14:00) *(opsiyonel)*
4. 🌙 **Akşam** (19:00-21:00)

### 9.4 Tarif Kartı (`RecipeCard`)

Genişletilebilir kart tasarımı:
- Kapalı: İsim + makro rozeti (P/C/Y/kcal) + `ChevronDown`
- Açık:
  - İçerik listesi (malzemeler)
  - Cinsiyet seçici (Erkek / Kadın) → farklı porsiyon makroları
  - YouTube bağlantısı (`PlayCircle` ikonu) — tarif videosu
  - Rozet: Kcal, Protein (g), Karbonhidrat (g), Yağ (g)

### 9.5 Ambrosia — AI Beslenme Önerisi

- Buton: `✨ Ambrosia ile Beslenme Planı Oluştur` (`Sparkles` ikonu)
- Yükleme: Spinner + `Ambrosia hazırlıyor...`
- Sonuç: Yeşil kenarlıklı glassmorphism kart
  - Başlık: `Utensils` ikonu + `Ambrosia - Beslenme Önerisi`
  - İçerik: `whitespace-pre-line` formatlı AI yanıtı

---

## 10. Ekran 3 — Calisthenics Tab

### 10.1 Filtre Çubuğu

**Hedef Kategorisi** (yatay kaydırmalı pill'ler):
| ID | Etiket |
|----|--------|
| `all` | Tümü |
| `pull` | Çekiş |
| `push` | İtiş |
| `core` | Core |
| `legs` | Bacak |
| `bars` | Barlar |
| `balance` | Denge |

**Seviye Filtresi:**
| ID | Etiket | Renk |
|----|--------|------|
| `all` | Tümü | — |
| `beginner` | Başlangıç | Yeşil |
| `intermediate` | Orta | Sarı |
| `advanced` | İleri | Turuncu |
| `elite` | Elite | Kırmızı |

### 10.2 Egzersiz Kartı

Genişletilebilir kart:
- **Kapalı:**
  - Egzersiz adı + seviye rozeti (renkli)
  - Kas grubu etiketleri (pill format)
  - `Öğrenildi` toggle checkbox
- **Açık:**
  - Açıklama metni
  - İpucu (`💡 İpucu:`)
  - İlerleme yolu (progression path) — sıralı adım listesi
  - `📹 Video izle` butonu → YouTube araması

### 10.3 Öğrenildi İşaretleme

- `localStorage` de saklanır
- Checkbox işaretlenince → `✅ "${isim}" öğrenildi olarak işaretlendi!` toast
- Tamamlanan egzersizler soluklaştırılır veya üzeri çizilir

---

## 11. Ekran 4 — İstatistik (Stats Tab)

Tümü `StatsTab.js` bileşeninde.

### 11.1 Üst Özet Kartları (4 adet)

Izgara (2×2):
1. **Toplam Antrenman** — Tarihçeden toplam sayı
2. **Aktif Seri (Streak)** — Ardışık gün sayısı 🔥
3. **Haftalık Hacim** — Kg toplam
4. **Kişisel Rekorlar** — PR sayısı

Her kart: Büyük sayı + birim + açıklama metni + ikon

### 11.2 İlerleme Grafiği (LineChart)

`Recharts` LineChart:
- X ekseni: Son 12 antrenmanın tarihleri
- Y ekseni: Ağırlık (kg)
- Çizgi rengi: `#f59e0b` (amber)
- Egzersiz seçici dropdown (tüm geçmişten egzersiz listesi)
- Tooltip: Tarih + ağırlık + tekrar

### 11.3 Hacim Grafiği (BarChart)

`Recharts` BarChart:
- X: Haftanın günleri
- Y: Toplam hacim (kg×tekrar)
- Bar rengi: Amber gradient

### 11.4 Kas Grubu Frekans Analizi

Son 7 gün:
- Her kas grubu için ilerleme çubuğu (Bacak / Sırt / Omuz / Göğüs / Kol / Core)
- Antrenman sayısı + frekans yüzdesi
- Renk kodlu: Az → kırmızı, Orta → sarı, Fazla → yeşil

### 11.5 Kişisel Rekorlar (PR) Listesi

Her egzersiz için:
- Egzersiz adı
- Maks. ağırlık (kg)
- Tarih
- RPE (varsa)
- `🏆` ikonu

### 11.6 Vücut Ağırlığı Takibi (Body Weight Tracker)

- Giriş alanı: kg
- Kaydet butonu
- Zaman serisi grafiği (LineChart)

---

## 12. Ekran 5 — Program Tab

Tümü `ProgramTab.js` bileşeninde.

### 12.1 Hazır Program Şablonları

4 şablon kartı (büyük, renkli):

| Şablon | Renk | Alt başlık |
|--------|------|-----------|
| Hipertrofi | Amber/Sarı | GVT + Hanik |
| Güç | Kırmızı | GVT + OVT |
| Atletizm | Mor | Prime + Hanik + Engine |
| Genel Kondisyon | Mavi/Yeşil | FBB + Engine + Hybrid |

Her kart: Tıklanınca seçilir → kenarlık amber rengi

### 12.2 Haftalık Program Takvimi

Günler (Pzt–Paz) için sürükle-bırak ya da tıklama ile antrenman modu atama:
- Boş gün: Gri, `+ Antrenman Ekle` butonu
- Dolu gün: Mod adı + ikon + `×` silme butonu

### 12.3 Gün Sayısı Seçici

3 / 4 / 5 gün seçeneği (pill düğme grubu)

### 12.4 Program Sıfırlama

`Programı Sıfırla` butonu → Onay modalı → Tüm programı temizle

---

## 13. Ekran 6 — Toparlanma (Recovery Tab)

`RecoveryCheckIn` bileşeni.

### 13.1 Günlük Check-in

3 slider (1–10 arası):
| Alan | Emoji | Açıklama |
|------|-------|---------|
| Uyku Kalitesi | 😴 | Dün gece uyku puanı |
| Ağrı/Yorgunluk | 💪 | Kas ağrısı seviyesi |
| Enerji Seviyesi | ⚡ | Genel enerji |

**Notlar alanı** — serbest metin (`<textarea>`)

**Kaydet butonu** → toast gösterir

### 13.2 Geçmiş Grafiği

Recharts LineChart:
- 3 çizgi: Uyku (mavi) / Ağrı (kırmızı) / Enerji (yeşil)
- Son 14 gün

---

## 14. Ekran 7 — Ayarlar (Settings Tab)

### 14.1 Tema Değiştirici
- Koyu / Açık mod toggle
- `Moon` / `Sun` ikonu (Lucide)

### 14.2 Veri Yönetimi
- `Tüm Geçmişi Sil` butonu → Onay modalı
- `Tüm Verileri Sıfırla` → LocalStorage tamamen temizle + onay modalı

### 14.3 Uygulama Bilgisi
- Versiyon numarası
- Lisans / açık kaynak bilgisi (opsiyonel)

---

## 15. Modal — Sistem Kitabesi (Guide)

`GuideModal` — Eğitim metodolojileri rehberi.

**Açılış:** Header'daki `BookOpen` ikonu
**Overlay:** `fixed inset-0 bg-black/80 backdrop-blur-xl animate-fade-in-scale`
**Boyut:** `max-w-2xl max-h-[85vh]`, kaydırılabilir içerik

### İçerik Bölümleri

1. **Giriş paragrafı** — Arete felsefesi
2. **Haftada 4 Gün "The Arete Split"** — Amber arka plan kartı
   - Pazartesi → Güç, Salı → Estetik, Perşembe → Prime, Cuma → Engine
3. **GVT (German Volume Training)** — Amber başlık `Crown` ikonu
   - 2 mini kart: `Nasıl Yapılır?` / `Yük & Dinlenme`
4. **FBB (Functional Bodybuilding)** — Mavi başlık `BicepsFlexed` ikonu
5. **İleri Antrenman Teknikleri** — Mor başlık `Zap` ikonu
   - Cluster Sets / Contrast Training / Wave Loading — sol kenarlıklı kartlar
6. **Tempo Okuma Rehberi (30X1)** — 4 kutu yan yana
   - `3` İniş / `0` Dip Bekleme / `X` Patlayıcı / `1` Tepe Sıkış

**Kapat butonu:** Sağ üst köşe `X`

---

## 16. Modal — Takvim (Calendar)

`CalendarModal` — Antrenman geçmişini takvimde gösterir.

**Açılış:** Header'daki takvim ikonu
**Konum:** Ekranın altından yukarı kayarak açılır (bottom-sheet)
- Mobile: `items-end`, `rounded-t-3xl`
- Desktop: Ortalanmış `rounded-2xl`

### İçerik

**Ay Navigasyonu:**
- Solda: `‹` (önceki ay)
- Ortada: Ay adı + yıl (Türkçe, ör. `Nisan 2026`)
- Sağda: `›` (sonraki ay)

**Hafta Gün Etiketleri:** `Pt Sa Ça Pe Cu Ct Pz`

**Günlük Izgara:**
- 7 sütunlu grid
- Her gün: `aspect-square rounded-xl`
  - Antrenman olan gün: `bg-slate-800/40` + altında amber nokta(lar)
  - Bugün: `border border-amber-500/40`
  - Seçili: `bg-amber-500/30 border-amber-500`
  - Boş gün: Soluk
- Antrenman sayısı kadar amber nokta (max 3)

**Seçili Gün Detayı:**
- Seçilince altta detay kartı açılır
- Antrenman adı, odak, egzersiz sayısı

---

## 17. Modal — Antrenman Geçmişi (History)

`HistoryModal` — Tüm geçmiş antrenmanların listesi.

### İçerik

**Arama çubuğu:** Tarih/antrenman adına göre filtre

**Antrenman Kartları** (kronolojik, en yeni üstte):
- Tarih (Türkçe format: `4 Nisan 2026 Cumartesi`)
- Antrenman adı + odak modu rozeti
- Kas grubu etiketleri
- Toplam hacim (opsiyonel)
- `Trash2` — Sil butonu → Onay modalı
- Genişletilebilir: Egzersiz detayları (ağırlık/tekrar/RPE)

**Tüm Geçmişi Sil:** Kırmızı buton + onay modalı

---

## 18. Modal — Kahin (AI Coach Chat)

`ChatModal` — Yapay zeka antrenman koçu.

**Açılış:** Alt nav üzerindeki `MessageSquare` FAB butonu

### Arayüz

**Başlık:**
- `Kahin` adı + `BrainCircuit` ikonu
- `Arete Antrenman Koçu` alt başlığı
- Sağ üst: `X` kapat

**Mesaj Listesi:**
- Kullanıcı mesajları: Sağa hizalı, `bg-amber-500/20 border-amber-500/30`
- Kahin cevapları: Sola hizalı, `bg-slate-800/60`
- Zaman damgası (opsiyonel)
- Yazıyor animasyonu: 3 nokta (`...`) pulsing

**Giriş Alanı:**
- `<textarea>` veya `<input>`
- `Send` ikonu butonu (`bg-amber-500`)
- **Rate limiting:** Mesaj arası minimum 8 saniye bekleme
  - Bekleme süresinde buton devre dışı + kalan süre gösterilir

**Soğuma Süresi Göstergesi:**
- `Kahin hazırlanıyor... (Xs)` formatında

---

## 19. Modal — 1RM Hesaplayıcı

`OneRMModal` — Tek Tekrar Maksimum hesabı.

**Açılış:** İstatistik ekranından veya antrenman akışından `Calculator` ikonu

### Arayüz

**Giriş:**
- Ağırlık (kg) alanı
- Tekrar sayısı alanı

**Sonuç:**
- **1RM değeri** — Epley formülü: `1RM = ağırlık × (1 + tekrar / 30)`
- Büyük, amber rengi sayı gösterimi

**Referans Tablosu:**

| Yüzde | Tekrar Eşdeğeri |
|-------|----------------|
| 100% | 1 tekrar |
| 95% | 2-3 tekrar |
| 90% | 4-5 tekrar |
| 85% | 6 tekrar |
| 80% | 8 tekrar |
| 75% | 10 tekrar |
| 70% | 12 tekrar |
| 65% | 15 tekrar |
| 60% | 20 tekrar |

Her satır: Yüzde → hesaplanan ağırlık (0.5 kg hassasiyetle yuvarlanmış)

---

## 20. Modal — Onboarding (İlk Açılış)

`OnboardingModal` — Uygulama ilk kez açıldığında gösterilir.

**Tetikleyici:** `localStorage`'da `arete_onboarding_done` yoksa açılır.
**Overlay:** Tam ekran `fixed inset-0`

### 4 Adım

| Adım | Başlık | İçerik |
|------|--------|--------|
| 1 | ARETE'ye Hoş Geldin | Arete logosu + felsefe |
| 2 | Antrenman Modu | Mod seçme & oluşturma akışı görseli |
| 3 | KR'larını Kaydet | Ağırlık/tekrar log arayüzü görseli |
| 4 | İlerlemeni Takip Et | Stats sekmesi tanıtımı |

**Navigasyon:**
- Alt kısımda ilerleme noktaları (4 adet, aktif = amber)
- `İleri` butonu (sağda)
- `Geri` butonu (solda, 1. adımda gizli)
- Son adımda `Başla` butonu → Modalı kapat + LocalStorage işareti yaz

---

## 21. Modal — Onay Diyaloğu (Confirm Modal)

`ConfirmModal` — Tehlikeli işlemler için onay ister.

**Görünüm:**
- Orta ekran, küçük kart
- Başlık (ör. `Tüm geçmişi silmek istiyor musun?`)
- Açıklama metni
- İki buton: `İptal` (gri) / `Evet, Sil` (kırmızı)

**Kullanım yerleri:**
- Antrenman geçmişi silme
- Program sıfırlama
- Tüm veri silme

---

## 22. Toast Bildirimleri

`Toast.jsx` + `useToast.js` sistemi.

### Konumlandırma
Sağ alt köşe (mobilde: merkez alt), `fixed`, `z-[200]`

### Toast Türleri

| Tür | Renk | İkon |
|-----|------|------|
| `success` | Yeşil (`green-500`) | `CheckCircle` |
| `error` | Kırmızı (`red-500`) | `AlertCircle` |
| `warning` | Sarı (`yellow-500`) | `AlertCircle` |
| `info` | Mavi (`blue-500`) | `Info` |

### Davranış
- Otomatik kaybolma: ~3 saniye
- `×` butonu ile manuel kapatma
- Slide-up animasyonu ile açılır

### Kullanım Örnekleri
- `✅ Toparlanma skoru kaydedildi!` → success
- `🏆 Zafer kaydedildi! Helal olsun!` → success
- `Kayıt silindi.` → success
- `⚠️ Kahin şu an yanıt veremiyor.` → warning

---

## 23. Veri Modelleri

### 23.1 Antrenman Objesi (`workout`)

```typescript
interface Workout {
  name: string;           // ör. "ARETE // GVT PUSH DAY"
  quote: string;          // Motivasyonel alıntı
  focus: string;          // 'gvt_push' | 'prime' | 'hybrid' | ...
  duration: 45 | 60 | 90;
  warmup: Exercise[];
  strength: StrengthBlock[];
  metcon?: Metcon;
  core: Exercise[];
  accessories?: Exercise[];
  swim?: SwimExercise;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  description?: string;
  image?: string;
  rest?: number;          // saniye
  tempo?: string;         // ör. "30X1"
  note?: string;
}

interface StrengthBlock {
  type: string;           // "Main Power" | "Hypertrophy" | ...
  exercises: Exercise[];
}

interface Metcon {
  type: 'AMRAP' | 'EMOM' | 'FOR TIME' | 'TABATA';
  structure: string;      // ör. "AMRAP × 15 Dakika"
  exercises: MetconExercise[];
}
```

### 23.2 Geçmiş Kaydı (`history entry`)

```typescript
interface HistoryEntry {
  id: number;             // timestamp
  date: string;           // Türkçe tarih formatı
  timestamp: number;
  workoutName: string;
  focus: string;
  exercises: {
    [exerciseName: string]: {
      weight: number;
      reps: number;
      rpe?: number;
      note?: string;
    }
  };
  workoutData: Workout;
}
```

### 23.3 Konfigürasyon (`config`)

```typescript
interface Config {
  focus: string;
  poolAccess: boolean;
  duration: '45' | '60' | '90';
}
```

### 23.4 Toparlanma (`recovery`)

```typescript
interface RecoveryEntry {
  date: string;
  sleep: number;          // 1-10
  soreness: number;       // 1-10
  energy: number;         // 1-10
  notes?: string;
}
```

---

## 24. API Katmanı

### Endpoint

```
POST /api/gemini
```

### İstek

```json
{
  "prompt": "Kullanıcı sorusu",
  "systemInstruction": "Sistem prompt (opsiyonel)"
}
```

### Yanıt (Başarılı)

```json
{
  "text": "AI yanıt metni"
}
```

### Yanıt (Hata)

```json
{
  "error": "Hata açıklaması"
}
```

### AI Modeli

- **Sağlayıcı:** Groq API
- **Model:** `llama-3.3-70b-versatile`
- **Max token:** 1024
- **Sıcaklık:** 0.7

### Kullanım Senaryoları

| Senaryo | System Prompt |
|---------|---------------|
| Kahin (antrenman koçu) | Arete koçu, kısa-disiplinli, Türkçe, max 3 paragraf |
| Ambrosia (beslenme planı) | Makro hedeflere göre Türk mutfağı yemek planı |

### Hata Durumları (UI)

- Ağ hatası: `⚠️ Bağlantı hatası. İnternet bağlantını kontrol et.`
- API hatası: `⚠️ Kahin şu an yanıt veremiyor.`

---

## 25. LocalStorage Anahtarları

| Anahtar | Açıklama | Veri Tipi |
|---------|----------|-----------|
| `arete_history` | Tüm antrenman geçmişi | `HistoryEntry[]` (JSON) |
| `arete_config` | Kullanıcı antrenman konfigürasyonu | `Config` (JSON) |
| `arete_program` | Haftalık program takvimi | `Program` (JSON) |
| `arete_recovery` | Toparlanma check-in geçmişi | `RecoveryEntry[]` (JSON) |
| `arete_prs` | Kişisel rekorlar | `{ [exercise]: { weight, reps, date } }` |
| `arete_calisthenics_done` | Tamamlanan calisthenics hareketleri | `string[]` |
| `arete_body_weight` | Vücut ağırlığı geçmişi | `{ date, weight }[]` |
| `arete_onboarding_done` | Onboarding tamamlandı mı | `'true'` |
| `arete_dark_mode` | Tema tercihi | `'true'` / `'false'` |

---

## 26. Animasyonlar & Geçiş Efektleri

| Animasyon | Nerede | Tetikleyici |
|-----------|--------|-------------|
| `fade-in-scale` | Tüm modaller | Modal açılışı |
| `slide-up` | Toast bildirimleri | Toast gösterimi |
| `shimmer` | Yükleme durumları | API bekleme |
| `pulse-ring` | Aktif timer / PR anı | — |
| `float` | Logo veya dekoratif öğeler | Sayfa yüklenince |
| `gradient-shift` | Arka plan | Sürekli |
| `progress` | Progress barları | Değer değişimi |
| Sayaç geri sayımı | MetCon / Dinlenme timer | Her saniye |
| `stroke-dashoffset` | SVG dairesel progress | Timer tick |
| `active:scale-90` | Takvim gün butonları | Dokunma/tıklama |
| `active:scale-95` | Genel butonlar | Dokunma/tıklama |
| `hover:translate-y-[-2px]` | Kart hover (`.card-hover`) | Hover |

---

## 27. Erişilebilirlik & Responsive Notlar

### Responsive Strateji
- **Mobil öncelikli** (mobile-first): Tüm layout telefon ekranına göre tasarlanmıştır
- Maksimum kart genişliği: `max-w-md` veya `max-w-2xl` (modal)
- Alt navigasyon: Yalnızca mobilde sabit `fixed bottom-0`

### Bottom Navigation Padding
Sayfanın içeriği alt navigasyonun (`h-[68px]`) altına kaymayacak şekilde `pb-[80px]` veya benzeri alt padding eklenir.

### Dokunma Hedefleri
- Minimum 44×44px (iOS HIG standardı)
- `h-[68px]` alt nav düğmeleri ✓

### Modaller
- Mobilde: Bottom-sheet (alttan açılan) — `rounded-t-3xl items-end`
- Masaüstünde: Ortalanmış — `rounded-2xl items-center`

### Tema (Dark / Light)
- Tüm bileşenler hem karanlık hem açık modda çalışır
- `darkMode` prop'u veya `ThemeContext` ile yönetilir
- `ThemeContext` — React Context API, tüm alt bileşenlere iletilir

### Animasyon Tercihi
`prefers-reduced-motion` medya sorgusu için animasyonları devre dışı bırakma tercih edilir (Tailwind varsayılan desteği).

### Klavye Erişimi
- Modal kapatma: `Escape` tuşu
- Form gönderme: `Enter` tuşu (sohbet)

---

*Bu doküman, ARETE uygulamasının mevcut kaynak kodundan türetilmiştir. Uygulama tamamen Türkçe dilde olup offline-first mimarisiyle çalışmaktadır.*
