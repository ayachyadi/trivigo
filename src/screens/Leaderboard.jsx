import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

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

export default function Leaderboard({ playerData, onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const myName = playerData?.name?.toUpperCase() || '';

  // Mengambil data dari Firebase secara realtime
  useEffect(() => {
    const lbRef = ref(db, 'leaderboard');
    const unsubscribe = onValue(lbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Ubah objek Firebase menjadi Array, lalu urutkan berdasarkan skor tertinggi
        const lbArray = Object.keys(data).map(key => ({
          name: key,
          ...data[key]
        })).sort((a, b) => b.score - a.score);
        
        setLeaders(lbArray);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          {/* Tombol Back tetap bulat */}
          <button onClick={onBack} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-xl font-black text-[#8C5221] tracking-tight">Global Rank</h1>
          <div className="w-8 h-8 opacity-0"></div> {/* Spacer */}
        </div>

        {/* PODIUM ILLUSTRATION */}
        <div className="flex justify-center items-end gap-2 mb-8 h-24 px-4">
            {/* Rank 2 */}
            {leaders[1] && (
                <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-4 border-gray-300 bg-white mb-2 z-10">
                        <img src={AVATAR_LIST[leaders[1].avatarIndex]} alt="2nd" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-16 h-12 bg-gray-200 rounded-t-lg border-b-4 border-gray-300 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-400">2</span>
                    </div>
                </div>
            )}
            {/* Rank 1 */}
            {leaders[0] && (
                <div className="flex flex-col items-center z-10 animate-float">
                    {/* Diubah menjadi rounded-2xl karena ukurannya lebih besar */}
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-4 border-[#FBBF24] bg-white mb-2 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                        <img src={AVATAR_LIST[leaders[0].avatarIndex]} alt="1st" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-b from-[#FCD34D] to-[#F59E0B] rounded-t-lg border-b-4 border-[#D97706] flex items-center justify-center">
                        <span className="text-2xl font-black text-white drop-shadow-md">1</span>
                    </div>
                </div>
            )}
            {/* Rank 3 */}
            {leaders[2] && (
                <div className="flex flex-col items-center animate-fade-in">
                    {/* Diubah menjadi rounded-xl */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-4 border-[#D97706] bg-white mb-2 z-10">
                        <img src={AVATAR_LIST[leaders[2].avatarIndex]} alt="3rd" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-16 h-10 bg-[#FDE68A] rounded-t-lg border-b-4 border-[#D97706] flex items-center justify-center">
                        <span className="text-xl font-black text-[#D97706]">3</span>
                    </div>
                </div>
            )}
        </div>

        {/* LEADERBOARD LIST */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] p-4 flex flex-col overflow-hidden border border-gray-100">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    {/* Spinner loading tetap bulat */}
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#EE9432] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
                    {leaders.map((player, index) => {
                        const isMe = player.name === myName;
                        return (
                            <div key={index} className={`rounded-2xl p-3 flex items-center justify-between border-2 transition-all ${isMe ? 'border-[#EE9432] bg-orange-50/50 shadow-sm' : 'border-transparent bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 text-center font-black ${index === 0 ? 'text-[#F59E0B]' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-[#D97706]' : 'text-gray-300'}`}>
                                        #{index + 1}
                                    </span>
                                    {/* Avatar kecil di list diubah menjadi rounded-xl */}
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 overflow-hidden">
                                        <img src={AVATAR_LIST[player.avatarIndex]} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`text-sm font-black ${isMe ? 'text-[#8C5221]' : 'text-gray-700'}`}>
                                        {player.name} {isMe && '(You)'}
                                    </span>
                                </div>
                                <span className={`text-sm font-black ${isMe ? 'text-[#EE9432]' : 'text-gray-500'}`}>
                                    {player.score} <span className="text-[10px] text-gray-400 font-bold ml-0.5">pts</span>
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}