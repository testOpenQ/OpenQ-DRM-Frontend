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
      className={`${className} group flex items-center p-2 text-gray-300 transition-all hover:bg-gray-900 hover:text-gray-100`}
    >
      {children}
    </Link>
  );
}
