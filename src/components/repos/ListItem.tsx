import { lastRepoResult, removeUser, RepoCommitsEvaluation, Repository, Scanner } from '@mktcodelib/github-insights';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Card from './Card';

export default function ListItem({ repo }: { repo: Repository }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoCommitsEvaluation | null>(null);
  const [progress, setProgress] = useState<{ requestCount: number; remainingRequests: number } | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ used: number; remaining: number; resetAt: string } | null>(null);

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  async function scan(id: number) {
    if (!accessToken) {
      console.log('No access token set');
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    
    setScanning(true);
    await scanner.scanRepoCommits(repo.id!, oneMonthAgo, now)(({ result, requestCount, remainingRequests, rateLimit }) => {
      setRepoScanResult(result);
      setProgress({ requestCount, remainingRequests });
      setRateLimitInfo(rateLimit);
    })
    setScanning(false);
  }

  useEffect(() => {
    (async () => {
      const last = await lastRepoResult(repo.id!);
  
      if (last) {
        setRepoScanResult(last);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center py-1 space-x-2 ">
        <div className="flex space-x-2">
          { repo.name }
        </div>
        <div className="ml-auto flex space-x-2">
          <button onClick={() => scan(repo.id!)} disabled={!accessToken}>
            Scan User
          </button>
          <button
            onClick={() => removeUser(repo.id!)}
          >
            Remove User
          </button>
        </div>
      </div>
      {repoScanResult && <Card data={repoScanResult} />}
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
