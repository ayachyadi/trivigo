import React from 'react';

export default function Settings({ onBack, onResetPlayer }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      
      {/* Container Mobile Frame */}
      <div className="bg-[#FAFAFA] w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-8 flex flex-col h-[720px] max-h-[95vh] relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-black text-[#8C5221] tracking-tight">Settings</h1>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Account Options</h3>
            
            <div className="flex flex-col gap-1.5">
              <h4 className="text-base font-black text-gray-800">Reset Player Data</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Menghapus nama dan pengaturan avatar yang tersimpan di perangkat ini secara permanen. Kamu harus membuat identitas baru setelah ini.
              </p>
              
              <button
                onClick={onResetPlayer}
                className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-3.5 rounded-2xl font-black text-sm border border-red-200/60 transition-colors active:scale-95"
              >
                🗑️ Reset Perangkat Ini
              </button>
            </div>
          </div>
        </div>

        {/* Footer Version */}
        <div className="mt-auto text-center py-2">
          <span className="text-[10px] font-bold text-gray-300 tracking-wider uppercase">TriviGo v1.1.0</span>
        </div>

      </div>
    </div>
  );
}