import {
  getUser,
  lastUserResult,
  Scanner,
  type User,
  type UserEvaluation,
} from "@mktcodelib/github-insights";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Card from "~/components/users/Card";
import RequestInfo from "~/components/RequestInfo";
import Button from "~/components/base/Button";

const UserDetails = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [user, setUser] = useState<User | undefined>(undefined);

  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [userScanResult, setUserScanResult] = useState<UserEvaluation | null>(
    null
  );
  const [progress, setProgress] = useState<{
    requestCount: number;
    remainingRequests: number;
  } | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    used: number;
    remaining: number;
    resetAt: string;
  } | null>(null);

  useEffect(() => {
    if (userId) {
      getUser(Number(userId))
        .then((user) => {
          setUser(user);
        })
        .catch((err) => console.log(err));

      lastUserResult(Number(userId))
        .then((last) => {
          if (last) {
            setUserScanResult(last);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanUser(Number(userId));

    setScanning(true);
    scan(({ result, requestCount, remainingRequests, rateLimit }) => {
      setUserScanResult(result);
      setProgress({ requestCount, remainingRequests });
      setRateLimitInfo(rateLimit);
    })
      .catch((err) => console.log(err))
      .finally(() => setScanning(false));
  }

  if (!userId) return <>loading...</>;

  if (!user) return <>User does not exist.</>;

  return (
    <>
      <h1 className="mb-12 text-3xl font-bold">{user.login}</h1>
      {userScanResult && <Card data={userScanResult} />}
      {scanning && progress && rateLimitInfo && (
        <RequestInfo progress={progress} rateLimitInfo={rateLimitInfo} />
      )}
      <Button onClick={scan}>Scan</Button>
    </>
  );
};

export default UserDetails;
