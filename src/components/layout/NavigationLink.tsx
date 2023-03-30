import Link from "next/link";

export default function NavigationLink({
  children,
  href,
  target = "_self",
}: {
  children: React.ReactNode;
  href: string;
  target?: "_self" | "_blank";
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 transition-all hover:bg-gray-900"
      target={target}
    >
      {children}
    </Link>
  );
}
