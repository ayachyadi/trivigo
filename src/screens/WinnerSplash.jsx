import { useState } from 'react';
import avatar1 from '../assets/avatar/Bluter.svg';
import avatar2 from '../assets/avatar/Gribir.svg';
import avatar3 from '../assets/avatar/Lady.svg';
import avatar4 from '../assets/avatar/Moko.svg';
import avatar5 from '../assets/avatar/Pinko.svg';
import avatar6 from '../assets/avatar/Renji.svg';

const AVATAR_LIST = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

// Perhatikan ada kata kunci "export default" di sini
export default function WinnerSplash({ playerData, rank, score, onContinue }) {
  const [isCopied, setIsCopied] = useState(false);
  const myAvatarSrc = AVATAR_LIST[playerData?.avatarIndex ?? 1];
  const myName = playerData?.name?.toUpperCase() || 'PLAYER';

  // Konfigurasi visual berdasarkan Ranking
  const config = {
    1: { theme: 'from-yellow-400 to-yellow-600', text: 'CHAMPION!', icon: '🏆', border: 'border-yellow-400', shadow: 'shadow-[0_0_40px_rgba(250,204,21,0.6)]' },
    2: { theme: 'from-gray-300 to-gray-400', text: 'RUNNER UP!', icon: '🥈', border: 'border-gray-300', shadow: 'shadow-[0_0_40px_rgba(209,213,219,0.6)]' },
    3: { theme: 'from-[#CD7F32] to-[#8c5622]', text: '3RD PLACE!', icon: '🥉', border: 'border-[#CD7F32]', shadow: 'shadow-[0_0_40px_rgba(205,127,50,0.6)]' },
  };

  const currentStyle = config[rank] || config[1];

  // Fitur Share API
  const handleShare = async () => {
    const shareText = `Wohoo! Saya berhasil meraih Juara ${rank} dengan skor ${score} poin di TriviGo! 🏆 Bisakah kamu mengalahkan saya?`;
    
    // Cek apakah browser HP mendukung fitur Share bawaan
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Juara TriviGo!',
          text: shareText,
          url: window.location.origin // URL web TriviGo Anda
        });
      } catch (err) {
        console.log('Share dibatalkan', err);
      }
    } else {
      // Fallback untuk laptop/PC (Salin Teks)
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className={`bg-gradient-to-b ${currentStyle.theme} w-full max-w-[400px] rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden h-[720px] max-h-[95vh]`}>
        
        {/* Inner Card (White) */}
        <div className="bg-[#FAFAFA] w-full h-full rounded-[2.3rem] flex flex-col items-center justify-center p-6 relative overflow-hidden">
          
          {/* Confetti Animation Background (CSS-based) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
             <div className="w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-100 via-transparent to-transparent animate-pulse"></div>
          </div>

          <div className="z-10 flex flex-col items-center w-full animate-bounce-in text-center">
            <span className="text-6xl mb-2 drop-shadow-xl">{currentStyle.icon}</span>
            <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentStyle.theme} tracking-tighter uppercase mb-6`}>
              {currentStyle.text}
            </h2>

            {/* Avatar Frame */}
            <div className={`w-32 h-32 rounded-full overflow-hidden border-8 ${currentStyle.border} bg-white mb-4 ${currentStyle.shadow} animate-float`}>
              <img src={myAvatarSrc} alt="You" className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-black text-gray-800 mb-1">{myName}</h3>
            <p className="text-gray-500 font-bold text-sm mb-6">You dominated the party!</p>

            <div className="bg-gray-100 rounded-3xl p-5 w-full border border-gray-200 mb-8 shadow-inner">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Score</span>
              <span className="block text-5xl font-black text-gray-800 tracking-tighter">{score}</span>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleShare}
                className={`w-full bg-gradient-to-r ${currentStyle.theme} hover:brightness-110 text-white py-4 rounded-full font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
              >
                {isCopied ? 'Tersalin ke Clipboard!' : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Pamerkan Skor!
                  </>
                )}
              </button>
              
              <button 
                onClick={onContinue}
                className="w-full bg-white hover:bg-gray-50 text-gray-500 py-3.5 border-2 border-gray-200 rounded-full font-bold text-base active:scale-95 transition-all"
              >
                Lanjut ke Podium 👉
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}