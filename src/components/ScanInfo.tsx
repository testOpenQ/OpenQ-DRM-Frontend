import { usePendingScans } from "~/store/PendingScansProvider";

export default function RequestInfo() {
  const pendingScans = usePendingScans();

  if (!pendingScans.length) return null;

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
      <div className="relative overflow-hidden bg-gray-700">
        <div
          className="h-1 bg-indigo-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </>
  );
}
