import { TrashIcon } from '@heroicons/react/24/outline';
import { lastUserResult, removeUser, Scanner, User, UserEvaluation } from '@mktcodelib/github-insights';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '../base/Button';
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
    <>
      <div className="flex space-x-3 w-full">
        <Link className="w-full" href={`/users/${user.id}`}>
          <Button>{user.login}</Button>
        </Link>
        <Button className="flex-1" onClick={() => removeUser(user.id!)}>
          <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
        </Button>
      </div>
    </>
  );
}
