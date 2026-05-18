import { useState, useEffect, useRef } from 'react'; // <-- Tambahkan useRef
import { db } from './firebase'; 
import { ref, get, update } from 'firebase/database';
import WinnerSplash from './screens/WinnerSplash'; 

// Import Layar
import SplashScreen from './screens/SplashScreen'; 
import Onboarding from './screens/Onboarding';
import MainMenu from './screens/MainMenu';
import Lobby from './screens/Lobby';
import Gameplay from './screens/Gameplay';
import GameplayPvP from './screens/GameplayPvP'; 
import Result from './screens/Result';
import Leaderboard from './screens/Leaderboard'; 
import Settings from './screens/Settings'; 

// IMPORT AUDIO (Pastikan file ini ada di folder yang sesuai)
import bgmAudio from './assets/audio/bgm.mp3'; 

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
  const [myPartyRank, setMyPartyRank] = useState(0);

  const [leaderboardFrom, setLeaderboardFrom] = useState('menu');

  // ==========================================
  // SETUP AUDIO & AUTOPLAY (Sistem Pintar)
  // ==========================================
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    // Fungsi untuk memutar musik saat layar disentuh pertama kali
    const handleFirstTouch = () => {
      if (audioRef.current && !isAudioPlaying) {
        audioRef.current.volume = 0.4; // Volume diset 40% agar nyaman di telinga
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch((err) => console.log("Audio terblokir browser:", err));
      }
      // Lepas event listener agar tidak dipanggil terus-terusan
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('touchstart', handleFirstTouch);

    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, [isAudioPlaying]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };
  // ==========================================

  // === EFEK TIMER SPLASH & CEK LOCAL STORAGE ===
  useEffect(() => {
    const savedUser = localStorage.getItem('trivigo_player_data');
    
    if (savedUser) {
      setPlayerData(JSON.parse(savedUser));
      setCurrentScreen('menu'); 
    }

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleStartGame = (data) => {
    localStorage.setItem('trivigo_player_data', JSON.stringify(data));
    setPlayerData(data);
    setCurrentScreen('menu');
  };

  const handleStartMultiplayer = (code, role) => {
    setRoomCode(code);
    setPlayerRole(role);
    setCurrentScreen('gameplay-pvp');
  };

  const handleResetPlayer = () => {
    const confirmReset = window.confirm("Apakah kamu yakin ingin mereset? Semua nama dan avatar di HP ini akan dihapus.");
    if (confirmReset) {
      localStorage.removeItem('trivigo_player_data'); 
      setPlayerData(null); 
      setCurrentScreen('onboarding'); 
    }
  };

  const handleFinishQuiz = async (resultData) => {
    const rawScore = resultData.score !== undefined ? resultData.score : resultData;
    setFinalScore(rawScore); 

    if (resultData.correct !== undefined) {
      setPlayerStats({
        correct: resultData.correct, speed: resultData.speed, streak: resultData.streak, total: resultData.total || 5
      });
    }

    let isTop3 = false; 

    if (gameMode === 'pvp') {
      setOpponentResult(resultData.partyData); 

      if (resultData.partyData?.players && playerData?.name) {
        const sorted = Object.values(resultData.partyData.players).sort((a, b) => b.score - a.score);
        const rank = sorted.findIndex(p => p.name.toUpperCase() === playerData.name.toUpperCase()) + 1;
        setMyPartyRank(rank);

        if (rank >= 1 && rank <= 3) {
          isTop3 = true;
        }
      }
    } else {
      setOpponentResult(null); 
    }

    if (playerData?.name && rawScore > 0) {
      const userName = playerData.name.toUpperCase();
      const lbRef = ref(db, `leaderboard/${userName}`);
      try {
        const snapshot = await get(lbRef);
        const existingData = snapshot.val();
        const newTotalScore = (existingData?.score || 0) + rawScore; 
        await update(lbRef, { score: newTotalScore, avatarIndex: playerData.avatarIndex });
      } catch (err) {
        console.error("Gagal menyimpan ke leaderboard", err);
      }
    }

    if (isTop3) {
      setCurrentScreen('winner-splash');
    } else {
      setCurrentScreen('result');
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      {/* ELEMEN AUDIO & TOMBOL SPEAKER MELAYANG */}
      <audio ref={audioRef} src={bgmAudio} loop />
      
      {/* Jangan tampilkan tombol speaker di splash screen */}
      <button 
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-[999] bg-white/80 backdrop-blur border border-gray-200 text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white active:scale-90 transition-all"
        title="Toggle Music"
      >
        {isAudioPlaying ? '🔊' : '🔇'}
      </button>

      {/* RUTE HALAMAN */}
      {currentScreen === 'onboarding' && (
        <Onboarding 
          onSave={handleStartGame} 
          onViewSettings={() => setCurrentScreen('settings')} 
        />
      )}
      
      {currentScreen === 'menu' && (
        <MainMenu 
          playerData={playerData} 
          onLogOut={() => setCurrentScreen('onboarding')} 
          onSelectPvP={() => { setGameMode('pvp'); setCurrentScreen('lobby'); }} 
          onSelectSolo={() => { setGameMode('solo'); setCurrentScreen('gameplay'); }} 
          onViewLeaderboard={() => { setLeaderboardFrom('menu'); setCurrentScreen('leaderboard'); }} 
        />
      )}
      
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
          onViewLeaderboard={() => { setLeaderboardFrom('result'); setCurrentScreen('leaderboard'); }} 
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard 
          playerData={playerData} 
          onBack={() => setCurrentScreen(leaderboardFrom)} 
        />
      )}

      {currentScreen === 'settings' && (
        <Settings 
          onBack={() => setCurrentScreen('onboarding')} 
          onResetPlayer={handleResetPlayer} 
        />
      )}

      {currentScreen === 'winner-splash' && (
        <WinnerSplash 
          playerData={playerData}
          rank={myPartyRank}
          score={finalScore}
          onContinue={() => setCurrentScreen('result')} 
        />
      )}
    </>
  );
}

export default App;