export default function CardMember({
  avatarUrl,
  className,
}: {
  avatarUrl: string;
  className: string;
}) {
  return (
    <div
      className={`${className} z-0 flex items-end justify-center rounded-full border-2 border-white bg-gray-400 bg-cover`}
      style={{
        backgroundImage: `url(${avatarUrl})`,
        boxShadow: "0 0 0 1px #ccc, 0 0 5px 2px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}
