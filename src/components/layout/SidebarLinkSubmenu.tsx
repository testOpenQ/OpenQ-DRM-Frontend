import Link from "next/link";

export default function SidebarLink({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${className} flex items-center p-2 transition-all hover:bg-gray-900/50`}
    >
      {children}
    </Link>
  );
}
