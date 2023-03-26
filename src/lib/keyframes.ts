import { useState } from "react";

export function useKeyframes(msPerFrame: number, numberOfFrames: number) {
  const [animationKey, setAnimationKey] = useState(0);

  for (let i = 0; i < numberOfFrames; i++) {
    setTimeout(() => setAnimationKey(animationKey + 1), msPerFrame * i);
  }

  return { animationKey };
}