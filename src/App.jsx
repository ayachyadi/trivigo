import { useState, useEffect } from 'react'; // <-- Tambahkan useEffect di sini
import { db } from './firebase'; 
import { ref, get, update } from 'firebase/database'; 

// Import Layar
import SplashScreen from './screens/SplashScreen'; // <-- Import Layar Splash Screen
import Onboarding from './screens/Onboarding';
import MainMenu from './screens/MainMenu';
import Lobby from './screens/Lobby';
import Gameplay from './screens/Gameplay';
import GameplayPvP from './screens/GameplayPvP'; 
import Result from './screens/Result';
import Leaderboard from './screens/Leaderboard'; 

function App() {
  // === STATE SPLASH SCREEN ===
  const [showSplash, setShowSplash] = useState(true);

  // State Utama Aplikasi
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [playerData, setPlayerData] = useState(null);
  const [gameMode, setGameMode] = useState('solo');
  const [roomCode, setRoomCode] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); 
  
  const [finalScore, setFinalScore] = useState(0);
  const [playerStats, setPlayerStats] = useState({ correct: 0, speed: 0, streak: 0, total: 15 });
  const [opponentResult, setOpponentResult] = useState(null); 

  // === EFEK TIMER SPLASH SCREEN ===
  useEffect(() => {
    // Tahan aplikasi di halaman Splash selama 3 detik (3000 ms)
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Bersihkan memori timer jika komponen ditutup
    return () => clearTimeout(splashTimer);
  }, []);

  const handleStartGame = (data) => {
    setPlayerData(data);
    setCurrentScreen('menu');
  };

  const handleStartMultiplayer = (code, role) => {
    setRoomCode(code);
    setPlayerRole(role);
    setCurrentScreen('gameplay-pvp');
  };

  const handleFinishQuiz = async (resultData) => {
    const rawScore = resultData.score !== undefined ? resultData.score : resultData;
    setFinalScore(rawScore); 
    
    if (resultData.correct !== undefined) {
      setPlayerStats({
        correct: resultData.correct,
        speed: resultData.speed,
        streak: resultData.streak,
        total: resultData.total || 5
      });
    }

    if (gameMode === 'pvp') {
      setOpponentResult({
        score: resultData.opponentScore,
        name: resultData.opponentName,
        avatarIndex: resultData.opponentAvatar
      });
    } else {
      setOpponentResult(null); 
    }

    // === LOGIKA SIMPAN & AKUMULASI SKOR KE LEADERBOARD ===
    if (playerData?.name && rawScore > 0) {
      const userName = playerData.name.toUpperCase();
      const lbRef = ref(db, `leaderboard/${userName}`);
      
      try {
        const snapshot = await get(lbRef);
        const existingData = snapshot.val();
        // Jumlahkan skor lama (jika ada) dengan skor baru
        const newTotalScore = (existingData?.score || 0) + rawScore; 
        
        await update(lbRef, {
          score: newTotalScore,
          avatarIndex: playerData.avatarIndex 
        });
      } catch (err) {
        console.error("Gagal menyimpan ke leaderboard", err);
      }
    }

    setCurrentScreen('result');
  };

  // === RENDER SPLASH SCREEN PERTAMA KALI ===
  if (showSplash) {
    return <SplashScreen />;
  }

  // === RENDER APLIKASI UTAMA (SETELAH SPLASH SELESAI) ===
  return (
    <>
      {currentScreen === 'onboarding' && <Onboarding onSave={handleStartGame} />}
      {currentScreen === 'menu' && <MainMenu playerData={playerData} onLogOut={() => setCurrentScreen('onboarding')} onSelectPvP={() => { setGameMode('pvp'); setCurrentScreen('lobby'); }} onSelectSolo={() => { setGameMode('solo'); setCurrentScreen('gameplay'); }} />}
      {currentScreen === 'lobby' && <Lobby playerData={playerData} onBack={() => setCurrentScreen('menu')} onStartMultiplayer={handleStartMultiplayer} />}
      {currentScreen === 'gameplay' && <Gameplay playerData={playerData} onFinish={handleFinishQuiz} />}
      {currentScreen === 'gameplay-pvp' && <GameplayPvP playerData={playerData} roomCode={roomCode} role={playerRole} onFinish={handleFinishQuiz} />}
      
      {currentScreen === 'result' && (
        <Result 
          playerData={playerData} 
          score={finalScore} 
          stats={playerStats}
          mode={gameMode}
          opponentData={opponentResult} 
          onRematch={() => setCurrentScreen(gameMode === 'solo' ? 'gameplay' : 'lobby')} 
          onBackToMenu={() => setCurrentScreen('menu')} 
          onViewLeaderboard={() => setCurrentScreen('leaderboard')} 
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard 
          playerData={playerData} 
          onBack={() => setCurrentScreen('result')} 
        />
      )}
    </>
  );
}

export default App;