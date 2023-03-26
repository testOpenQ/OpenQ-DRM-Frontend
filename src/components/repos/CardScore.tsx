import { useKeyframes } from '~/lib/keyframes';

export default function CardScore({ label, score, activeClass }: {
  label: string;
  score: number;
  activeClass: string;
}) {
  const animationKey = useKeyframes(1000, 5)
  console.log(animationKey)

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2">{ label }</span>
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 0 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 1 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 2 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 3 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
      <div
        className={`w-4 h-4 rounded transition-colors ${score > 4 && animationKey ? activeClass : 'bg-gray-100'}`}
      />
    </div>
  );
}
