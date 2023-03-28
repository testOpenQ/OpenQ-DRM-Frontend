import { getUser } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  evaluateUserData,
  getLatestUserScan,
  Scanner,
  type UserEvaluation,
} from "@mktcodelib/github-insights";
import Card from "./Card";
import Button from "../base/Button";

export default function UserDetails({ userId }: { userId: string }) {
  const user = useLiveQuery(getUser(userId));

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

  useEffect(() => {
    if (!user) return;

    getLatestUserScan(user.login)
      .then((latestUserScan) => {
        if (latestUserScan && latestUserScan.data) {
          setUserScanResult(evaluateUserData(latestUserScan.data.user));
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (!user) {
      console.log("No user set");
      return;
    }

    setScanning(true);
    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanUser(user.login);

    scan((data, requestCount, remainingRequests) => {
      setUserScanResult(evaluateUserData(data.user));
      setProgress({ requestCount, remainingRequests });
    })
      .catch((err) => console.log(err))
      .finally(() => setScanning(false));
  }

  if (!user) return <>User does not exist.</>;

  return (
    <>
      <h1 className="mb-12 text-3xl font-bold">{user.login}</h1>
      <div className="flex w-full max-w-md flex-col items-center space-y-3">
        asd
      </div>
      {userScanResult && <Card data={userScanResult} />}
      <Button onClick={scan}>Scan</Button>
    </>
  );
}
