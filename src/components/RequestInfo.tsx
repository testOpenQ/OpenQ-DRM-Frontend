export default function RequestInfo({ progress, rateLimitInfo }: {
  progress: {
    requestCount: number;
    remainingRequests: number
  };
  rateLimitInfo: {
    used: number;
    remaining: number;
    resetAt: string
  }
}) {
  return (
    <div>
      <div>Requests: { progress.requestCount }</div>
      <div>Remaining Requests: { progress.remainingRequests }</div>
      <div>Rate Limit Used: { rateLimitInfo.used }</div>
      <div>Rate Limit Remaining: { rateLimitInfo.remaining }</div>
      <div>Rate Limit Reset At: { rateLimitInfo.resetAt }</div>
    </div>
  )
}