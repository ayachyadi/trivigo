import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, update, get } from 'firebase/database';

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

export default function Lobby({ playerData, onBack, onStartMultiplayer }) {
  const [activeTab, setActiveTab] = useState('host'); 
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState(''); 
  const [roomData, setRoomData] = useState(null); 

  const name = playerData?.name || 'Explorer';
  const avatarIndex = playerData?.avatarIndex ?? 1;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);

      if (data && data.status === 'playing') {
        const role = activeTab === 'host' ? 'host' : 'guest';
        onStartMultiplayer(roomCode, role);
      }
    });

    return () => unsubscribe();
  }, [roomCode, activeTab, onStartMultiplayer]);

  const handleCreateRoom = () => {
    const newCode = generateRandomCode();
    setRoomCode(newCode);

    const roomRef = ref(db, `rooms/${newCode}`);
    set(roomRef, {
      status: 'waiting',
      host: { name, avatarIndex, score: 0 },
      guest: null
    });
  };

  const handleJoinRoom = async () => {
    const targetCode = inputCode.toUpperCase().trim();
    if (targetCode.length !== 4) {
      alert('Kode harus 4 digit!');
      return;
    }

    const roomRef = ref(db, `rooms/${targetCode}`);
    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.guest) {
        alert('Maaf, ruangan ini sudah penuh!');
        return;
      }

      await update(roomRef, {
        guest: { name, avatarIndex, score: 0 },
        status: 'ready'
      });

      setRoomCode(targetCode);
      
    } else {
      alert('Ruangan tidak ditemukan! Periksa kembali kodenya.');
    }
  };

  const handleActionButton = () => {
    if (activeTab === 'host') {
      if (!roomCode) {
        handleCreateRoom();
      } else if (roomData?.guest) {
        update(ref(db, `rooms/${roomCode}`), { status: 'playing' });
      }
    } else {
      if (!roomCode) {
        handleJoinRoom();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-5 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-xl font-black text-[#8C5221] tracking-tight">Multiplayer</h1>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white">
            <img src={AVATAR_LIST[avatarIndex]} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* SUB-TAB */}
        <div className="bg-[#EFF2F5] p-1 rounded-full flex mb-6">
          <button 
            disabled={!!roomCode}
            onClick={() => setActiveTab('host')}
            className={`w-1/2 py-2.5 text-xs font-bold rounded-full transition-all ${activeTab === 'host' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 opacity-60'}`}
          >
            Host Game
          </button>
          <button 
            disabled={!!roomCode}
            onClick={() => setActiveTab('join')}
            className={`w-1/2 py-2.5 text-xs font-bold rounded-full transition-all ${activeTab === 'join' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 opacity-60'}`}
          >
            Join Game
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 flex flex-col items-center pt-2">
          {activeTab === 'host' ? (
            <>
              {roomCode ? (
                <>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-2 uppercase">Your Room Code</span>
                  <div className="bg-white border border-orange-100 rounded-3xl px-12 py-4 shadow-[0_10px_25px_-5px_rgba(238,148,50,0.12)] mb-8 animate-float">
                    <span className="text-3xl font-black text-[#8C5221] tracking-[0.25em] ml-2">{roomCode}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#4EA3E7] rounded-full animate-spin mb-4"></div>
                    <h2 className="text-lg font-bold text-gray-800 mb-1">{roomData?.guest ? 'Opponent Joined!' : 'Waiting for opponent...'}</h2>
                    <p className="text-gray-400 text-xs px-6">{roomData?.guest ? 'You can now start the match!' : 'Share the 4-digit code to your friend.'}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm px-6 mb-6">Create a private room and challenge your friends locally or globally!</p>
                </div>
              )}
            </>
          ) : (
            <>
              {roomCode ? (
                <div className="w-full text-center flex flex-col items-center justify-center mt-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 mb-1">Connected!</h2>
                  <p className="text-gray-500 text-sm">Waiting for the host to start the game...</p>
                </div>
              ) : (
                <div className="w-full px-2 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-3 uppercase">Enter Room Code</span>
                  <input 
                    type="text" 
                    maxLength="4"
                    value={inputCode.toUpperCase()}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="EX: A7B9"
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-2xl font-black text-center text-gray-800 tracking-[0.2em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4EA3E7] uppercase mb-4 shadow-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* PLAYERS BOTTOM SLOT SECTION */}
        <div className="mt-auto">
          <div className="flex flex-col gap-2.5 mb-5">
            {roomData ? (
              <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={AVATAR_LIST[roomData.host.avatarIndex]} alt="Host" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-black text-gray-800">{roomData.host.name} (Host)</span>
                    <span className="text-[11px] font-medium text-gray-400">Ready</span>
                  </div>
                </div>
              </div>
            ) : (activeTab === 'host' && (
              <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={AVATAR_LIST[avatarIndex]} alt="Host" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-black text-gray-800">{name} (Host)</span>
                    <span className="text-[11px] font-medium text-gray-400">Ready</span>
                  </div>
                </div>
              </div>
            ))}

            {(roomCode || activeTab === 'host') && (
              roomData?.guest ? (
                <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-gray-100 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={AVATAR_LIST[roomData.guest.avatarIndex]} alt="Guest" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-black text-gray-800">{roomData.guest.name}</span>
                      <span className="text-[11px] font-medium text-emerald-500 font-bold">Joined & Ready</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-3 flex items-center gap-3 bg-gray-50/50">
                  <div className="w-9 h-9 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-white animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <span className="text-xs font-bold text-gray-400 italic">Waiting for friend...</span>
                </div>
              )
            )}
          </div>

          {/* ACTION BUTTON */}
          <button 
            disabled={roomCode && activeTab === 'join'} 
            onClick={handleActionButton} 
            className={`w-full py-3.5 rounded-full font-black text-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform ${
              roomCode && activeTab === 'join' 
                ? 'bg-gray-200 text-gray-400 shadow-none'
                : 'bg-[#EE9432] hover:bg-[#d98126] text-white'
            }`}
          >
            {!roomCode && activeTab === 'host' ? 'Create Room' 
              : roomData?.guest && activeTab === 'host' ? 'Start Battle ⚔️' 
              : activeTab === 'host' ? 'Waiting...' 
              : !roomCode && activeTab === 'join' ? 'Connect Battle'
              : 'Host is preparing...'}
          </button>
        </div>

      </div>
    </div>
  );
}