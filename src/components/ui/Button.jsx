export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-full font-medium text-xl shadow-[0_8px_20px_-6px_rgba(0,119,182,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}