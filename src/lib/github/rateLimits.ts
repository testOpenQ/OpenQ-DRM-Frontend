import { isRateLimitsResponse, type RateLimits } from "../types";

export async function getRateLimits(accessToken: string): Promise<RateLimits> {
  const response = await fetch(`https://api.github.com/rate_limit`, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rate limit: ${response.statusText}`);
  }

  const rateLimit = (await response.json()) as unknown;

  if (!isRateLimitsResponse(rateLimit)) {
    throw new Error(
      `Invalid rate limit response: ${JSON.stringify(rateLimit)}`
    );
  }

  return rateLimit.resources;
}
