import { TrashIcon } from '@heroicons/react/24/outline';
import { lastRepoResult, removeRepository, RepoCommitsEvaluation, Repository, Scanner } from '@mktcodelib/github-insights';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '../base/Button';
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
    <>
      <div className="flex space-x-3 w-full">
        <Link className="w-full" href={`/repos/${repo.id}`}>
          <Button>{repo.owner}/{repo.name}</Button>
        </Link>
        <Button className="flex-1" onClick={() => removeRepository(repo.id!)}>
          <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
        </Button>
      </div>
      {/* {repoScanResult && <Card data={repoScanResult} />}
      {scanning && progress && rateLimitInfo && <div>
        <div>Requests: { progress.requestCount }</div>
        <div>Remaining Requests: { progress.remainingRequests }</div>
        <div>Rate Limit Used: { rateLimitInfo.used }</div>
        <div>Rate Limit Remaining: { rateLimitInfo.remaining }</div>
        <div>Rate Limit Reset At: { rateLimitInfo.resetAt }</div>
      </div>} */}
    </>
  );
}
