export const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export function normalize(numbers: number[]): number[] {
  const max = Math.max(...numbers);
  return numbers.map((num) => num / max);
}
