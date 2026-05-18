import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { ref, get } from 'firebase/database'; 

import InputField from '../components/ui/InputField';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import logoImage from '../assets/images/logo.png';

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

export default function Onboarding({ onSave, onViewSettings }) { 
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  
  // STATE BARU UNTUK LOADING & ERROR
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedPlayer = localStorage.getItem('trivigo_player_data');
    if (savedPlayer) {
      const parsedData = JSON.parse(savedPlayer);
      if (parsedData.name) setName(parsedData.name);
      if (parsedData.avatarIndex !== undefined) setSelectedAvatar(parsedData.avatarIndex);
    }
  }, []);

  const handleSave = async () => {
    const finalName = name.trim().toUpperCase();

    if (finalName.length < 3) {
      setErrorMsg("Nama minimal 3 huruf!");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Ambil data nama yang sudah tersimpan di HP ini sebelumnya (jika ada)
      const savedPlayer = localStorage.getItem('trivigo_player_data');
      const parsedData = savedPlayer ? JSON.parse(savedPlayer) : null;
      const currentSavedName = parsedData?.name?.toUpperCase() || '';

      // 2. JIKA NAMA BARU BERBEDA DENGAN NAMA YANG SUDAH TERSET DI HP INI, BARU CEK FIREBASE
      if (finalName !== currentSavedName) {
        const lbRef = ref(db, `leaderboard/${finalName}`);
        const snapshot = await get(lbRef);

        if (snapshot.exists()) {
          setErrorMsg(`Nama "${finalName}" sudah dipakai! Gunakan nama unik.`);
          setIsLoading(false);
          return;
        }
      }

      // 3. Jika lolos (nama sama dengan milik sendiri atau nama baru tersedia)
      const playerData = { name: finalName, avatarIndex: selectedAvatar };
      localStorage.setItem('trivigo_player_data', JSON.stringify(playerData));
      
      onSave(playerData);

    } catch (err) {
      setErrorMsg("Gagal mengecek nama ke server. Periksa koneksi internet.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Container Mobile Frame */}
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-8 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 bg-white">
            <img src={AVATAR_LIST[selectedAvatar]} alt="Current" className="w-full h-full object-cover" />
          </div>
          
          <div className="h-8 flex items-center justify-center">
            <img src={logoImage} alt="TriviGo Logo" className="h-full w-auto object-contain" />
          </div>

          <button 
  onClick={onViewSettings} 
  className="text-gray-600 hover:text-gray-900 transition-colors active:scale-90"
>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>

        {/* Text Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome, Explorer!</h2>
          <p className="text-gray-500 text-sm">Choose your look and start the quest.</p>
        </div>

        {/* Input */}
        <div className="mb-8 relative z-10">
          <InputField 
            value={name} 
            onChange={(e) => {
              setName(e.target.value.toUpperCase());
              setErrorMsg(''); // Hapus pesan error saat user mulai mengetik lagi
            }} 
            placeholder="Enter your name..." 
          />
          {/* Tampilan Pesan Error */}
          {errorMsg && (
            <p className="text-red-500 text-xs font-bold text-center mt-3 bg-red-50 p-2 rounded-lg border border-red-100 animate-bounce-in">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Avatar Selection Grid */}
        <div className="flex-1">
          <h3 className="text-center text-[11px] font-bold tracking-[0.2em] text-[#9A6A45] mb-6">
            SELECT YOUR AVATAR
          </h3>
          <div className="grid grid-cols-3 gap-y-6 gap-x-2 justify-items-center">
            {AVATAR_LIST.map((src, index) => (
              <Avatar 
                key={index} 
                src={src} 
                isSelected={selectedAvatar === index} 
                onClick={() => setSelectedAvatar(index)} 
              />
            ))}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-auto pt-6 pb-2">
          {/* Tambahan style opacity untuk menandakan tombol disabled jika sedang loading */}
          <div className={isLoading ? 'opacity-70 pointer-events-none' : ''}>
            <Button onClick={handleSave}>
              {isLoading ? 'Checking Name...' : 'Save & Play'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}