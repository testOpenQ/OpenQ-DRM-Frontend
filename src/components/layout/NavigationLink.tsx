import Link from "next/link";

export default function NavigationLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 transition-all hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
