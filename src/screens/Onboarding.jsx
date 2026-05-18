import { useState, useEffect } from 'react';
import InputField from '../components/ui/InputField';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import logoImage from '../assets/images/logo.png';

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

export default function Onboarding({ onSave }) { 
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  // LOGIKA BARU: Baca memori saat halaman pertama kali dibuka
  useEffect(() => {
    const savedPlayer = localStorage.getItem('trivigo_player_data');
    if (savedPlayer) {
      const parsedData = JSON.parse(savedPlayer);
      if (parsedData.name) setName(parsedData.name);
      if (parsedData.avatarIndex !== undefined) setSelectedAvatar(parsedData.avatarIndex);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Masukkan namamu dulu ya!");
      return;
    }

    const finalName = name.trim().toUpperCase();
    const playerData = { name: finalName, avatarIndex: selectedAvatar };

    // LOGIKA BARU: Simpan ke memori lokal browser
    localStorage.setItem('trivigo_player_data', JSON.stringify(playerData));

    // Panggil props fungsi onSave untuk mengirim data ke App.jsx
    onSave(playerData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Container Mobile Frame (Tinggi disesuaikan agar seragam) */}
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-8 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 bg-white">
            <img src={AVATAR_LIST[selectedAvatar]} alt="Current" className="w-full h-full object-cover" />
          </div>
          
          {/* Logo Custom yang Menggantikan Teks */}
          <div className="h-8 flex items-center justify-center">
            <img src={logoImage} alt="TriviGo Logo" className="h-full w-auto object-contain" />
          </div>

          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            {/* Icon Settings SVG */}
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>

        {/* Text Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome, Explorer!</h2>
          <p className="text-gray-500 text-sm">Choose your look and start the quest.</p>
        </div>

        {/* Input */}
        <div className="mb-10 relative z-10">
          <InputField 
            value={name} 
            onChange={(e) => setName(e.target.value.toUpperCase())} 
            placeholder="Enter your name..." 
          />
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
          <Button onClick={handleSave}>
            Save & Play 
          </Button>
        </div>

      </div>
    </div>
  );
}