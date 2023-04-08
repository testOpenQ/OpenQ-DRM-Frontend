/**
 * Score calculation will likely move into the github-insights package but for
 * now we generate some random static values, based on the repo owner/name.
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

export function generateFakeScores(repo: { owner: string; name: string }) {
  const random = xorshift(
    stringToSeed(repo.owner + repo.name + "supersecretse")
  );
  const numbers = [];

  for (let i = 0; i < 4; i++) {
    numbers.push(Math.min(Math.floor(random() * 6) + 2, 5));
  }

  return numbers;
}
