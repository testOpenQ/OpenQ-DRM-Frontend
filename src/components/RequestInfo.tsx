import { getPendingScans, type Scan } from "@mktcodelib/github-insights";
import { useLiveQuery } from "dexie-react-hooks";
import LoadingSpinner from "./LoadingSpinner";

export default function RequestInfo() {
  const pendingScans = useLiveQuery(() => getPendingScans() as Promise<Scan[]>);

  if (!pendingScans) {
    return <div>Loading...</div>;
  }

  if (pendingScans.length === 0) {
    return null;
  }

  const totalRequestCount = pendingScans.reduce(
    (acc, scan) =>
      acc + Math.max(...scan.paginators.map((p) => p.requestCount)),
    0
  );
  const totalRemainingRequests = pendingScans.reduce(
    (acc, scan) =>
      acc + Math.max(...scan.paginators.map((p) => p.remainingRequests)),
    0
  );
  const percentage = (
    (totalRequestCount / (totalRequestCount + totalRemainingRequests)) *
    100
  ).toFixed(1);

  return (
    <>
      <div className="flex items-center justify-between text-gray-600">
        <LoadingSpinner className="text-zinc-600" />
        <div>Pending scans: {pendingScans.length}</div>
        <div>
          Requests: {totalRequestCount}/
          {totalRequestCount + totalRemainingRequests}
        </div>
      </div>
      <div className="relative mt-3 overflow-hidden rounded-full bg-gray-600">
        <div
          className="h-4 bg-lime-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 text-center text-xs text-lime-100">
          {percentage}%
        </div>
      </div>
    </>
  );
}
