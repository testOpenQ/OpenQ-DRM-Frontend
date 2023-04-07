export default function SidebarDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`${className} h-[1px] bg-gradient-to-r from-transparent via-gray-900 to-transparent`}
    />
  );
}
