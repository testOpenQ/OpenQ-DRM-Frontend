export default function Input({ value, setValue, placeholder, className }: { value: string, setValue: (value: string) => void, placeholder?: string, className?: string }) {
  return (
    <input
      type="text"
      onChange={(e) => setValue(e.target.value)}
      value={value}
      className={`${className} w-full px-4 py-3 border rounded-md shadow-sm text-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-gray-900 placeholder-gray-400 transition-all`}
      placeholder={placeholder}
    />
  );
}
