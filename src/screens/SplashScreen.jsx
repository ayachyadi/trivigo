import { useState, useEffect } from 'react';

// Import gambar logo dari direktori aset Anda
import appLogo from '../assets/images/logo.png';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Memberikan jeda sangat tipis sebelum bar mulai berjalan 
    // agar transisi CSS-nya terlihat mulus
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* Konten Tengah */}
        <div className="flex flex-col items-center animate-fade-in">
          
          {/* LOGO GAMBAR (Menggantikan teks TriviGo) */}
          <img 
            src={appLogo} 
            alt="TriviGo Logo" 
            className="h-20 w-auto mb-3 drop-shadow-sm" 
          />

          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-12">Knowledge is Power</p>
          
          {/* Container Bar Loading */}
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Isi Bar yang Berjalan */}
            <div 
              className="h-full bg-gradient-to-r from-[#EE9432] to-[#4EA3E7] rounded-full transition-all ease-in-out"
              style={{ 
                width: `${progress}%`,
                transitionDuration: '2500ms' // Durasi bar berjalan (2.5 detik)
              }}
            ></div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-3 animate-pulse">Loading data...</span>
        </div>

      </div>
    </div>
  );
}