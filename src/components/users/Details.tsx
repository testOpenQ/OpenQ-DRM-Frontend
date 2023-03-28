import { getUser } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  evaluateUserData,
  getLatestUserScan,
  Scanner,
  UserEvaluation,
} from "@mktcodelib/github-insights";
import Card from "./Card";
import RequestInfo from "../RequestInfo";
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

    (async () => {
      const latestUserScan = await getLatestUserScan(user.login);
      if (latestUserScan) {
        console.log("latestUserScan", latestUserScan);
        // TODO: setUserScanResult(latestUserScan.data)
      }
    })();
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

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanUser(user.login);

    setScanning(true);
    scan((data, requestCount, remainingRequests) => {
      setUserScanResult(evaluateUserData(data));
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
      {scanning && progress && <RequestInfo progress={progress} />}
      <Button onClick={scan}>Scan</Button>
    </>
  );
}
