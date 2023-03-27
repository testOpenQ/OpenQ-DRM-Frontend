export default function Button({ children, onClick, disabled, className = '' }: { children: React.ReactNode, onClick?: () => void, disabled?: boolean, className?: string }) {
  return (
    <button
      className={`${className} flex w-full max-w-md rounded-lg bg-violet-900 p-4 text-white hover:bg-violet-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-900`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
