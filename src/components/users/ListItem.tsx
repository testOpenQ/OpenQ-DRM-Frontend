import { lastUserResult, removeUser, Scanner, User, UserEvaluation } from '@mktcodelib/github-insights';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Card from './Card';

export default function ListItem({ user }: { user: User }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [userScanResult, setUserScanResult] = useState<UserEvaluation | null>(null);
  const [progress, setProgress] = useState<{ requestCount: number; remainingRequests: number } | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ used: number; remaining: number; resetAt: string } | null>(null);

  async function scan(id: number) {
    if (!accessToken) {
      console.log('No access token set');
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    
    setScanning(true);
    await scanner.scanUser(id)(({ result, requestCount, remainingRequests, rateLimit }) => {
      setUserScanResult(result);
      setProgress({ requestCount, remainingRequests });
      setRateLimitInfo(rateLimit);
    })
    setScanning(false);
  }

  useEffect(() => {
    (async () => {
      const last = await lastUserResult(user.id!);
  
      if (last) {
        setUserScanResult(last);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center py-1 space-x-2 ">
        <div className="flex space-x-2">
          { user.login }
        </div>
        <div className="ml-auto flex space-x-2">
          <button onClick={() => scan(user.id!)} disabled={!accessToken}>
            Scan User
          </button>
          <button
            onClick={() => removeUser(user.id!)}
          >
            Remove User
          </button>
        </div>
      </div>
      {userScanResult && <Card data={userScanResult} />}
      {scanning && progress && rateLimitInfo && <div>
        <div>Requests: { progress.requestCount }</div>
        <div>Remaining Requests: { progress.remainingRequests }</div>
        <div>Rate Limit Used: { rateLimitInfo.used }</div>
        <div>Rate Limit Remaining: { rateLimitInfo.remaining }</div>
        <div>Rate Limit Reset At: { rateLimitInfo.resetAt }</div>
      </div>}
    </div>
  );
}
