// src/data/exerciseImages.js
// Her egzersiz için YouTube arama URL'i ve Wikipedia/açık kaynak görsel URL'i
// Yeni egzersiz eklendiğinde buraya da eklenir.

// Varsayılan placeholder — egzersiz adıyla dinamik oluşturur
const placeholder = (name) =>
  `https://placehold.co/600x400/0f172a/f59e0b?text=${encodeURIComponent(name)}&font=montserrat`;

// YouTube arama URL'i — her zaman çalışır
export const getYouTubeSearchUrl = (exerciseName) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' exercise tutorial')}`;

// ExRx.net veya açık kaynak görsel — yoksa placeholder
const IMAGE_MAP = {
  // COMPOUND LEGS
  'High Bar Back Squat':        'https://www.exrx.net/images/ExList/WtBal.gif',
  'Conventional Deadlift':      'https://www.exrx.net/images/ExList/WtBal.gif',
  'Front Squat':                'https://www.exrx.net/images/ExList/WtBal.gif',
  'Romanian Deadlift (Barbell/DB)': 'https://www.exrx.net/images/ExList/WtBal.gif',
  'Hip Thrust':                 'https://www.exrx.net/images/ExList/WtBal.gif',
  // COMPOUND PUSH
  'Barbell Bench Press':        'https://www.exrx.net/images/ExList/WtBal.gif',
  'Strict OHP (Military Press)':'https://www.exrx.net/images/ExList/WtBal.gif',
  'Incline Bench Press':        'https://www.exrx.net/images/ExList/WtBal.gif',
  // COMPOUND PULL
  'Weighted Pull-Ups':          'https://www.exrx.net/images/ExList/WtBal.gif',
  'Barbell Bent-Over Row':      'https://www.exrx.net/images/ExList/WtBal.gif',
  'Seated Cable Row':           'https://www.exrx.net/images/ExList/WtBal.gif',
};

// Ana fonksiyon — önce map'e bak, yoksa placeholder kullan
export const getExerciseImageUrl = (exerciseName) => {
  return IMAGE_MAP[exerciseName] || placeholder(exerciseName);
};
