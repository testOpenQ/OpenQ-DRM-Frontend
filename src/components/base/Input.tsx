export default function Input({
  value,
  setValue,
  placeholder,
  className = "",
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      onChange={(e) => setValue(e.target.value)}
      value={value}
      className={`${className} w-full rounded-md border px-4 py-3 text-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400`}
      placeholder={placeholder}
    />
  );
}
