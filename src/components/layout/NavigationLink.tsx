import Link from "next/link";

export default function NavigationLink({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="transition-all hover:bg-white/10 px-3 py-2 rounded-lg">{children}</Link>
  );
}
