export default function InputField({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 text-center text-lg placeholder-gray-400 transition-all bg-white"
    />
  );
}