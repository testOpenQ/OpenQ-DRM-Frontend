import {
  Scanner,
  UserData,
  UserEvaluation,
  evaluateUserData,
  getLatestUserScan,
} from "@mktcodelib/github-insights";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "~/db";
import Button from "../base/Button";

export default function Card({ user }: { user: User }) {
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
                (data, paginators) => {
                  setUserScanResult(evaluateUserData(data.user));

                  const requestCount = Math.max(
                    ...paginators.map((p) => p.requestCount)
                  );
                  const remainingRequests = Math.max(
                    ...paginators.map((p) => p.remainingRequests)
                  );
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

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanUser(user.login);

    setScanning(true);
    scan((data, paginators) => {
      setUserScanResult(evaluateUserData(data.user));

      const requestCount = Math.max(...paginators.map((p) => p.requestCount));
      const remainingRequests = Math.max(
        ...paginators.map((p) => p.remainingRequests)
      );
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
    <div className="flex flex-col rounded-lg bg-gray-800 p-3">
      <div className="mb-3 whitespace-nowrap font-bold">{user.login}</div>
      {userScanResult && (
        <>
          <p>
            Your repositories have received
            <span className="font-bold">
              {userScanResult.stargazerCount}
            </span>{" "}
            stars and have been forked
            <span className="font-bold">{userScanResult.forkCount}</span> times.
          </p>

          <p>
            Your followers&apos; repositories have received
            <span className="font-bold">
              {userScanResult.followersStargazerCount}
            </span>
            stars and have been forked
            <span className="font-bold">
              {userScanResult.followersForkCount}
            </span>{" "}
            times.
            <span className="font-bold">
              {userScanResult.followersFollowerCount}
            </span>
            people follow your followers.
          </p>

          <p>
            You contributed
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount}
            </span>
            merged pull requests,
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount365d}
            </span>
            in the last year and
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount30d}
            </span>
            in the last 30 days.
          </p>
        </>
      )}
      {!userScanResult && (
        <div className="flex grow items-center justify-center">
          <Button className="w-full">Scan</Button>
        </div>
      )}
    </div>
  );
}
