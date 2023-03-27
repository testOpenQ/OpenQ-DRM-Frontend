import type { MouseEventHandler } from "react";

export default function Button({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`${className} group flex w-full max-w-md rounded-lg bg-violet-900 p-4 text-white transition-all hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-900`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
