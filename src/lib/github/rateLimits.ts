import { RateLimits, RateLimitsResponse } from "../types";

export async function getRateLimits(accessToken: string): Promise<RateLimits> {
  const response = await fetch(`https://api.github.com/rate_limit`, {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rate limit: ${response.statusText}`);
  }

  const rateLimit: RateLimitsResponse = await response.json();

  return rateLimit.resources;
}
