export default function Input({
  value,
  setValue,
  placeholder,
  className = "",
  disabled = false,
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      onChange={(e) => setValue(e.target.value)}
      value={value}
      aria-label={placeholder}
      className={`${className} w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-xl text-gray-300 shadow-sm transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-900`}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
