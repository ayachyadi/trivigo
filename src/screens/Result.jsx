import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, get } from 'firebase/database'; 

// Placeholder gambar. Nanti ganti dengan import dari src/assets/images/
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

// --- TAMBAHAN ICON SVG ---
const IconThumbUp = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
  </svg>
);

const IconThumbDown = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zM17 2H20a2 2 0 012 2v7a2 2 0 01-2 2h-3"></path>
  </svg>
);

const IconTrophy = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
// -------------------------

export default function Result({ playerData, score, stats, mode = 'solo', opponentData, onRematch, onBackToMenu, onViewLeaderboard }) {
  const name = playerData?.name || 'Explorer';
  const avatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];

  const [topPlayer, setTopPlayer] = useState(null);

  useEffect(() => {
    if (mode === 'solo') {
      const lbRef = ref(db, 'leaderboard');
      get(lbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const lbArray = Object.keys(data).map(key => ({
            name: key,
            ...data[key]
          })).sort((a, b) => b.score - a.score);

          if (lbArray.length > 0) {
            setTopPlayer(lbArray[0]);
          }
        }
      }).catch(err => console.error("Gagal memuat top player:", err));
    }
  }, [mode]);

  // Logika Wording, Warna, dan Icon
  let headingText = 'Great Job!';
  let subHeadingText = 'Practice makes perfect!';
  let headerColor = 'text-[#8C5221]';
  let badgeColor = 'bg-[#EE9432]';
  let statusIcon = <IconTrophy />; 

  let oppName = 'Opponent';
  let oppScore = 0;
  let oppAvatar = AVATAR_LIST[0];

  if (mode === 'pvp') {
    oppName = opponentData?.name || 'Opponent';
    oppScore = opponentData?.score || 0;
    oppAvatar = AVATAR_LIST[opponentData?.avatarIndex ?? 0];

    if (opponentData) {
      if (score > oppScore) {
        headingText = 'You Win! 🎉';
        subHeadingText = 'Exceptional knowledge!';
        statusIcon = <IconThumbUp />;
      } else if (score < oppScore) {
        headingText = 'You Lose! 💥';
        subHeadingText = 'Better luck next time!';
        headerColor = 'text-red-500';
        badgeColor = 'bg-red-400';
        statusIcon = <IconThumbDown />;
      } else {
        headingText = "It's a Tie! 🤝";
        subHeadingText = 'A very close battle!';
        headerColor = 'text-blue-500';
        badgeColor = 'bg-blue-400';
        statusIcon = <IconTrophy />;
      }
    }
  } else {
    oppName = topPlayer ? topPlayer.name : 'Target Score';
    oppScore = topPlayer ? topPlayer.score : 100;
    oppAvatar = topPlayer ? AVATAR_LIST[topPlayer.avatarIndex] : 'https://api.dicebear.com/7.x/bottts/svg?seed=target';

    if (topPlayer) {
      if (score > oppScore) {
        headingText = 'Beat the King! 🎉';
        subHeadingText = 'You are the new champion!';
        statusIcon = <IconThumbUp />;
      } else {
        headingText = 'Try Again!';
        subHeadingText = 'Practice to beat the King!';
        headerColor = 'text-red-500';
        badgeColor = 'bg-red-400';
        statusIcon = <IconThumbDown />;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
              <img src={avatarSrc} alt="User" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-black text-[#8C5221] tracking-tight">TriviGo</h1>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
          </button>
        </div>

        {/* CELEBRATION BADGE & WORDING */}
        <div className="text-center mb-4">
          <div className={`w-14 h-14 ${badgeColor} rounded-2xl flex items-center justify-center text-white mx-auto shadow-md mb-2 transition-colors`}>
            {statusIcon}
          </div>
          <h2 className={`text-2xl font-black ${headerColor} tracking-tight mb-0.5 transition-colors`}>{headingText}</h2>
          <p className="text-gray-400 text-xs font-medium">{subHeadingText}</p>
        </div>

        {/* SCORE CARD PERFORMANCE */}
        <div className="bg-white rounded-[2rem] p-4 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.04)] border border-gray-100 relative mb-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EE9432] to-[#4EA3E7] rounded-t-[2rem]"></div>
          
          <div className="flex items-center justify-center gap-8 py-2 mb-3">
            {/* Player (You) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-[#8C5221] p-0.5 bg-white">
                  <img src={avatarSrc} alt="You" className="w-full h-full object-cover rounded-xl" />
                </div>
                {mode === 'pvp' && score > oppScore && (
                  <div className="absolute -bottom-1 -right-1 bg-[#8C5221] text-white p-1 rounded-lg border border-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-black text-gray-700 mt-1.5">{name} (You)</span>
              <span className="text-xl font-black text-[#8C5221] mt-0.5">{score}</span>
            </div>

            {/* VS Circle */}
            <div className="w-7 h-7 rounded-xl bg-[#EAEAEA] flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white shadow-sm mt-[-20px]">
              vs
            </div>

            {/* Opponent Profile (PvP atau Top Global) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 ${mode === 'pvp' && oppScore > score ? 'border-[#4EA3E7]' : (mode === 'solo' && topPlayer ? 'border-[#F59E0B]' : 'border-gray-200')} p-0.5 bg-white`}>
                  <img src={oppAvatar} alt="Opponent" className="w-full h-full object-cover rounded-xl" />
                </div>
                {/* Lencana Pemenang Khusus PvP */}
                {mode === 'pvp' && oppScore > score && (
                  <div className="absolute -bottom-1 -right-1 bg-[#4EA3E7] text-white p-1 rounded-lg border border-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
                {/* Lencana Mahkota Khusus Solo Mode (Top Global) */}
                {mode === 'solo' && topPlayer && (
                  <div className="absolute -bottom-1 -right-1 bg-[#F59E0B] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md border border-white shadow-sm">
                    #1
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-400 mt-1.5 line-clamp-1 max-w-[60px] text-center">
                {oppName} {mode === 'solo' && topPlayer && '👑'}
              </span>
              <span className={`text-xl font-black mt-0.5 ${mode === 'pvp' && oppScore > score ? 'text-[#4EA3E7]' : (mode === 'solo' && topPlayer ? 'text-[#F59E0B]' : 'text-gray-300')}`}>
                {oppScore}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 my-3"></div>

          {/* Mini Stats (Dinamic) */}
          <div className="grid grid-cols-3 text-center py-1">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Correct</span>
              <span className="text-sm font-black text-gray-700">{stats?.correct || 0}/{stats?.total || 5}</span>
            </div>
            <div className="flex flex-col border-x border-gray-100">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Speed</span>
              <span className="text-sm font-black text-gray-700">{stats?.speed || '0.0'}s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Streak</span>
              <span className="text-sm font-black text-gray-700">x{stats?.streak || 0}</span>
            </div>
          </div>
        </div>

        {/* DAILY RANK LEADERBOARD (Mockup) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-sm font-black text-gray-800 tracking-tight">Daily Rank</h3>
            <span onClick={onViewLeaderboard} className="text-xs font-bold text-[#4EA3E7] cursor-pointer hover:underline active:scale-95 transition-transform">View Global</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-0.5">
            <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border-2 border-[#D4AF37]/40 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-[#8C5221] w-5 text-center">🏆</span>
                <div className="w-7 h-7 rounded-xl bg-[#FCE3CC] flex items-center justify-center text-[10px] font-black text-[#8C5221]">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-black text-gray-700">{name} (You)</span>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                +{score} 📈
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="mt-auto pt-4 flex flex-col gap-2.5">
          <button 
            onClick={onRematch}
            className="w-full bg-[#EE9432] hover:bg-[#d98126] text-white py-3 rounded-full font-black text-base shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            
            Rematch
          </button>

          <button 
            onClick={onBackToMenu}
            className="w-full bg-white hover:bg-gray-50 text-[#4EA3E7] border-2 border-[#4EA3E7] py-2.5 rounded-full font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
}