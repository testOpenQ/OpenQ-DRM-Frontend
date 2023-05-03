export default function Textarea({
  value,
  setValue,
  placeholder,
  className = "",
  disabled = false,
  rows = 1,
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      onChange={(e) => setValue(e.target.value)}
      value={value}
      className={`${className} w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-xl text-gray-300 shadow-sm transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-900`}
      placeholder={placeholder}
      aria-label={placeholder}
      disabled={disabled}
      rows={rows}
      spellCheck={false}
    />
  );
}
