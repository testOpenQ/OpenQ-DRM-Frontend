import { useEffect, useState } from 'react';

export default function CardScore({ label, score, activeClass }: {
  label: string;
  score: number;
  activeClass: string;
}) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (animationKey === 5) return;

    setTimeout(() => {
      setAnimationKey(animationKey + 1);
    }, 200);
  }, [animationKey]);

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2">{ label }</span>
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 0 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 1 && animationKey > 1 ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 2 && animationKey > 2 ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 3 && animationKey > 3 ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 4 && animationKey > 4 ? activeClass : 'bg-gray-100'}`}
      />
    </div>
  );
}
