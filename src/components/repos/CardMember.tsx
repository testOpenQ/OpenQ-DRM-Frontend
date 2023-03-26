export default function CardMember({ avatarUrl, className }: { avatarUrl: string, className: string }) {
  return (
    <div className={`${className} bg-gray-400 rounded-full bg-cover border-2 border-white flex items-end justify-center z-0`}
      style={{
        backgroundImage: `url(${avatarUrl})`,
        boxShadow: '0 0 0 1px #ccc, 0 0 5px 2px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
}
