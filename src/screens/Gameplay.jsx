import { useState, useEffect } from 'react';
import TimerBar from '../components/game/TimerBar';
import { getFreshQuestions } from '../utils/questionEngine';

import avatar1 from '../assets/avatar/Bluter.svg';
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

export default function Gameplay({ playerData, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // STATE STATISTIK BARU
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalResponseTime, setTotalResponseTime] = useState(0);

  // MUNDUR BARU: State khusus hitung mundur awal pertandingan
  const [startCountdown, setStartCountdown] = useState(3);

  useEffect(() => {
  // Mesin akan otomatis mencarikan soal yang belum pernah dimainkan
  const freshQuestions = getFreshQuestions(15);
  setQuestions(freshQuestions); 
}, []);

  // ==========================================
  // LOGIKA BARU: Efek Penghitung Mundur Awal 3, 2, 1
  // ==========================================
  useEffect(() => {
    if (questions.length === 0) return; 
    
    if (startCountdown > 0) {
      const timer = setTimeout(() => {
        setStartCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startCountdown, questions.length]);

  // ==========================================
  // PERBAIKAN TIMER: Ditambahkan syarat startCountdown === 0
  // ==========================================
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && questions.length > 0 && startCountdown === 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && startCountdown === 0) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered, questions, startCountdown]);

  useEffect(() => {
    if (isAnswered) {
      const autoNextTimer = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setTimeLeft(5); 
          setSelectedOption(null); 
          setIsAnswered(false); 
        } else {
          // HITUNG RATA-RATA KECEPATAN & KIRIM OBJEK HASIL
          const avgSpeed = (totalResponseTime / questions.length).toFixed(1);
          onFinish({
            score: score,
            correct: correctCount,
            speed: avgSpeed,
            streak: maxStreak,
            total: questions.length
          });
        }
      }, 1500); 

      return () => clearTimeout(autoNextTimer);
    }
  }, [isAnswered, currentIndex, questions.length, score, totalResponseTime, correctCount, maxStreak, onFinish]);

  const currentQuiz = questions[currentIndex];
  const avatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];

  const handleAnswerClick = (optionId) => {
    // Kunci tombol saat countdown berjalan
    if (isAnswered || startCountdown > 0) return;

    setSelectedOption(optionId);
    setIsAnswered(true);

    // Hitung kecepatan menjawab (5 detik - sisa waktu)
    const responseTime = 5 - timeLeft;
    setTotalResponseTime((prev) => prev + responseTime);

    const isCorrect = optionId === currentQuiz.answer;
    if (isCorrect) {
      // Mengubah rumus skor mengikuti mode party: Dasar 20 + Bonus (2 x Sisa Detik)
      setScore((prev) => prev + 20 + (timeLeft * 2)); 
      setCorrectCount((prev) => prev + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak)); // Simpan rekor streak tertinggi
    } else {
      setScore((prev) => Math.max(0, prev - 5)); 
      setCurrentStreak(0); // Streak hangus
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setTotalResponseTime((prev) => prev + 5); // Penalti waktu penuh 5 detik
    setScore((prev) => Math.max(0, prev - 5));
    setCurrentStreak(0); // Streak hangus
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // INTERSEPTOR: Tampilkan Layar Hitung Mundur Raksasa sebelum mulai
  if (startCountdown > 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col items-center justify-center h-[720px] max-h-[95vh] relative overflow-hidden text-center">
          <span className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4">Prepare Yourself</span>
          <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-[#EE9432] flex items-center justify-center shadow-md animate-bounce-in">
            <span className="text-5xl font-black text-[#8C5221]">{startCountdown}</span>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-6 animate-pulse">Kuis Solo akan segera dimulai!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-orange-200 bg-white">
                <img src={avatarSrc} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-base font-black text-[#8C5221] leading-none">TriviGo</h1>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Question {currentIndex + 1}/{questions.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Score</span>
                <span className="text-xl font-black text-[#4EA3E7] leading-none">{score}</span>
            </div>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-[#EE9432] rounded-md">Solo</span>
          </div>
        </div>

        <TimerBar duration={5} timeLeft={timeLeft} />

        <div className="bg-white rounded-[2rem] p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-50 flex-1 flex flex-col justify-center items-center text-center relative mb-5">
            <span className="text-[10px] font-black text-[#4EA3E7] uppercase tracking-[0.2em] mb-3">{currentQuiz.category}</span>
            <h2 className="text-xl font-black text-gray-800 tracking-tight leading-tight px-1">{currentQuiz.question}</h2>
        </div>

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
              <button key={id} disabled={isAnswered} onClick={() => handleAnswerClick(id)} className={`w-full p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all ${btnStyle}`}>
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

        <div className="mt-auto flex flex-col items-center justify-center min-h-[50px]">
            {isAnswered ? (
              <p className="text-xs font-extrabold text-[#EE9432] animate-pulse flex items-center gap-1.5 py-2">Preparing next question...</p>
            ) : (
              <p className="text-[11px] font-bold text-gray-400 italic py-2">{timeLeft === 0 ? "Time's up! 😮" : 'Think fast, clock is ticking! ⚡'}</p>
            )}
        </div>

      </div>
    </div>
  );
}