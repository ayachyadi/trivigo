import { useState, useEffect } from 'react';
import { db } from '../firebase'; // <-- Tambahkan import database
import { ref, onValue } from 'firebase/database'; // <-- Tambahkan import pembaca data

// Placeholder list avatar yang sama dengan Onboarding
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

export default function MainMenu({ playerData, onLogOut, onSelectPvP, onSelectSolo }) { 
  const name = playerData?.name || 'Explorer!';
  const avatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];

  // STATE BARU: Menyimpan peringkat global
  const [globalRank, setGlobalRank] = useState(0);

  // EFEK BARU: Membaca dan menghitung ranking dari Firebase secara live
  useEffect(() => {
    const lbRef = ref(db, 'leaderboard');
    const unsubscribe = onValue(lbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Urutkan leaderboard
        const sortedLeaderboard = Object.keys(data)
          .map(key => ({ name: key, ...data[key] }))
          .sort((a, b) => b.score - a.score);

        // Cari posisi nama pemain saat ini
        const myIndex = sortedLeaderboard.findIndex(
          (player) => player.name === name.toUpperCase()
        );

        if (myIndex !== -1) {
          setGlobalRank(myIndex + 1); // +1 karena index array dimulai dari 0
        } else {
          setGlobalRank(0);
        }
      } else {
        setGlobalRank(0);
      }
    });

    return () => unsubscribe();
  }, [name]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      
      {/* Container Mobile Frame - Tinggi disamakan persis dengan Onboarding (720px) */}
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* Top Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 bg-white cursor-pointer" onClick={onLogOut}>
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              </div>
              {/* LABEL RANKING DINAMIS (Menggantikan LV 12) */}
              <div className="absolute -bottom-1 -left-1 bg-[#8C5221] text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full border border-white shadow-sm min-w-[20px] text-center">
                {globalRank > 0 ? `#${globalRank}` : '0'}
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-gray-400 text-xs font-medium">Hello,</span>
              <span className="text-2xl font-black text-[#8C5221] tracking-tight">{name}</span>
            </div>
          </div>

          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>

        {/* Title Greeting */}
        <div className="text-center mb-5">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Ready to play?</h2>
          <p className="text-gray-500 text-sm font-medium">Choose your game mode to start</p>
        </div>

        {/* MODE CARDS - Jarak disesuaikan agar pas dalam bingkai 720px */}
        <div className="flex flex-col gap-4 flex-1">
          
          {/* CARD 1: TIME TRIAL */}
          <div 
            onClick={onSelectSolo} 
            className="bg-[#EE9432] rounded-[1.8rem] p-5 text-white relative overflow-hidden shadow-lg shadow-orange-500/10 flex flex-col justify-between h-[155px] cursor-pointer group hover:scale-[1.01] transition-transform"
          >
            <svg className="absolute right-[-15px] bottom-[-15px] w-40 h-40 text-black/10 transition-transform group-hover:scale-110 duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <div className="max-w-[70%]">
                <h3 className="text-xl font-bold tracking-tight mb-0.5">Time Trial (Solo)</h3>
                <p className="text-white/80 text-[10px] font-medium line-clamp-1 uppercase tracking-wider">Beat the clock</p>
              </div>
              <button className="bg-white text-[#EE9432] font-black text-[10px] tracking-wider px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                PLAY <span>&#9655;</span>
              </button>
            </div>
          </div>

          {/* CARD 2: VERSUS PLAYER */}
          <div 
            onClick={onSelectPvP}
            className="bg-[#4EA3E7] rounded-[1.8rem] p-5 text-white relative overflow-hidden shadow-lg shadow-blue-500/10 flex flex-col justify-between h-[155px] cursor-pointer group hover:scale-[1.01] transition-transform"
          >
            <svg className="absolute right-[-10px] bottom-[-10px] w-36 h-36 text-black/10 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 11L3 19M21 3L13 11M16 4.5L19.5 8M4.5 16L8 19.5M10 5L19 14M5 10L14 19"></path>
            </svg>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 11L3 19M21 3L13 11M16 4.5L19.5 8"></path>
              </svg>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <div className="max-w-[70%]">
                <h3 className="text-xl font-bold tracking-tight mb-0.5">Versus Player (PvP)</h3>
                <p className="text-white/80 text-[10px] font-medium line-clamp-1 uppercase tracking-wider">Challenge friends</p>
              </div>
              <button className="bg-white text-[#4EA3E7] font-black text-[10px] tracking-wider px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                BATTLE <span>&#9655;</span>
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM DAILY CHALLENGE BANNER - Tombol Quick Start dihapus */}
        <div className="mt-6 bg-[#EDF1F5] rounded-[1.8rem] p-5 flex items-center justify-between h-[85px] mb-2">
          <div className="flex flex-col gap-2 w-[70%]">
            <span className="text-xs font-black text-gray-800 tracking-tight">Daily Challenge</span>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <div className="bg-[#4EA3E7] h-full w-[60%] rounded-full"></div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">3 / 5 Wins</span>
            </div>
          </div>
          
          <button className="w-11 h-11 rounded-full bg-[#FCE3CC] flex items-center justify-center text-[#8C5221] shadow-sm active:scale-95 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}