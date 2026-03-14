// src/data/calisthenicsData.js

export const CALISTHENICS_DB = [
  {
    category: "ÇEKİŞ HAREKETLERİ",
    moves: [
      {
        name: "Dead Hang", level: "beginner", muscles: ["Önkol","Omuz"],
        desc: "Barfiks çubuğuna asılı kalmak. Kavrama gücü ve omuz stabilitesi için temel.",
        tip: "30–60 saniye hedefle. Aktif omuzları koru — skapulayı aşağı çek.",
        video: "https://www.youtube.com/results?search_query=dead+hang+tutorial",
        progression: ["Dead Hang","Scapular Pull-up","Negative Pull-up","Pull-up (Barfiks)"]
      },
      {
        name: "Scapular Pull-up", level: "beginner", muscles: ["Sırt","Trapez"],
        desc: "Kolları bükmeden sadece kürek kemiklerini aşağı çekerek kısa kaldırış.",
        tip: "Tam barfiks için gereken kas aktivasyonunu öğretir.",
        video: "https://www.youtube.com/results?search_query=scapular+pullup+tutorial",
        progression: ["Dead Hang","Scapular Pull-up","Negative Pull-up","Pull-up (Barfiks)"]
      },
      {
        name: "Negative Pull-up", level: "beginner", muscles: ["Sırt","Bicep"],
        desc: "Üst pozisyondan (çene çubukta) yavaşça inme hareketi.",
        tip: "3–5 saniyelik yavaş iniş hedefle. Eksantrik güç geliştirir.",
        video: "https://www.youtube.com/results?search_query=negative+pullup+tutorial",
        progression: ["Dead Hang","Scapular Pull-up","Negative Pull-up","Pull-up (Barfiks)"]
      },
      {
        name: "Australian Pull-up", level: "beginner", muscles: ["Sırt","Bicep","Kor"],
        desc: "Alçak çubukta eğik pozisyonda göğsü çubuğa çekme.",
        tip: "Vücudu düz bir tahta gibi tut. Ayakları ileri aldıkça zorlaşır.",
        video: "https://www.youtube.com/results?search_query=australian+pullup+inverted+row",
        progression: ["Australian Pull-up","Pull-up (Barfiks)","Archer Pull-up","One Arm Pull-up"]
      },
      {
        name: "Pull-up (Barfiks)", level: "intermediate", muscles: ["Latissimus","Bicep","Kor"],
        desc: "Geniş tutuşla tam barfiks. Üst vücut çekiş hareketinin temeli.",
        tip: "Çeneni çubuğun üzerine çıkar, tam uzanarak in. Sallanma yok.",
        video: "https://www.youtube.com/results?search_query=pull+up+proper+form+tutorial",
        progression: ["Negative Pull-up","Pull-up (Barfiks)","Archer Pull-up","One Arm Pull-up"]
      },
      {
        name: "Chin-up", level: "intermediate", muscles: ["Bicep","Latissimus"],
        desc: "Ters tutuş (supinated) ile barfiks. Bicep aktivasyonu daha yüksek.",
        tip: "Pull-up'tan daha kolay — barfiks yolunda iyi bir köprü hareketi.",
        video: "https://www.youtube.com/results?search_query=chin+up+tutorial+form",
        progression: ["Negative Pull-up","Chin-up","Pull-up (Barfiks)","Archer Pull-up"]
      },
      {
        name: "Archer Pull-up", level: "advanced", muscles: ["Latissimus","Bicep","Ön Kol"],
        desc: "Her tekrarda tek kola yük vererek yapılan asimetrik barfiks.",
        tip: "Tek kol barfikse hazırlık. Yavaş ve kontrollü yap.",
        video: "https://www.youtube.com/results?search_query=archer+pullup+tutorial",
        progression: ["Pull-up (Barfiks)","Archer Pull-up","One Arm Pull-up"]
      },
      {
        name: "Typewriter Pull-up", level: "advanced", muscles: ["Sırt","Bicep","Kor"],
        desc: "Üstte yatay hareketle bir koldan diğerine geçiş.",
        tip: "Tam kontrol gerektirir. Önce üstte tutunmayı güçlendir.",
        video: "https://www.youtube.com/results?search_query=typewriter+pullup+tutorial",
        progression: ["Pull-up (Barfiks)","Typewriter Pull-up","One Arm Pull-up"]
      },
      {
        name: "One Arm Pull-up", level: "elite", muscles: ["Latissimus","Bicep","Kor"],
        desc: "Calisthenics'in en prestijli hareketlerinden biri. Tek kolla tam barfiks.",
        tip: "Genellikle 2–3 yıl antrenman gerektirir. Archer pull-up ile hazırlan.",
        video: "https://www.youtube.com/results?search_query=one+arm+pullup+tutorial+progression",
        progression: ["Pull-up (Barfiks)","Archer Pull-up","One Arm Pull-up"]
      },
    ]
  },
  {
    category: "İTİŞ HAREKETLERİ",
    moves: [
      {
        name: "Wall Push-up", level: "beginner", muscles: ["Göğüs","Tricep","Omuz"],
        desc: "Duvara karşı yapılan şınav. En kolay itme hareketi.",
        tip: "Başlangıç için mükemmel. Vücudu dik tut, kalçayı öne itme.",
        video: "https://www.youtube.com/results?search_query=wall+push+up+tutorial",
        progression: ["Wall Push-up","Incline Push-up","Push-up","Diamond Push-up"]
      },
      {
        name: "Incline Push-up", level: "beginner", muscles: ["Göğüs","Tricep"],
        desc: "Eller yüksek yüzeyde (masa, step) şınav.",
        tip: "Standart şınavdan kolaydır. Zemin şınavına geçiş için kullan.",
        video: "https://www.youtube.com/results?search_query=incline+push+up+tutorial",
        progression: ["Wall Push-up","Incline Push-up","Push-up","Archer Push-up"]
      },
      {
        name: "Push-up", level: "beginner", muscles: ["Göğüs","Tricep","Omuz","Kor"],
        desc: "Temel şınav. Kollar omuz genişliğinde, vücut düz çizgi.",
        tip: "Göğsün yere değmesini hedefle. Full ROM kritik.",
        video: "https://www.youtube.com/results?search_query=push+up+perfect+form",
        progression: ["Incline Push-up","Push-up","Archer Push-up","Pseudo Planche Push-up"]
      },
      {
        name: "Diamond Push-up", level: "intermediate", muscles: ["Tricep","Göğüs"],
        desc: "Eller elmas şekli oluşturacak şekilde içe yakın şınav.",
        tip: "Tricep aktivasyonu maksimum. Dirsekler gövdeye yakın kalmalı.",
        video: "https://www.youtube.com/results?search_query=diamond+push+up+tutorial",
        progression: ["Push-up","Diamond Push-up","Handstand Push-up"]
      },
      {
        name: "Archer Push-up", level: "intermediate", muscles: ["Göğüs","Tricep","Kor"],
        desc: "Her tekrarda tek kola yük vererek asimetrik şınav.",
        tip: "Tek kol şınavına hazırlık. Uzanan kol düz kalmalı.",
        video: "https://www.youtube.com/results?search_query=archer+push+up+tutorial",
        progression: ["Push-up","Archer Push-up","Pseudo Planche Push-up","Full Planche"]
      },
      {
        name: "Pike Push-up", level: "intermediate", muscles: ["Omuz","Tricep"],
        desc: "Baş aşağı (ters V) pozisyonda omuz odaklı şınav.",
        tip: "El üstü duruşa ve handstand push-up'a hazırlık hareketi.",
        video: "https://www.youtube.com/results?search_query=pike+push+up+tutorial",
        progression: ["Pike Push-up","Handstand (Duvar)","Handstand Push-up"]
      },
      {
        name: "Pseudo Planche Push-up", level: "advanced", muscles: ["Göğüs","Omuz","Tricep","Kor"],
        desc: "Eller kalça hizasında öne dönük; vücut eğik planche benzeri şınav.",
        tip: "Planche'a hazırlık. Bileklere aşırı yük biner, dikkatli ilerle.",
        video: "https://www.youtube.com/results?search_query=pseudo+planche+push+up+tutorial",
        progression: ["Archer Push-up","Pseudo Planche Push-up","Straddle Planche","Full Planche"]
      },
      {
        name: "Handstand Push-up", level: "advanced", muscles: ["Omuz","Tricep","Üst Sırt"],
        desc: "El üstü duruşta baş yere değerek yapılan şınav.",
        tip: "Önce duvara yaslanarak (wall HSPU) öğren.",
        video: "https://www.youtube.com/results?search_query=handstand+push+up+tutorial+beginner",
        progression: ["Pike Push-up","Handstand (Duvar)","Handstand Push-up","Freestanding Handstand"]
      },
      {
        name: "Straddle Planche", level: "elite", muscles: ["Omuz","Göğüs","Kor","Tricep"],
        desc: "Bacaklar açık, yerden yüksekte yatay askı pozisyonu.",
        tip: "Full planche'tan biraz daha kolay. Uzun hazırlık süreci gerektirir.",
        video: "https://www.youtube.com/results?search_query=straddle+planche+tutorial+progression",
        progression: ["Pseudo Planche Push-up","Straddle Planche","Full Planche"]
      },
      {
        name: "Full Planche", level: "elite", muscles: ["Omuz","Göğüs","Kor","Tricep"],
        desc: "Tüm vücut yerden yüksekte tam yatay pozisyon. Elit seviye.",
        tip: "Genellikle 3–5 yıl özel çalışma gerektirir.",
        video: "https://www.youtube.com/results?search_query=full+planche+tutorial+progression",
        progression: ["Straddle Planche","Full Planche"]
      },
    ]
  },
  {
    category: "PARALEL BAR HAREKETLERİ",
    moves: [
      {
        name: "Bench Dip", level: "beginner", muscles: ["Tricep","Omuz","Göğüs"],
        desc: "Banka veya sandalyeye dayanarak tricep dip.",
        tip: "Geniş açı omuz için riskli olabilir — dirsekler yakın tut.",
        video: "https://www.youtube.com/results?search_query=bench+dip+tutorial+form",
        progression: ["Bench Dip","Dip (Paralel Bar)","Ring Dip"]
      },
      {
        name: "Parallel Bar Support Hold", level: "beginner", muscles: ["Tricep","Omuz","Kor"],
        desc: "Paralel barda kollar düz, vücut askıda statik bekleme.",
        tip: "L-Sit ve dip için temel. 30–60 saniye hedefle.",
        video: "https://www.youtube.com/results?search_query=parallel+bar+support+hold+tutorial",
        progression: ["Parallel Bar Support Hold","Dip (Paralel Bar)","L-Sit (Paralel Bar)"]
      },
      {
        name: "Dip (Paralel Bar)", level: "intermediate", muscles: ["Tricep","Göğüs","Omuz"],
        desc: "Paralel barlarda tam dip. İtici hareketlerin temeli.",
        tip: "Göğsü öne eğersen göğüs odaklı; dik durursan tricep odaklı.",
        video: "https://www.youtube.com/results?search_query=parallel+bar+dip+tutorial+form",
        progression: ["Bench Dip","Dip (Paralel Bar)","Ring Dip","Bar Muscle-up"]
      },
      {
        name: "L-Sit (Paralel Bar)", level: "intermediate", muscles: ["Kor","Hip Flexor","Tricep"],
        desc: "Paralel barda kollar düz, bacaklar yatay pozisyonda statik bekleme.",
        tip: "Önce tuck L-sit ile başla. Bacakları yavaşça uzat.",
        video: "https://www.youtube.com/results?search_query=l+sit+parallel+bars+tutorial",
        progression: ["Parallel Bar Support Hold","L-Sit (Paralel Bar)","Straddle L-Sit","V-Sit"]
      },
      {
        name: "Straddle L-Sit", level: "advanced", muscles: ["Kor","Hip Flexor","Tricep","Omuz"],
        desc: "L-Sit pozisyonunda bacaklar yana açık. Full L-Sit'ten daha kolay.",
        tip: "Bacak açıklığı arttıkça kolaylaşır. Hip flexor esnekliği kritik.",
        video: "https://www.youtube.com/results?search_query=straddle+l+sit+tutorial",
        progression: ["L-Sit (Paralel Bar)","Straddle L-Sit","V-Sit"]
      },
      {
        name: "Korean Dip", level: "advanced", muscles: ["Omuz","Tricep","Sırt"],
        desc: "Arkaya yaslanarak ring veya çubukta dip.",
        tip: "Omuz mobilitesi gerektirir. Back lever'a hazırlık olarak kullanılır.",
        video: "https://www.youtube.com/results?search_query=korean+dip+tutorial+calisthenics",
        progression: ["Dip (Paralel Bar)","Korean Dip","Ring Dip"]
      },
      {
        name: "V-Sit", level: "advanced", muscles: ["Kor","Hip Flexor","Tricep","Omuz"],
        desc: "L-Sit'in ileri versiyonu — bacaklar 45° yukarı açılı V pozisyonu.",
        tip: "Güçlü kor ve mükemmel hip flexor esnekliği gerektirir.",
        video: "https://www.youtube.com/results?search_query=v+sit+tutorial+calisthenics",
        progression: ["L-Sit (Paralel Bar)","Straddle L-Sit","V-Sit","Manna"]
      },
      {
        name: "Bar Muscle-up", level: "advanced", muscles: ["Sırt","Göğüs","Tricep","Kor"],
        desc: "Barfiks üstü geçerek çubuğun üzerine çıkma.",
        tip: "Kipping veya strict olarak yapılır. Strict daha zor ve daha değerli.",
        video: "https://www.youtube.com/results?search_query=bar+muscle+up+tutorial+strict",
        progression: ["Pull-up (Barfiks)","Dip (Paralel Bar)","Bar Muscle-up","Ring Muscle-up"]
      },
      {
        name: "Ring Dip", level: "advanced", muscles: ["Göğüs","Tricep","Omuz","Kor"],
        desc: "Halkalarda dip. Dengesiz yüzey kas stabilizasyonunu ikiye katlar.",
        tip: "Ringleri dönme olmadan sabit tut. Bar dip'ten çok daha zor.",
        video: "https://www.youtube.com/results?search_query=ring+dip+tutorial+form",
        progression: ["Dip (Paralel Bar)","Ring Dip","Ring Muscle-up"]
      },
      {
        name: "Manna", level: "elite", muscles: ["Kor","Omuz","Hip Flexor","Tricep"],
        desc: "V-Sit'in ötesi — bacaklar baş üstünde yatay pozisyon. Nadir görülen elit hareket.",
        tip: "Son derece gelişmiş omuz mobilitesi ve kor gücü gerektirir. Yıllarca çalışma ister.",
        video: "https://www.youtube.com/results?search_query=manna+calisthenics+tutorial",
        progression: ["V-Sit","Manna"]
      },
      {
        name: "Ring Muscle-up", level: "elite", muscles: ["Sırt","Göğüs","Tricep","Bicep"],
        desc: "Halkada barfiks → geçiş → dip. En teknik calisthenics hareketlerinden biri.",
        tip: "Bar muscle-up'ı önce öğren. Geçiş (transition) kritik nokta.",
        video: "https://www.youtube.com/results?search_query=ring+muscle+up+tutorial+progression",
        progression: ["Bar Muscle-up","Ring Dip","Ring Muscle-up"]
      },
    ]
  },
  {
    category: "OMUZ & DENGE HAREKETLERİ",
    moves: [
      {
        name: "Handstand (Duvar)", level: "beginner", muscles: ["Omuz","Kor","Tricep"],
        desc: "Duvara yaslanarak el üstü durma. Denge ve omuz kuvveti.",
        tip: "Günde 3×30s tut. Gözleri yere değil, eller arasına bak.",
        video: "https://www.youtube.com/results?search_query=wall+handstand+tutorial+beginner",
        progression: ["Handstand (Duvar)","Freestanding Handstand","Handstand Walk"]
      },
      {
        name: "Crow Pose (Karga)", level: "intermediate", muscles: ["Kor","Omuz","Tricep"],
        desc: "Dizleri kolların üzerine koyarak öne eğilim dengesi.",
        tip: "Ağırlık merkezi öne kaymadan önce yavaşça aktar.",
        video: "https://www.youtube.com/results?search_query=crow+pose+tutorial+calisthenics",
        progression: ["Crow Pose (Karga)","Freestanding Handstand"]
      },
      {
        name: "Freestanding Handstand", level: "advanced", muscles: ["Omuz","Kor","Bilek"],
        desc: "Duvarsız el üstü durma. Denge ve kor kontrolü.",
        tip: "Günde tutarlı pratik şart. Düz tuş pozisyonu (hollow) kritik.",
        video: "https://www.youtube.com/results?search_query=freestanding+handstand+tutorial",
        progression: ["Handstand (Duvar)","Freestanding Handstand","Handstand Walk"]
      },
      {
        name: "Handstand Walk", level: "elite", muscles: ["Omuz","Kor","Denge"],
        desc: "El üstü yürüme.",
        tip: "Freestanding handstand'ı önce güçlü kurmak gerekir.",
        video: "https://www.youtube.com/results?search_query=handstand+walk+tutorial",
        progression: ["Freestanding Handstand","Handstand Walk"]
      },
    ]
  },
  {
    category: "KOR & STATİK HAREKETLER",
    moves: [
      {
        name: "Plank", level: "beginner", muscles: ["Kor","Omuz","Gluteal"],
        desc: "Ön plank. Temel kor stabilitesi egzersizi.",
        tip: "60s üzerini hedefle. Kalça ne yüksek ne alçak — düz çizgi.",
        video: "https://www.youtube.com/results?search_query=plank+proper+form+tutorial",
        progression: ["Plank","L-Sit (Paralel Bar)","Dragon Flag"]
      },
      {
        name: "Hollow Body Hold", level: "beginner", muscles: ["Kor","Hip Flexor"],
        desc: "Sırtüstü içbükey vücut pozisyonu. Jimnastiğin temel kor hareketi.",
        tip: "Bel yere değmemeli. Nefes kontrolü önemli.",
        video: "https://www.youtube.com/results?search_query=hollow+body+hold+tutorial",
        progression: ["Hollow Body Hold","L-Sit (Paralel Bar)","Front Lever"]
      },
      {
        name: "Dragon Flag", level: "advanced", muscles: ["Kor","Latissimus","Gluteal"],
        desc: "Sırtüstü bankta tüm vücudu omuzdan kaldırıp yavaşça indirme.",
        tip: "Rocky filminden popüler oldu. Negatiflerle başla.",
        video: "https://www.youtube.com/results?search_query=dragon+flag+tutorial+progression",
        progression: ["Plank","Dragon Flag","Front Lever"]
      },
      {
        name: "Front Lever", level: "elite", muscles: ["Latissimus","Kor","Omuz"],
        desc: "Çubukta asılı tam yatay vücut pozisyonu — statik güç harikası.",
        tip: "Tuck → advanced tuck → straddle → full şeklinde ilerle.",
        video: "https://www.youtube.com/results?search_query=front+lever+tutorial+progression",
        progression: ["L-Sit (Paralel Bar)","Dragon Flag","Front Lever"]
      },
      {
        name: "Back Lever", level: "elite", muscles: ["Sırt","Bicep","Kor"],
        desc: "Çubukta yüz aşağı yatay pozisyon.",
        tip: "Front lever'dan biraz daha kolay. Skin the cat ile başla.",
        video: "https://www.youtube.com/results?search_query=back+lever+tutorial+progression",
        progression: ["L-Sit (Paralel Bar)","Back Lever","Front Lever"]
      },
    ]
  },
  {
    category: "YER HAREKETLERİ (PLANCHE)",
    moves: [
      {
        name: "Tuck Planche", level: "intermediate", muscles: ["Omuz","Göğüs","Kor","Tricep"],
        desc: "Dizler göğse çekilmiş, yerden yüksekte yatay pozisyon. Planche serisinin başlangıcı.",
        tip: "Önce paralel barda dene. Bilekleri öne dönük tut.",
        video: "https://www.youtube.com/results?search_query=tuck+planche+tutorial+beginner",
        progression: ["Pseudo Planche Push-up","Tuck Planche","Advanced Tuck Planche","Straddle Planche","Full Planche"]
      },
      {
        name: "Advanced Tuck Planche", level: "advanced", muscles: ["Omuz","Göğüs","Kor","Tricep"],
        desc: "Tuck planche'ta sırt düzleşir, kalça hafif yükselir.",
        tip: "Tuck planche'ı 10+ saniye tutabiliyorsan geç.",
        video: "https://www.youtube.com/results?search_query=advanced+tuck+planche+tutorial",
        progression: ["Tuck Planche","Advanced Tuck Planche","Straddle Planche","Full Planche"]
      },
      {
        name: "Planche Lean", level: "intermediate", muscles: ["Omuz","Göğüs","Kor"],
        desc: "Push-up pozisyonunda gövdeyi ileri eğerek omuz üstüne yük bindirme.",
        tip: "Pseudo planche push-up ile kombinle. Günlük 3×30sn.",
        video: "https://www.youtube.com/results?search_query=planche+lean+tutorial",
        progression: ["Pseudo Planche Push-up","Planche Lean","Tuck Planche","Full Planche"]
      },
    ]
  },
  {
    category: "BACAK HAREKETLERİ",
    moves: [
      {
        name: "Squat (Vücut Ağırlıklı)", level: "beginner", muscles: ["Quadriceps","Gluteal","Hamstring"],
        desc: "Temel çömelme. Bacak egzersizlerinin temeli.",
        tip: "Topuklar yerde kalmalı. Dizler ayak uçlarını takip etmeli.",
        video: "https://www.youtube.com/results?search_query=bodyweight+squat+proper+form",
        progression: ["Squat (Vücut Ağırlıklı)","Bulgarian Split Squat","Pistol Squat"]
      },
      {
        name: "Lunge", level: "beginner", muscles: ["Quadriceps","Gluteal","Hamstring"],
        desc: "Tek adım öne alarak çömelme.",
        tip: "Diz yere değmeye yaklaşmalı ama değmemeli. Gövde dik.",
        video: "https://www.youtube.com/results?search_query=lunge+proper+form+tutorial",
        progression: ["Lunge","Bulgarian Split Squat","Pistol Squat"]
      },
      {
        name: "Glute Bridge", level: "beginner", muscles: ["Gluteal","Hamstring","Kor"],
        desc: "Sırtüstü kalça kaldırma. Gluteal aktivasyonu için temel.",
        tip: "Üstte 1–2s tut ve kasılı bırak.",
        video: "https://www.youtube.com/results?search_query=glute+bridge+tutorial+form",
        progression: ["Glute Bridge","Nordic Curl"]
      },
      {
        name: "Jump Squat", level: "intermediate", muscles: ["Quadriceps","Gluteal","Baldır"],
        desc: "Patlayıcı squat — zıplayarak çömelme.",
        tip: "İnişte diz üzerinde yumuşak iniş (soft landing) şart.",
        video: "https://www.youtube.com/results?search_query=jump+squat+tutorial+form",
        progression: ["Squat (Vücut Ağırlıklı)","Jump Squat","Pistol Squat"]
      },
      {
        name: "Bulgarian Split Squat", level: "intermediate", muscles: ["Quadriceps","Gluteal","Hamstring"],
        desc: "Arka ayak yüksek yüzeyde tek bacak squat.",
        tip: "En etkili vücut ağırlığı bacak hareketlerinden biri.",
        video: "https://www.youtube.com/results?search_query=bulgarian+split+squat+tutorial",
        progression: ["Lunge","Bulgarian Split Squat","Pistol Squat"]
      },
      {
        name: "Pistol Squat", level: "advanced", muscles: ["Quadriceps","Gluteal","Kor"],
        desc: "Tek bacak üzerinde tam çömelme.",
        tip: "Önce destekli (TRX, kapı kolu) veya negatifle başla.",
        video: "https://www.youtube.com/results?search_query=pistol+squat+tutorial+progression",
        progression: ["Bulgarian Split Squat","Pistol Squat","Shrimp Squat"]
      },
      {
        name: "Nordic Curl", level: "advanced", muscles: ["Hamstring","Gluteal"],
        desc: "Dizler sabitken öne doğru düşüş — hamstring ekzantrik güç.",
        tip: "Hamstring sakatlığı önlemede en etkili hareketlerden biri.",
        video: "https://www.youtube.com/results?search_query=nordic+curl+tutorial+progression",
        progression: ["Glute Bridge","Nordic Curl"]
      },
      {
        name: "Shrimp Squat", level: "elite", muscles: ["Quadriceps","Gluteal","Denge"],
        desc: "Arka ayak elle tutularak yapılan ileri tek bacak squat.",
        tip: "Pistol squat'tan farklı denge ve esneklik gerektirir.",
        video: "https://www.youtube.com/results?search_query=shrimp+squat+tutorial+progression",
        progression: ["Pistol Squat","Shrimp Squat"]
      },
    ]
  },
  {
    category: "AKROBATİK & DİNAMİK",
    moves: [
      {
        name: "Cartwheel (Amuda Yan Dönüş)", level: "beginner", muscles: ["Omuz","Kor","Denge"],
        desc: "Yana doğru el üstünden geçiş. Akrobatik hareketlerin temeli.",
        tip: "Düz bir çizgi üzerinde uygula. Kollar ve bacaklar tam açık.",
        video: "https://www.youtube.com/results?search_query=cartwheel+tutorial+beginner",
        progression: ["Cartwheel (Amuda Yan Dönüş)","Round-off","Back Handspring"]
      },
      {
        name: "Round-off", level: "intermediate", muscles: ["Omuz","Kor","Bacak"],
        desc: "Cartwheel'in patlayıcı versiyonu — iki ayakla iniş yapılır.",
        tip: "Back handspring ve flik-flak için temel. Hızlı ve güçlü at.",
        video: "https://www.youtube.com/results?search_query=round+off+tutorial+gymnastics",
        progression: ["Cartwheel (Amuda Yan Dönüş)","Round-off","Back Handspring"]
      },
      {
        name: "Kip-up (Yerden Kalkış)", level: "intermediate", muscles: ["Kor","Kalça","Omuz"],
        desc: "Sırtüstü yatarken patlayıcı kalça itişiyle ayağa kalkma.",
        tip: "Hollow body pozisyonundan başla. Momentum kritik.",
        video: "https://www.youtube.com/results?search_query=kip+up+tutorial+martial+arts",
        progression: ["Hollow Body Hold","Kip-up (Yerden Kalkış)"]
      },
      {
        name: "Back Handspring", level: "advanced", muscles: ["Omuz","Kor","Bacak","Bilek"],
        desc: "Geriye doğru el üstünden patlayıcı geçiş.",
        tip: "Mutlaka uzman gözetiminde öğren. Round-off'u önce güçlendir.",
        video: "https://www.youtube.com/results?search_query=back+handspring+tutorial+step+by+step",
        progression: ["Round-off","Back Handspring"]
      },
      {
        name: "Skin the Cat", level: "intermediate", muscles: ["Sırt","Omuz","Kor"],
        desc: "Çubukta asılıyken bacakları başın üzerinden çevirerek arka askıya geçiş.",
        tip: "Back lever ve front lever için mükemmel hazırlık. Omuz mobilite çalışması.",
        video: "https://www.youtube.com/results?search_query=skin+the+cat+tutorial+calisthenics",
        progression: ["Dead Hang","Skin the Cat","Back Lever","Front Lever"]
      },
      {
        name: "Human Flag", level: "elite", muscles: ["Kor","Omuz","Latissimus","Obliqueler"],
        desc: "Dikey çubuğa tutunarak yatay vücut pozisyonu. Calisthenics'in ikonik hareketi.",
        tip: "Genellikle 2–4 yıl çalışma gerektirir. Yan plank ve L-sit ile güçlen.",
        video: "https://www.youtube.com/results?search_query=human+flag+tutorial+progression",
        progression: ["Dragon Flag","Human Flag"]
      },
    ]
  },
];

// Seviye renk ve etiket mapping
export const LEVEL_CONFIG = {
  beginner:     { label: 'Başlangıç', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',    border: 'rgba(34,197,94,0.25)'    },
  intermediate: { label: 'Orta',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.25)'   },
  advanced:     { label: 'İleri',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.25)'    },
  elite:        { label: 'Elite',     color: '#a855f7', bg: 'rgba(168,85,247,0.12)',   border: 'rgba(168,85,247,0.25)'   },
};

// Antrenman oluşturucu için hedef → kategori mapping
export const GOAL_CATEGORY_MAP = {
  pull:     ["ÇEKİŞ HAREKETLERİ"],
  push:     ["İTİŞ HAREKETLERİ", "YER HAREKETLERİ (PLANCHE)"],
  core:     ["KOR & STATİK HAREKETLER", "PARALEL BAR HAREKETLERİ"],
  legs:     ["BACAK HAREKETLERİ"],
  bars:     ["PARALEL BAR HAREKETLERİ"],
  balance:  ["OMUZ & DENGE HAREKETLERİ", "AKROBATİK & DİNAMİK"],
  fullbody: null, // null = tüm kategoriler
};
