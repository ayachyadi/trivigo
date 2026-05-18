import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, get } from 'firebase/database'; 

import avatar1 from '../assets/avatar/Bluter.svg'; 
import avatar2 from '../assets/avatar/Gribir.svg';
import avatar3 from '../assets/avatar/Lady.svg';
import avatar4 from '../assets/avatar/Moko.svg';
import avatar5 from '../assets/avatar/Pinko.svg';
import avatar6 from '../assets/avatar/Renji.svg';

const AVATAR_LIST = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export default function Result({ playerData, score, stats, mode, opponentData, onRematch, onBackToMenu, onViewLeaderboard }) {
  
  // 1. DETEKSI MODE PARTY
  const isPartyMode = mode === 'pvp' && opponentData?.players;
  let sortedPlayers = [];
  let myRank = 0;

  if (isPartyMode) {
    sortedPlayers = Object.values(opponentData.players).sort((a, b) => b.score - a.score);
    myRank = sortedPlayers.findIndex(p => p.name.toUpperCase() === playerData?.name?.toUpperCase()) + 1;
  }

  const myAvatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 z-10">
          <button onClick={onBackToMenu} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Match Result</h1>
          <button onClick={onViewLeaderboard} className="p-2 bg-[#FCE3CC] hover:bg-[#fbd2b0] rounded-full transition-colors text-[#8C5221]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAMPILAN MODE PARTY (PODIUM KLASEMEN 3D)   */}
        {/* ========================================== */}
        {isPartyMode ? (
          <div className="flex-1 flex flex-col pt-2">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-[#8C5221] uppercase tracking-wider mb-1">
                {myRank === 1 ? 'VICTORY! 🎉' : 'MATCH OVER'}
              </h2>
              <p className="text-gray-500 font-bold text-sm">You finished at Rank #{myRank}</p>
            </div>

            {/* PODIUM 3D UNTUK TOP 3 */}
            <div className="flex items-end justify-center gap-2 h-[180px] mb-8 mt-2">
              
              {/* JUARA 2 (Silver) */}
              {sortedPlayers[1] ? (
                <div className="flex flex-col items-center w-1/3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-gray-300 mb-2 z-10 bg-white shadow-md">
                    <img src={AVATAR_LIST[sortedPlayers[1].avatarIndex || 1]} alt="2nd" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-gray-300 to-gray-400 w-full rounded-t-xl h-[80px] flex flex-col items-center justify-start pt-2 text-white shadow-lg relative overflow-hidden">
                    <span className="font-black text-2xl opacity-50">2</span>
                    <span className="text-[10px] font-bold mt-1 line-clamp-1 px-1">{sortedPlayers[1].name}</span>
                    <span className="text-[10px] font-black text-gray-800 absolute bottom-2 bg-white/80 px-2 rounded-full">{sortedPlayers[1].score} pts</span>
                  </div>
                </div>
              ) : <div className="w-1/3 h-[80px] border-2 border-dashed border-gray-200 rounded-t-xl opacity-50 flex items-center justify-center text-gray-400 font-bold text-xs">-</div>}

              {/* JUARA 1 (Gold) */}
              {sortedPlayers[0] && (
                <div className="flex flex-col items-center w-1/3 animate-bounce-in z-20">
                  <div className="text-3xl mb-1 drop-shadow-md">👑</div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-yellow-400 mb-2 z-10 bg-white shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                    <img src={AVATAR_LIST[sortedPlayers[0].avatarIndex || 1]} alt="1st" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 w-full rounded-t-xl h-[120px] flex flex-col items-center justify-start pt-2 text-white shadow-2xl relative overflow-hidden">
                    <span className="font-black text-3xl opacity-50">1</span>
                    <span className="text-xs font-bold mt-1 line-clamp-1 px-1">{sortedPlayers[0].name}</span>
                    <span className="text-[11px] font-black text-gray-900 absolute bottom-3 bg-white px-2 py-0.5 rounded-full shadow-sm">{sortedPlayers[0].score} pts</span>
                  </div>
                </div>
              )}

              {/* JUARA 3 (Bronze) */}
              {sortedPlayers[2] ? (
                <div className="flex flex-col items-center w-1/3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-[#CD7F32] mb-2 z-10 bg-white shadow-md">
                    <img src={AVATAR_LIST[sortedPlayers[2].avatarIndex || 1]} alt="3rd" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-[#CD7F32] to-[#8c5622] w-full rounded-t-xl h-[50px] flex flex-col items-center justify-start pt-2 text-white shadow-lg relative overflow-hidden">
                    <span className="font-black text-2xl opacity-50">3</span>
                    <span className="text-[10px] font-bold mt-1 line-clamp-1 px-1">{sortedPlayers[2].name}</span>
                    <span className="text-[10px] font-black text-gray-800 absolute bottom-1 bg-white/80 px-2 rounded-full">{sortedPlayers[2].score} pts</span>
                  </div>
                </div>
              ) : <div className="w-1/3 h-[50px] border-2 border-dashed border-gray-200 rounded-t-xl opacity-50 flex items-center justify-center text-gray-400 font-bold text-xs">-</div>}

            </div>

            {/* DAFTAR PEMAIN SISANYA (Rank 4 & 5) DENGAN ICON KOTORAN */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
               {sortedPlayers.slice(3).map((p, idx) => (
                 <div key={idx} className="bg-[#FAF0E6] rounded-2xl p-3 flex items-center justify-between border border-[#e6d5c3] shadow-sm animate-fade-in">
                   <div className="flex items-center gap-3">
                     <span className="text-lg w-5 text-center drop-shadow-sm">💩</span>
                     <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d2bba3] bg-white opacity-80 grayscale-[30%]">
                       <img src={AVATAR_LIST[p.avatarIndex || 1]} alt={p.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-sm font-bold text-[#7a5c43]">{p.name}</span>
                   </div>
                   <span className="text-sm font-black text-[#a67b5b]">{p.score} pts</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          
          /* ========================================== */
          /* TAMPILAN MODE SOLO (KLASIK)                */
          /* ========================================== */
          <div className="flex-1 flex flex-col pt-2">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-full h-full text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white">
                    <img src={myAvatarSrc} alt="You" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#8C5221] uppercase tracking-wider mb-1">Time's Up!</h2>
              <p className="text-gray-500 font-medium text-sm">Here is your solo performance</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 mb-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total Score</span>
                <span className="text-6xl font-black text-gray-800 tracking-tighter">{score}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#EBF7F0] p-4 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#4ADE80] mb-1">{stats?.correct}/{stats?.total}</span>
                  <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-wider">Correct</span>
                </div>
                <div className="bg-[#FEF5ED] p-4 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#EE9432] mb-1">{stats?.streak}</span>
                  <span className="text-[10px] font-bold text-[#EE9432] uppercase tracking-wider">Top Streak</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="mt-auto pt-4 flex flex-col gap-2.5">
          <button 
            onClick={onRematch}
            className="w-full bg-[#EE9432] hover:bg-[#d98126] text-white py-4 rounded-full font-black text-lg shadow-md active:scale-95 transition-transform"
          >
            {isPartyMode ? 'Play Another Match' : 'Play Again'}
          </button>

          <button 
            onClick={onBackToMenu}
            className="w-full bg-white hover:bg-gray-50 text-gray-500 border-2 border-gray-200 py-3.5 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
}