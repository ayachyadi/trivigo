import quizData from '../assets/data/soal.json';

// Kunci penyimpanan di HP pemain
const HISTORY_KEY = 'trivigo_played_questions';

// Fungsi Fisher-Yates (Pengacak Murni Kasino)
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Fungsi Utama Mengambil 15 Soal Segar (Ini yang akan di-export)
export const getFreshQuestions = (amount = 15) => {
  // 1. Baca ingatan soal yang pernah dimainkan
  const savedHistory = localStorage.getItem(HISTORY_KEY);
  let playedIds = savedHistory ? JSON.parse(savedHistory) : [];

  // 2. Singkirkan soal yang pernah dimainkan dari database utama
  let availableQuestions = quizData.filter(q => !playedIds.includes(q.id));

  // 3. Jika soal yang tersisa kurang dari yang diminta, RESET ingatan (Amnesia)
  if (availableQuestions.length < amount) {
    console.log("Database soal habis dimainkan! Mereset riwayat...");
    playedIds = [];
    availableQuestions = [...quizData]; // Kembalikan semua 4000 soal
  }

  // 4. Acak secara murni kumpulan soal yang tersedia
  const shuffledQuestions = shuffleArray(availableQuestions);
  
  // 5. Ambil 15 soal teratas
  const selectedQuestions = shuffledQuestions.slice(0, amount);

  // 6. Catat ID soal baru ini ke dalam buku ingatan (ditambahkan ke yang lama)
  const newPlayedIds = [...playedIds, ...selectedQuestions.map(q => q.id)];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newPlayedIds));

  return selectedQuestions;
};