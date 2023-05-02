import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { getRateLimits } from "~/lib/github/rateLimits";
import type { RateLimits } from "~/lib/types";

export default function RateLimitInfo() {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [rateLimits, setRateLimits] = useState<RateLimits | null>(null);

  useMemo(() => {
    if (!accessToken) return;

    setInterval(() => {
      getRateLimits(accessToken)
        .then((rateLimits) => {
          setRateLimits(rateLimits);
        })
        .catch(console.error);
    }, 5000);
  }, [accessToken]);

  if (!rateLimits) return null;

  const percentageCore = (
    (rateLimits.core.used /
      (rateLimits.core.used + rateLimits.core.remaining)) *
    100
  ).toFixed(1);

  const percentageGraphql = (
    (rateLimits.graphql.used /
      (rateLimits.graphql.used + rateLimits.graphql.remaining)) *
    100
  ).toFixed(1);

  const percentageSearch = (
    (rateLimits.search.used /
      (rateLimits.search.used + rateLimits.search.remaining)) *
    100
  ).toFixed(1);

  return (
    <>
      <div className="relative overflow-hidden bg-gray-800">
        <div
          className="h-1 bg-violet-700 transition-all"
          style={{ width: `${percentageCore}%` }}
        />
      </div>
      <div className="relative overflow-hidden bg-gray-800">
        <div
          className="h-1 bg-violet-800 transition-all"
          style={{ width: `${percentageGraphql}%` }}
        />
      </div>
      <div className="relative overflow-hidden bg-gray-800">
        <div
          className="h-1 bg-violet-900 transition-all"
          style={{ width: `${percentageSearch}%` }}
        />
      </div>
    </>
  );
}
