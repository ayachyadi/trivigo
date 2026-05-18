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

export default function Leaderboard({ playerData, onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const myName = playerData?.name?.toUpperCase() || '';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const lbRef = ref(db, 'leaderboard');
        const snapshot = await get(lbRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Ubah object Firebase menjadi Array
          const lbArray = Object.keys(data).map(key => ({
            name: key,
            ...data[key]
          }));

          // Urutkan berdasarkan skor tertinggi ke terendah
          lbArray.sort((a, b) => b.score - a.score);

          // Batasi HANYA 25 baris teratas
          setLeaders(lbArray.slice(0, 25));
        }
      } catch (error) {
        console.error("Gagal menarik data leaderboard:", error);
      } finally {
        // Buat timestamp kapan data ini di-generate
        const now = new Date();
        const formattedDate = now.toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric'
        }) + ' - ' + now.toLocaleTimeString('id-ID', {
          hour: '2-digit', minute: '2-digit'
        });
        
        setLastUpdated(formattedDate);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-[#8C5221] tracking-tight">Top 25 Global</h1>
          </div>
          <div className="w-9 h-9"></div> {/* Spacer */}
        </div>

        {/* LIST LEADERBOARD */}
        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#EE9432] rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-gray-400 animate-pulse">Memuat klasemen...</span>
            </div>
          ) : leaders.length > 0 ? (
            leaders.map((player, index) => {
              const rank = index + 1;
              const isMe = player.name === myName;
              
              // Styling khusus untuk Top 3
              let rankBadge = "bg-gray-100 text-gray-500";
              let borderStyle = "border-gray-100";
              
              if (rank === 1) { rankBadge = "bg-yellow-100 text-yellow-600"; borderStyle = "border-yellow-400 shadow-md"; }
              else if (rank === 2) { rankBadge = "bg-gray-200 text-gray-700"; borderStyle = "border-gray-300"; }
              else if (rank === 3) { rankBadge = "bg-orange-100 text-orange-700"; borderStyle = "border-[#CD7F32]"; }

              return (
                <div 
                  key={player.name} 
                  className={`bg-white rounded-2xl p-3 flex items-center justify-between border-2 transition-all ${
                    isMe ? 'border-[#4EA3E7] shadow-[0_0_15px_rgba(78,163,231,0.2)]' : borderStyle
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${rankBadge}`}>
                      {rank === 1 ? '👑' : rank}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={AVATAR_LIST[player.avatarIndex || 1]} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-black text-gray-800">
                        {player.name} {isMe && <span className="text-[10px] text-[#4EA3E7] ml-1">(You)</span>}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`text-sm font-black ${isMe ? 'text-[#4EA3E7]' : 'text-[#8C5221]'}`}>
                    {player.score} <span className="text-[10px] text-gray-400 font-bold">pts</span>
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-4xl mb-2">🏜️</span>
              <span className="text-sm font-bold text-gray-400">Klasemen masih kosong.</span>
            </div>
          )}
        </div>

        {/* TIMESTAMP GENERATE (Kecil di bawah) */}
        {!isLoading && (
          <div className="mt-auto pt-3 border-t border-gray-200 flex justify-center">
            <span className="text-[10px] font-bold text-gray-400 italic">
              Last updated: {lastUpdated}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}