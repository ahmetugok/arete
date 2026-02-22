// HANIK EXERCISE LIBRARY v1.0
// Kullanıcının kişisel egzersiz kütüphanesi.
// Her hareket: { name, category, reps, description }

const HANIK_DB = {
    warmup: [
        // Omuz/Sırt
        { name: "Shoulder Circles (bands/towel)", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Bant veya havlu ile omuz çevirme hareketleri." },
        { name: "Shoulder LR Circles", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Omuzları sola ve sağa çevirme rotasyonları." },
        { name: "Scapula Stretches (towel)", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Havlu ile kürek kemiği germe hareketleri." },
        { name: "Back Circle Stretches", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Sırtı dairesel hareketlerle germe." },
        { name: "Wide Shoulder Circles", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Geniş omuz çevirme rotasyonları." },
        { name: "Upperback Activation", category: "Omuz/Sırt", reps: "Maksimum / Hissederek", description: "Üst sırt kaslarını aktive etme hareketi." },
        // Omurga/Kalça
        { name: "Camel to Cobra Stretch", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Omurgayı kedi-deve hareketi ile esnetme." },
        { name: "Lizard LtoR", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Sağa ve sola kertenkele pozisyonu ile kalça açma." },
        { name: "Spine Mobility", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Omurga mobilite egzersizleri." },
        { name: "Lower Posterior Activation", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Alt arka zincir aktivasyonu." },
        { name: "Glute Rolls", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Glute kaslarını foam roller ile gevşetme." },
        { name: "Knee & Hipflexor opener", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Diz ve kalça fleksörü açma hareketi." },
        { name: "Butterflys", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Kelebek pozisyonunda iç bacak germe." },
        { name: "Chest Stretch", category: "Omurga/Kalça", reps: "Maksimum / Hissederek", description: "Göğüs kaslarını germe." },
        // Aktivasyon
        { name: "Squat Side kicks", category: "Aktivasyon", reps: "Maksimum (Fail)", description: "Çömelme pozisyonunda yan tekme aktivasyonu." },
        { name: "Easy Core Activation", category: "Aktivasyon", reps: "Maksimum (Fail)", description: "Kolay core aktivasyon egzersizleri." },
        { name: "Easy Rotations", category: "Aktivasyon", reps: "Maksimum (Fail)", description: "Kolay rotasyon hareketleri ile ısınma." },
        // Giriş
        { name: "Easy Push-ups", category: "Giriş", reps: "Maksimum (Fail)", description: "Kolay şınav hareketi ile ısınma." },
        { name: "Deep Rows (Warmup)", category: "Giriş", reps: "20 saniye (Isınma)", description: "Derin çekiş hareketi ile ısınma." },
    ],

    push: [
        // Pres
        { name: "Bench Press", category: "Pres", reps: "6 tekrar (5 set) veya 8 tekrar (3-4 set)", description: "Klasik bant presi. Horizontal itme ana hareketi." },
        { name: "Military Press", category: "Pres", reps: "8 tekrar veya 5 tekrar", description: "Askeri press. Dikey itme ana hareketi." },
        { name: "One Armed Dumbbell Press", category: "Pres", reps: "12 tekrar", description: "Tek kollu dambıl presi. Stabilite odaklı." },
        { name: "Rotated Landmine Press", category: "Pres", reps: "8-12 tekrar", description: "Rotasyonlu landmine presi." },
        { name: "One Arm Pulled Shoulder Press", category: "Pres", reps: "12 tekrar", description: "Tek kollu çekişli omuz presi." },
        { name: "Cable Pull Press", category: "Pres", reps: "12-16 tekrar", description: "Kablo kullanarak çekiş ve pres kombinasyonu." },
        { name: "High Box Press", category: "Pres", reps: "8 tekrar", description: "Yüksek kutu üzerinde pres hareketi." },
        { name: "Seated One Arm Shoulder Press", category: "Pres", reps: "10 tekrar", description: "Oturarak tek kollu omuz presi." },
        { name: "Hanging Overhead Press", category: "Pres", reps: "12 tekrar", description: "Asılı pozisyonda baş üstü pres." },
        { name: "Squat Overhead Press", category: "Pres", reps: "8 tekrar", description: "Squat ile baş üstü pres kombinasyonu." },
        // Şınav
        { name: "Plate Turn Push Ups", category: "Şınav", reps: "16 tekrar", description: "Plaka döndürerek şınav." },
        { name: "Banded One Arm Pushups", category: "Şınav", reps: "12 tekrar", description: "Bantla destekli tek kollu şınav." },
        { name: "KB Push Up Rotations", category: "Şınav", reps: "12-14 tekrar", description: "KB üzerinde rotasyonlu şınav." },
        { name: "KB Chair Pushups", category: "Şınav", reps: "Maksimum (Fail)", description: "KB sandalye şınavları." },
        { name: "Side Turn Push Ups", category: "Şınav", reps: "Maksimum (Fail)", description: "Yana dönüşlü şınav." },
        { name: "Plate Push Ups", category: "Şınav", reps: "12 tekrar", description: "Plaka üzerinde şınav." },
        { name: "Superman Push-ups", category: "Şınav", reps: "12 tekrar", description: "Superman pozisyonlu şınav." },
        { name: "Banded Rotation Pushups", category: "Şınav", reps: "12 tekrar", description: "Bantlı rotasyonlu şınav." },
        { name: "One-Armed Push Ups", category: "Şınav", reps: "Maksimum (Fail)", description: "Tek kollu şınav." },
        { name: "Core Rotation Push Ups", category: "Şınav", reps: "12 tekrar", description: "Core rotasyonlu şınav." },
        { name: "Focused Rotation Push-Ups", category: "Şınav", reps: "8 tekrar", description: "Odaklı rotasyon şınavı." },
        { name: "KB Power Push-Ups", category: "Şınav", reps: "Maksimum (Fail)", description: "KB patlayıcı şınav." },
        { name: "Plyometric Push Up Jumps", category: "Şınav", reps: "Maksimum (Fail)", description: "Pliometrik şınav sıçramaları." },
        // İtiş Diğer
        { name: "KB Triceps Extensions", category: "İtiş Diğer", reps: "12 tekrar", description: "KB ile triceps uzatma." },
        { name: "Landmine Flys", category: "İtiş Diğer", reps: "12 tekrar", description: "Landmine ile kelebek hareketi." },
        { name: "Push Up Dumbbell Swings", category: "İtiş Diğer", reps: "8 tekrar", description: "Şınav pozisyonunda dambıl sallama." },
        { name: "Pulled Shoulder Press", category: "İtiş Diğer", reps: "12 tekrar", description: "Çekişli omuz presi." },
        { name: "Shoulder Press Lunges", category: "İtiş Diğer", reps: "10 tekrar", description: "Omuz presi ile lunge kombinasyonu." },
        { name: "Ring Reverse Flys", category: "İtiş Diğer", reps: "8 tekrar", description: "Halka üzerinde ters kelebek." },
    ],

    pull: [
        // Row
        { name: "Deep Rows", category: "Row", reps: "20 saniye (Isınma)", description: "Derin çekiş hareketi." },
        { name: "Gorilla Rows", category: "Row", reps: "16 tekrar", description: "Goril çekisi – iki kollu dambıl row." },
        { name: "Neckhold Rows", category: "Row", reps: "14-16 tekrar", description: "Boyun tutuşuyla çekiş." },
        { name: "Gymnastic Ring Rows", category: "Row", reps: "Maksimum (Fail)", description: "Jimnastik halkasında çekiş." },
        { name: "Barbell Kayak Rows", category: "Row", reps: "16 tekrar", description: "Barbell ile kayık çekişi." },
        { name: "KB Push Up Rows", category: "Row", reps: "16 tekrar", description: "KB şınav çekişi kombinasyonu." },
        { name: "Landmine Rope Rows", category: "Row", reps: "10 tekrar", description: "Landmine halat çekişi." },
        { name: "Rotating Cable Rows", category: "Row", reps: "12 tekrar", description: "Dönen kablo çekişleri." },
        { name: "One-Arm Cable Rows", category: "Row", reps: "12 tekrar", description: "Tek kollu kablo çekişi." },
        { name: "Barbell Rows", category: "Row", reps: "6 tekrar", description: "Klasik barbell çekiş." },
        { name: "Cable Cross Rows", category: "Row", reps: "16 tekrar", description: "Çapraz kablo çekişi." },
        { name: "Explosive Band Rows", category: "Row", reps: "20 tekrar", description: "Patlayıcı bant çekişleri." },
        // Çekiş Diğer
        { name: "Gymnastic Pull Press", category: "Çekiş Diğer", reps: "12 tekrar", description: "Jimnastik çekiş ve pres kombinasyonu." },
        { name: "Biceps Overhead Pulls", category: "Çekiş Diğer", reps: "15 tekrar", description: "Baş üstü biceps çekişleri." },
        { name: "Ring Curls", category: "Çekiş Diğer", reps: "12 tekrar", description: "Halka üzerinde curl." },
        { name: "One Arm Barbell Curls", category: "Çekiş Diğer", reps: "12 tekrar", description: "Tek kollu barbell curl." },
        { name: "Explosive Band Pulls", category: "Çekiş Diğer", reps: "Maksimum (Fail)", description: "Patlayıcı bant çekişleri." },
    ],

    legs: [
        // Squat
        { name: "Squats", category: "Squat", reps: "5-6-8 tekrar", description: "Klasik squat." },
        { name: "Dead Hang Squats", category: "Squat", reps: "14 tekrar", description: "Ölü asılı squat." },
        { name: "Folding Chair Squats", category: "Squat", reps: "8 tekrar", description: "Sandalye katlamalı squat." },
        { name: "Deep KB Squats", category: "Squat", reps: "12 tekrar", description: "Derin KB squatı." },
        { name: "KB Curl Squats", category: "Squat", reps: "6 tekrar", description: "KB curl ve squat kombinasyonu." },
        { name: "Halo Squats", category: "Squat", reps: "6-10 tekrar", description: "Halo hareketi ile squat." },
        { name: "Curl Squats", category: "Squat", reps: "8 tekrar", description: "Curl ve squat kombinasyonu." },
        { name: "Landmine Squats", category: "Squat", reps: "10 tekrar", description: "Landmine kullanarak squat." },
        { name: "Zercher Rotation Squats", category: "Squat", reps: "10 tekrar", description: "Zercher tutuşu ile rotasyonlu squat." },
        // Lunge
        { name: "Farmers Lunges", category: "Lunge", reps: "12-16 tekrar", description: "Çiftçi yürüyüşü ile lunge." },
        { name: "KB L to R Lunges", category: "Lunge", reps: "16 tekrar", description: "KB ile soldan sağa lunge." },
        { name: "KB Swing Reverse Lunges", category: "Lunge", reps: "16 tekrar", description: "KB sallama ile ters lunge." },
        { name: "KB Side Lunges", category: "Lunge", reps: "8 tekrar", description: "KB ile yan lunge." },
        { name: "In and Out Lunges", category: "Lunge", reps: "12 tekrar", description: "İçe ve dışa lunge." },
        { name: "Landmine Lunges", category: "Lunge", reps: "16 tekrar", description: "Landmine ile lunge." },
        { name: "One Leg Jumping Lunges", category: "Lunge", reps: "Maksimum (Fail)", description: "Tek bacak atlama lunge." },
        { name: "Rotated Barbell Lunges", category: "Lunge", reps: "12 tekrar", description: "Rotasyonlu barbell lunge." },
        { name: "Box Lunge Rotations", category: "Lunge", reps: "12 tekrar", description: "Kutu üzerinde rotasyonlu lunge." },
        { name: "Dumbbell Front Hold Lunges", category: "Lunge", reps: "12 tekrar", description: "Öne tutuşlu dambıl lunge." },
        { name: "Landmine Twist Lunges", category: "Lunge", reps: "12 tekrar", description: "Landmine bükümü ile lunge." },
        { name: "Rotated KB F&R Lunges", category: "Lunge", reps: "10 tekrar", description: "Rotasyonlu KB ileri-geri lunge." },
        { name: "Banded Curl Reverse Lunges", category: "Lunge", reps: "10 tekrar", description: "Bantlı curl ile ters lunge." },
        // Hinge/Post
        { name: "Deadlift", category: "Hinge/Post", reps: "5-6-8 tekrar", description: "Klasik deadlift." },
        { name: "Zercher Romanian DLs", category: "Hinge/Post", reps: "10 tekrar", description: "Zercher tutuşlu Romanian DL." },
        { name: "Landmine Clean and Lunge", category: "Hinge/Post", reps: "8 tekrar", description: "Landmine clean ve lunge." },
        { name: "Pulled Hyperextensions", category: "Hinge/Post", reps: "12 tekrar", description: "Çekişli hiperekstansiyon." },
        { name: "Hamstring Kicks", category: "Hinge/Post", reps: "20 saniye", description: "Hamstring tekme hareketleri." },
        { name: "Jumped Landmine RDLs", category: "Hinge/Post", reps: "12 tekrar", description: "Sıçramalı landmine RDL." },
        { name: "Med Ball RDLs", category: "Hinge/Post", reps: "12 tekrar", description: "Med ball ile Romanian DL." },
        { name: "Banded RDL Curls", category: "Hinge/Post", reps: "15 tekrar", description: "Bantlı RDL curl kombinasyonu." },
        { name: "Adductor Hyperextensions", category: "Hinge/Post", reps: "12 tekrar", description: "Adductor hiperekstansiyon." },
        // Patlayıcı
        { name: "Knee to Feet Jumps", category: "Patlayıcı", reps: "6-12 tekrar", description: "Dizden ayağa patlayıcı sıçrama." },
        { name: "Wide Jumps", category: "Patlayıcı", reps: "6 tekrar", description: "Geniş patlayıcı sıçramalar." },
        { name: "Banded High Knee Steps", category: "Patlayıcı", reps: "10-12 tekrar", description: "Bantlı yüksek diz adımları." },
        { name: "KB Overhead Squat Steps", category: "Patlayıcı", reps: "14 tekrar", description: "KB baş üstü squat adımları." },
        { name: "Landmine Stepover Lifts", category: "Patlayıcı", reps: "12-14 tekrar", description: "Landmine üzerinden adım kaldırma." },
        { name: "Hip Thrust Throws", category: "Patlayıcı", reps: "10 tekrar", description: "Kalça itiş fırlatmaları." },
        { name: "Banded Rotation Jumps", category: "Patlayıcı", reps: "10 tekrar", description: "Bantlı rotasyonlu sıçramalar." },
    ],

    functional: [
        // KB/Rotasyon
        { name: "KB Curl Swings", category: "KB/Rotasyon", reps: "12 tekrar", description: "KB curl ve sallama." },
        { name: "KB L to R Throws", category: "KB/Rotasyon", reps: "12 tekrar", description: "KB soldan sağa fırlatma." },
        { name: "Plank KB Shoulder Press", category: "KB/Rotasyon", reps: "10 tekrar", description: "Plank pozisyonunda KB omuz presi." },
        { name: "Plank KB Throws", category: "KB/Rotasyon", reps: "10 tekrar veya 30sn", description: "Plank pozisyonunda KB fırlatma." },
        { name: "KB Anchor Swings", category: "KB/Rotasyon", reps: "10-12 tekrar", description: "KB çapa sallama hareketi." },
        { name: "KB Windmill", category: "KB/Rotasyon", reps: "10 tekrar", description: "KB yel değirmeni hareketi." },
        { name: "Kneeled Curl to Press", category: "KB/Rotasyon", reps: "10 tekrar", description: "Diz üstünde curl ve pres." },
        { name: "KB Overhead Swings", category: "KB/Rotasyon", reps: "12 tekrar", description: "KB baş üstü sallama." },
        { name: "KB Golf Swings", category: "KB/Rotasyon", reps: "10-15 tekrar", description: "KB golf salış hareketi." },
        { name: "KB Hook Swings", category: "KB/Rotasyon", reps: "8-12 tekrar", description: "KB kanca sallama hareketi." },
        { name: "Kneeled Halo-Curls", category: "KB/Rotasyon", reps: "12 tekrar", description: "Diz üstünde halo-curl." },
        { name: "Kneeled KB Hooks", category: "KB/Rotasyon", reps: "Maksimum (Fail)", description: "Diz üstünde KB kanca hareketi." },
        { name: "Kneeled Shoulder Press Steps", category: "KB/Rotasyon", reps: "12 tekrar", description: "Diz üstünde omuz presi adımları." },
        // Landmine/Rotasyon
        { name: "Landmine Power Rotations", category: "Landmine/Rotasyon", reps: "16 tekrar", description: "Landmine güç rotasyonları." },
        { name: "Landmine L to R Swings", category: "Landmine/Rotasyon", reps: "14-16 tekrar", description: "Landmine soldan sağa sallama." },
        { name: "Plate Hook Rotations", category: "Landmine/Rotasyon", reps: "Maksimum (Fail)", description: "Plaka kanca rotasyonları." },
        { name: "Squat 360 Rotations", category: "Landmine/Rotasyon", reps: "12-14 tekrar", description: "Squat ile 360 derece rotasyon." },
        { name: "360 Lunges", category: "Landmine/Rotasyon", reps: "16 tekrar", description: "360 derece lunge hareketleri." },
        { name: "Rotated Landmine Clean & Jerk", category: "Landmine/Rotasyon", reps: "8 tekrar", description: "Rotasyonlu landmine clean ve jerk." },
        { name: "Neckhold Plate Rotations", category: "Landmine/Rotasyon", reps: "12 tekrar", description: "Boyun tutuşuyla plaka rotasyonları." },
        { name: "Medball Crunch Rotations", category: "Landmine/Rotasyon", reps: "12 tekrar", description: "Med ball mekik rotasyonları." },
        { name: "Banded Med Ball Rotations", category: "Landmine/Rotasyon", reps: "12 tekrar", description: "Bantlı med ball rotasyonları." },
        { name: "Kneeled KB Hook Rotations", category: "Landmine/Rotasyon", reps: "12 tekrar", description: "Diz üstünde KB kanca rotasyonları." },
        { name: "Med Ball Side Hook", category: "Landmine/Rotasyon", reps: "10 saniye", description: "Med ball yan kanca hareketi." },
        { name: "Leaned L to R Band Pulls", category: "Landmine/Rotasyon", reps: "Maksimum (Fail)", description: "Eğik soldan sağa bant çekişleri." },
        { name: "Banded Hip Throws", category: "Landmine/Rotasyon", reps: "12 tekrar", description: "Bantlı kalça fırlatma." },
        // Kompleks
        { name: "Explosive Punch & Pull", category: "Kompleks", reps: "10 tekrar", description: "Patlayıcı yumruk ve çekiş kombinasyonu." },
        { name: "Barbell Push & Pull", category: "Kompleks", reps: "10 saniye (İzometrik)", description: "Barbell itme ve çekme kombinasyonu." },
        { name: "Fullplank KB switches", category: "Kompleks", reps: "30sn veya 14 tekrar", description: "Tam plank KB geçişleri." },
        { name: "Med Ball Swings", category: "Kompleks", reps: "30 saniye", description: "Med ball sallamaları." },
    ],

    core: [
        { name: "Negative Plate Crunches", category: "Core", reps: "10 tekrar", description: "Negatif plakalı mekik." },
        { name: "Leg Raise Kicks", category: "Core", reps: "20-30 saniye", description: "Bacak kaldırma tekmeleri." },
        { name: "Kneeled Core Rotations", category: "Core", reps: "16 tekrar", description: "Diz üstünde core rotasyonları." },
        { name: "Kneeled Step Rotations", category: "Core", reps: "12 tekrar", description: "Diz üstünde adım rotasyonları." },
        { name: "Banded Suitcase Carry", category: "Taşıma", reps: "30 saniye", description: "Bantlı bavul taşıma." },
    ],
};

export default HANIK_DB;
