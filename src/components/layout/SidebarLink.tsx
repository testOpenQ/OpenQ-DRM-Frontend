import Link from "next/link";

export default function SidebarLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg p-2 transition-all hover:bg-black/20"
    >
      {children}
    </Link>
  );
}
