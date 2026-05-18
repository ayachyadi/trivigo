export default function Avatar({ src, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-1 transition-all duration-200 ${
        isSelected 
          ? 'border-4 border-[#9A6A45] scale-105 shadow-lg' // Warna border coklat/gold seperti di desain
          : 'border-4 border-transparent hover:scale-105 opacity-80 hover:opacity-100'
      }`}
    >
      <img 
        src={src} 
        alt="Avatar" 
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover bg-slate-800" 
      />
    </div>
  );
}