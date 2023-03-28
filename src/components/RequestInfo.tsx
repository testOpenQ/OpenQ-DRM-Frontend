export default function RequestInfo({
  progress,
}: {
  progress: {
    requestCount: number;
    remainingRequests: number;
  };
}) {
  return (
    <div>
      <div>Requests: {progress.requestCount}</div>
      <div>Remaining Requests: {progress.remainingRequests}</div>
    </div>
  );
}
