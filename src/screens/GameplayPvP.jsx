import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database'; 
import { submitPartyAnswer, updatePartyData } from '../utils/partyFirebase';
import TimerBar from '../components/game/TimerBar';

import avatar1 from '../assets/avatar/Bluter.svg';
import avatar2 from '../assets/avatar/Gribir.svg';
import avatar3 from '../assets/avatar/Lady.svg';
import avatar4 from '../assets/avatar/Moko.svg';
import avatar5 from '../assets/avatar/Pinko.svg';
import avatar6 from '../assets/avatar/Renji.svg';

const AVATAR_LIST = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export default function GameplayPvP({ playerData, roomCode, role, onFinish }) {
  // === STATE SINKRONISASI FIREBASE ===
  const [roomData, setRoomData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionState, setQuestionState] = useState('answering'); 

  // === STATE LOKAL PEMAIN ===
  const [timeLeft, setTimeLeft] = useState(5); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [myScore, setMyScore] = useState(0);

  // === STATE STATISTIK ===
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // MUNDUR BARU: State khusus hitung mundur awal pertandingan
  const [startCountdown, setStartCountdown] = useState(3);

  const myAvatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];
  const myName = playerData?.name?.toUpperCase() || 'PLAYER';

  // 1. MENDENGARKAN PERUBAHAN FIREBASE SECARA LIVE
  useEffect(() => {
    const roomRef = ref(db, `partyRooms/${roomCode.toUpperCase()}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData(data);
        
        if (data.questions && questions.length === 0) {
          setQuestions(data.questions);
        }
        
        if (data.currentQuestionIndex !== undefined) {
          setCurrentIndex(data.currentQuestionIndex);
        }
        if (data.questionState) {
          setQuestionState(data.questionState);
        }

        let liveScore = 0;
        if (data.players && data.players[myName]) {
          liveScore = data.players[myName].score || 0;
          setMyScore(liveScore);
          
          if (data.questionState === 'answering' && !data.players[myName].hasAnsweredCurrent) {
             setIsAnswered(false);
             setSelectedOption(null);
             setTimeLeft(5); 
          }
        }

        if (data.status === 'finished') {
          handleFinishGame(data, liveScore);
        }
      }
    });
    return () => unsubscribe();
  }, [roomCode, myName, questions.length]);

  // ==========================================
  // LOGIKA BARU: Efek Penghitung Mundur Awal 3, 2, 1
  // ==========================================
  useEffect(() => {
    if (questions.length === 0 || !roomData) return; // Tunggu data siap dulu
    
    if (startCountdown > 0) {
      const timer = setTimeout(() => {
        setStartCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startCountdown, questions.length, roomData]);

  // ==========================================
  // 2. PERBAIKAN TIMER: Ditambahkan syarat startCountdown === 0
  // ==========================================
  useEffect(() => {
    let timer;
    // Timer kuis hanya akan berjalan jika hitung mundur 3,2,1 sudah selesai (0)
    if (questionState === 'answering' && timeLeft > 0 && startCountdown === 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, questionState, startCountdown]);

  // ==========================================
  // 3. TINDAKAN SAAT WAKTU HABIS
  // ==========================================
  useEffect(() => {
    if (timeLeft === 0 && questionState === 'answering' && startCountdown === 0) {
      if (!isAnswered) {
        handleTimeoutLokal();
      }
      
      if (role === 'host') {
        updatePartyData(roomCode, 'questionState', 'showing_answer');
        
        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
             updatePartyData(roomCode, 'currentQuestionIndex', currentIndex + 1);
             updatePartyData(roomCode, 'questionState', 'answering');
             resetPlayersAnswerStatus();
          } else {
             updatePartyData(roomCode, 'status', 'finished');
          }
        }, 4000);
      }
    }
  }, [timeLeft, questionState, role, roomCode, currentIndex, questions.length, isAnswered, startCountdown]);


  const resetPlayersAnswerStatus = async () => {
     if(!roomData || !roomData.players) return;
     const updates = {};
     Object.keys(roomData.players).forEach(playerName => {
        updates[`players/${playerName}/hasAnsweredCurrent`] = false;
     });
     update(ref(db, `partyRooms/${roomCode.toUpperCase()}`), updates);
  };

  const handleAnswerClick = async (optionId) => {
    if (isAnswered || questionState !== 'answering' || startCountdown > 0) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === questions[currentIndex].answer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
    } else {
      setCurrentStreak(0);
    }

    await submitPartyAnswer(roomCode, myName, isCorrect, timeLeft);
  };

  const handleTimeoutLokal = async () => {
    setIsAnswered(true);
    setCurrentStreak(0);
    await submitPartyAnswer(roomCode, myName, false, 0);
  };

  const handleFinishGame = (finalRoomData, liveScore) => {
    onFinish({
      score: liveScore !== undefined ? liveScore : myScore,
      correct: correctCount,
      streak: maxStreak,
      total: questions.length,
      partyData: finalRoomData
    });
  };

  if (questions.length === 0 || !roomData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-gray-400 animate-pulse">Syncing Party Game...</p>
      </div>
    );
  }

  // INTERSEPTOR: Tampilkan Layar Hitung Mundur Raksasa sebelum mulai
  if (startCountdown > 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col items-center justify-center h-[720px] max-h-[95vh] relative overflow-hidden text-center">
          <span className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4">Get Ready for Battle</span>
          <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-[#EE9432] flex items-center justify-center shadow-md animate-bounce-in">
            <span className="text-5xl font-black text-[#8C5221]">{startCountdown}</span>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-6 animate-pulse">Siapkan jempolmu!</p>
        </div>
      </div>
    );
  }

  const currentQuiz = questions[currentIndex];
  const topPlayers = Object.values(roomData.players || {}).sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 w-1/3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-[#4EA3E7] bg-white">
                <img src={myAvatarSrc} alt="You" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-[#4EA3E7] uppercase">You</span>
                <span className="text-sm font-black text-[#8C5221] leading-none">{myScore}</span>
            </div>
          </div>

          <div className="text-center w-1/3">
             <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md">
               Q: {currentIndex + 1}/{questions.length}
             </span>
          </div>

          <div className="flex justify-end gap-1 w-1/3">
             {topPlayers.map((p, i) => (
                <div key={i} className="relative flex flex-col items-center group">
                  <div className={`w-6 h-6 rounded-md overflow-hidden border-2 ${i === 0 ? 'border-yellow-400' : 'border-gray-200'}`}>
                    <img src={AVATAR_LIST[p.avatarIndex || 1]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  {i === 0 && <span className="absolute -top-2 text-[10px]">👑</span>}
                </div>
             ))}
          </div>
        </div>

        <TimerBar duration={5} timeLeft={timeLeft} />

        <div className="bg-white rounded-[2rem] p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-50 flex-1 flex flex-col justify-center items-center text-center relative mb-5 transition-all">
            <span className="text-[10px] font-black text-[#4EA3E7] uppercase tracking-[0.2em] mb-3">{currentQuiz.category}</span>
            <h2 className="text-xl font-black text-gray-800 tracking-tight leading-tight px-1">{currentQuiz.question}</h2>
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          {Object.entries(currentQuiz.options).map(([id, label]) => {
            let btnStyle = 'bg-white border-gray-100 hover:border-gray-200';
            let badgeStyle = 'bg-gray-100 border-gray-200 text-gray-400';
            let isCorrectOption = id === currentQuiz.answer;

            if (questionState === 'answering' && isAnswered) {
               if (selectedOption === id) {
                 btnStyle = 'bg-blue-50 border-blue-400 shadow-sm';
                 badgeStyle = 'bg-blue-400 border-blue-400 text-white';
               } else {
                 btnStyle = 'bg-white border-gray-100 opacity-50';
               }
            } 
            else if (questionState === 'showing_answer') {
              if (isCorrectOption) {
                btnStyle = 'bg-[#EBF7F0] border-[#4ADE80] shadow-sm animate-pulse';
                badgeStyle = 'bg-[#4ADE80] border-[#4ADE80] text-white';
              } else if (selectedOption === id) {
                btnStyle = 'bg-[#FEEFEF] border-[#F87171] shadow-sm';
                badgeStyle = 'bg-[#F87171] border-[#F87171] text-white';
              } else {
                btnStyle = 'bg-white border-gray-100 opacity-40';
              }
            }

            return (
              <button
                key={id}
                disabled={isAnswered || questionState === 'showing_answer'}
                onClick={() => handleAnswerClick(id)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all ${btnStyle}`}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Option {id}</span>
                  <span className="text-base font-black text-gray-700">{label}</span>
                </div>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs font-bold ${badgeStyle}`}>
                  {questionState === 'showing_answer' && isCorrectOption ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> : (isAnswered && selectedOption === id) ? (questionState === 'showing_answer' ? 'X' : '✓') : id}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col items-center justify-center min-h-[50px] bg-gray-100 rounded-xl">
            {questionState === 'showing_answer' ? (
               <p className="text-xs font-extrabold text-gray-800 py-2 animate-bounce">
                 {selectedOption === currentQuiz.answer ? '✅ SPEED BONUS! Get ready...' : '❌ Incorrect! Get ready...'}
               </p>
            ) : isAnswered ? (
              <p className="text-xs font-extrabold text-[#4EA3E7] animate-pulse py-2">Waiting for others...</p>
            ) : (
              <p className="text-[11px] font-bold text-gray-500 italic py-2">Hurry! Only 5 seconds!</p>
            )}
        </div>

      </div>
    </div>
  );
}