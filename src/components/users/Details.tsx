import { getUser } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  evaluateUserData,
  getLatestUserScan,
  Scanner,
  type UserData,
  type UserEvaluation,
} from "@mktcodelib/github-insights";
import Card from "./Card";
import Button from "../base/Button";
import LoadingSpinner from "../LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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
        if (latestUserScan) {
          if (latestUserScan.data.user) {
            setUserScanResult(evaluateUserData(latestUserScan.data.user));
          }
          if (!latestUserScan.done && accessToken) {
            const scanner = new Scanner({ viewerToken: accessToken });

            setScanning(true);
            scanner
              .scanContinue<{ user: UserData }>(latestUserScan.id)(
                (data, requestCount, remainingRequests) => {
                  setUserScanResult(evaluateUserData(data.user));
                  setProgress({ requestCount, remainingRequests });
                }
              )
              .finally(() => {
                setScanning(false);
                setProgress(null);
              });
          }
        }
      })
      .catch((err) => console.error(err));
  }, [user, accessToken]);

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
      .finally(() => {
        setScanning(false);
        setProgress(null);
      });
  }

  if (!user) return <>User does not exist.</>;

  return (
    <>
      <h1 className="mb-12 flex items-center text-3xl font-bold">
        {user.login}
        <div className="ml-3">
          <Button onClick={scan}>
            {scanning && (
              <>
                <LoadingSpinner />
                {progress && (
                  <span className="ml-2">
                    {progress.requestCount} /{" "}
                    {progress.requestCount + progress.remainingRequests}
                  </span>
                )}
              </>
            )}
            {!scanning && <ArrowPathIcon className="h-5 w-5 opacity-50" />}
          </Button>
        </div>
      </h1>
      {userScanResult && <Card data={userScanResult} />}
    </>
  );
}
