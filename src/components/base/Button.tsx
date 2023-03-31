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
      className={`${className} group flex w-full max-w-md items-center rounded-lg bg-sky-900 px-3 py-2 text-base text-white transition-all hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-900`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
