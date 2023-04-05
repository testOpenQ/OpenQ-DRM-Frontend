import type { MouseEventHandler } from "react";
import Button from "./Button";

export default function DiscreetButton({
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
    <Button
      className={`${className} bg-transparent text-opacity-20 hover:!bg-gray-700 hover:text-opacity-100`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
