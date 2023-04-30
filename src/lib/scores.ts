/**
 * Score calculation will follow soon. For now we generate some random static
 * values, based on the repo owner/name.
 */

function stringToSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const charCode = seed.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function xorshift(seed: number) {
  let state = seed;

  return function () {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return Math.abs(state) / Math.pow(2, 32);
  };
}

export function generateFakeScores(repoFullName: string) {
  const random = xorshift(stringToSeed(repoFullName + "supersecretse"));
  const numbers = [];

  for (let i = 0; i < 4; i++) {
    numbers.push(Math.min(Math.floor(random() * 11) + 4, 10));
  }

  return {
    activity: numbers[0] || 0,
    growth: numbers[1] || 0,
    popularity: numbers[2] || 0,
    reputation: numbers[3] || 0,
  };
}
