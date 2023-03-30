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
      className="px-3 py-2 transition-all hover:bg-gray-900"
      target="_blank"
    >
      {children}
    </Link>
  );
}
