import { db } from '../firebase';
import { ref, set, get, update, onValue, remove } from 'firebase/database';

// 1. FUNGSI UNTUK HOST: Membuat Room Baru
export const createPartyRoom = async (hostData) => {
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const hostName = hostData.name.toUpperCase();

  const roomRef = ref(db, `partyRooms/${roomCode}`);
  
  await set(roomRef, {
    status: 'waiting', 
    host: hostName,
    currentQuestionIndex: 0,
    players: {
      [hostName]: {
        name: hostData.name,
        avatarIndex: hostData.avatarIndex || 1,
        score: 0,
        isReady: true // Host otomatis ready
      }
    }
  });

  return roomCode;
};

// 2. FUNGSI UNTUK GUEST: Bergabung ke Room
export const joinPartyRoom = async (roomCode, guestData) => {
  const code = roomCode.toUpperCase();
  const roomRef = ref(db, `partyRooms/${code}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error("Room tidak ditemukan!");
  }

  const roomData = snapshot.val();

  if (roomData.status !== 'waiting') {
    throw new Error("Game sudah dimulai, tidak bisa bergabung!");
  }
  
  const currentPlayersCount = Object.keys(roomData.players || {}).length;
  if (currentPlayersCount >= 5) {
    throw new Error("Room sudah penuh (Maksimal 5 pemain)!");
  }

  const guestName = guestData.name.toUpperCase();
  await update(ref(db, `partyRooms/${code}/players`), {
    [guestName]: {
      name: guestData.name,
      avatarIndex: guestData.avatarIndex || 1,
      score: 0,
      isReady: false 
    }
  });

  return true;
};

// 3. FUNGSI LIVE SYNC: Mendengarkan perubahan data Real-time
export const listenToPartyRoom = (roomCode, callback) => {
  const code = roomCode.toUpperCase();
  const roomRef = ref(db, `partyRooms/${code}`);
  
  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null); 
    }
  });

  return unsubscribe; 
};

// 4. FUNGSI UPDATE STATUS: Memperbarui data spesifik
export const updatePartyData = async (roomCode, updatePath, value) => {
  const code = roomCode.toUpperCase();
  await update(ref(db, `partyRooms/${code}`), {
    [updatePath]: value
  });
};

// 5. FUNGSI KELUAR: Meninggalkan Room
export const leavePartyRoom = async (roomCode, playerName, isHost) => {
  const code = roomCode.toUpperCase();
  const name = playerName.toUpperCase();
  
  if (isHost) {
    await remove(ref(db, `partyRooms/${code}`));
  } else {
    await remove(ref(db, `partyRooms/${code}/players/${name}`));
  }
};

// ==========================================
// FUNGSI KHUSUS GAMEPLAY ALA KAHOOT
// ==========================================

// 6. FUNGSI HOST MEMULAI GAME (Menyuntikkan Soal ke Firebase)
export const startGameAsHost = async (roomCode, providedQuestions) => {
  const code = roomCode.toUpperCase();
  const roomRef = ref(db, `partyRooms/${code}`);

  // Karena soal sudah difilter oleh questionEngine, kita tinggal pakai
  await update(roomRef, {
    status: 'playing',
    questions: providedQuestions,
    currentQuestionIndex: 0,
    questionState: 'answering'
  });
};

// 7. FUNGSI MENGIRIM JAWABAN (Sistem Skor Baru + Penalti Poin)
export const submitPartyAnswer = async (roomCode, playerName, isCorrect, timeRemaining) => {
  const code = roomCode.toUpperCase();
  const name = playerName.toUpperCase();
  
  // === LOGIKA PERHITUNGAN SKOR BARU ===
  // Jika benar: Poin dasar 20 + Bonus Kecepatan (2 x sisa detik)
  // Jika salah / timeout: Dikurangi 5 poin (-5)
  const scoreChange = isCorrect ? (20 + (timeRemaining * 2)) : -5;

  const playerRef = ref(db, `partyRooms/${code}/players/${name}`);
  const snapshot = await get(playerRef);
  
  if (snapshot.exists()) {
    const oldScore = snapshot.val().score || 0;
    
    // Math.max(0, ...) digunakan agar skor total tidak minus di bawah angka 0
    // sehingga tampilan UI tidak rusak atau berantakan
    const newScore = Math.max(0, oldScore + scoreChange);

    await update(playerRef, {
      score: newScore,
      hasAnsweredCurrent: true 
    });
  }
};