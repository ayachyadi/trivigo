import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, update, onValue } from 'firebase/database';
import TimerBar from '../components/game/TimerBar';
import quizData from '../assets/data/soal.json';

import avatar1 from '../assets/avatar/Bluter.svg'; // Sesuaikan nama file dan ekstensinya (.png / .svg / .webp)
import avatar2 from '../assets/avatar/Gribir.svg';
import avatar3 from '../assets/avatar/Lady.svg';
import avatar4 from '../assets/avatar/Moko.svg';
import avatar5 from '../assets/avatar/Pinko.svg';
import avatar6 from '../assets/avatar/Renji.svg';

const AVATAR_LIST = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
];

export default function GameplayPvP({ playerData, roomCode, role, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [opponentData, setOpponentData] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // STATE STATISTIK UNTUK PVP
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalResponseTime, setTotalResponseTime] = useState(0);

  const myAvatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];

  // 1. SINKRONISASI FIREBASE
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const oppRole = role === 'host' ? 'guest' : 'host';
        if (data[oppRole]) {
          setOpponentData(data[oppRole]);
        }
        if (role === 'guest' && data.questions && questions.length === 0) {
          setQuestions(data.questions);
        }
      }
    });
    return () => unsubscribe();
  }, [roomCode, role, questions.length]);

  // 2. HOST MENGACAK SOAL
  useEffect(() => {
    if (role === 'host' && questions.length === 0) {
      const shuffled = [...quizData].sort(() => 0.5 - Math.random());
      const selectedQs = shuffled.slice(0, 15);
      setQuestions(selectedQs);
      update(ref(db, `rooms/${roomCode}`), { questions: selectedQs });
    }
  }, [role, roomCode, questions.length]);

  // 3. EFEK TIMER
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered, questions]);

  // 4. AUTO-ADVANCE & KIRIM DATA STATISTIK LENGKAP
  useEffect(() => {
    if (isAnswered) {
      const autoNextTimer = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setTimeLeft(5);
          setSelectedOption(null);
          setIsAnswered(false);
        } else {
          // HITUNG RATA-RATA KECEPATAN
          const avgSpeed = (totalResponseTime / questions.length).toFixed(1);
          
          // KIRIM SEMUA DATA KE APP.JSX
          onFinish({
            score: score,
            correct: correctCount,
            speed: avgSpeed,
            streak: maxStreak,
            total: questions.length,
            opponentScore: opponentData?.score || 0,
            opponentName: opponentData?.name || 'Opponent',
            opponentAvatar: opponentData?.avatarIndex || 0
          });
        }
      }, 1500); 
      return () => clearTimeout(autoNextTimer);
    }
  }, [isAnswered, currentIndex, questions.length, score, totalResponseTime, correctCount, maxStreak, opponentData, onFinish]);

  // 5. UPDATE FIREBASE SKOR
  const updateFirebaseScore = (newScore) => {
    setScore(newScore);
    update(ref(db, `rooms/${roomCode}/${role}`), { score: newScore });
  };

  const handleAnswerClick = (optionId) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);

    // Hitung kecepatan menjawab
    const responseTime = 5 - timeLeft;
    setTotalResponseTime((prev) => prev + responseTime);

    const isCorrect = optionId === questions[currentIndex].answer;
    if (isCorrect) {
      updateFirebaseScore(score + 20 + timeLeft);
      setCorrectCount((prev) => prev + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak)); // Simpan rekor streak
    } else {
      updateFirebaseScore(Math.max(0, score - 5));
      setCurrentStreak(0); // Streak hangus
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setTotalResponseTime((prev) => prev + 5); // Penalti waktu 5 detik
    updateFirebaseScore(Math.max(0, score - 5));
    setCurrentStreak(0); // Streak hangus
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-gray-400 animate-pulse">Syncing battle data...</p>
      </div>
    );
  }

  const currentQuiz = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#4EA3E7] bg-white">
                <img src={myAvatarSrc} alt="You" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-base font-black text-[#8C5221] leading-none">TriviGo</h1>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Q: {currentIndex + 1}/{questions.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-[#4EA3E7] uppercase tracking-wider">You</span>
                <span className="text-xl font-black text-[#4EA3E7] leading-none">{score}</span>
            </div>
            <div className="w-[1px] h-6 bg-gray-200"></div>
            <div className="flex flex-col items-center animate-fade-in">
                <span className="text-[8px] font-bold text-red-400 uppercase tracking-wider line-clamp-1 max-w-[40px]">
                  {opponentData?.name || 'Enemy'}
                </span>
                <span className="text-xl font-black text-red-400 leading-none">{opponentData?.score || 0}</span>
            </div>
          </div>
        </div>

        {/* TIMER BAR */}
        <TimerBar duration={5} timeLeft={timeLeft} />

        {/* QUESTION CARD */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-50 flex-1 flex flex-col justify-center items-center text-center relative mb-5">
            <span className="text-[10px] font-black text-[#4EA3E7] uppercase tracking-[0.2em] mb-3">{currentQuiz.category}</span>
            <h2 className="text-xl font-black text-gray-800 tracking-tight leading-tight px-1">{currentQuiz.question}</h2>
        </div>

        {/* OPTIONS GRID */}
        <div className="flex flex-col gap-2.5 mb-5">
          {Object.entries(currentQuiz.options).map(([id, label]) => {
            let btnStyle = 'bg-white border-gray-100 hover:border-gray-200';
            let badgeStyle = 'bg-gray-100 border-gray-200 text-gray-400';
            let isCorrectOption = id === currentQuiz.answer;

            if (isAnswered) {
              if (isCorrectOption) {
                btnStyle = 'bg-[#EBF7F0] border-[#4ADE80] shadow-sm';
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
                disabled={isAnswered}
                onClick={() => handleAnswerClick(id)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all ${btnStyle}`}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Option {id}</span>
                  <span className="text-base font-black text-gray-700">{label}</span>
                </div>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs font-bold ${badgeStyle}`}>
                  {isAnswered && isCorrectOption ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> : isAnswered && selectedOption === id ? 'X' : id}
                </div>
              </button>
            );
          })}
        </div>

        {/* BOTTOM STATUS */}
        <div className="mt-auto flex flex-col items-center justify-center min-h-[50px]">
            {isAnswered ? (
              <p className="text-xs font-extrabold text-[#4EA3E7] animate-pulse py-2">Waiting for sync...</p>
            ) : (
              <p className="text-[11px] font-bold text-gray-400 italic py-2">{timeLeft === 0 ? "Time's up!" : 'Beat your opponent! ⚔️'}</p>
            )}
        </div>

      </div>
    </div>
  );
}