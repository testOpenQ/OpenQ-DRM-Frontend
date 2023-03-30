import { getRepo } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  evaluateRepoData,
  getLatestRepoScan,
  RepoData,
  Scanner,
  type RepoEvaluation,
} from "@mktcodelib/github-insights";
import Card from "./Card";
import Button from "../base/Button";
import LoadingSpinner from "../LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function RepoDetails({ repoId }: { repoId: string }) {
  const repo = useLiveQuery(getRepo(repoId));

  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoEvaluation | null>(
    null
  );
  const [progress, setProgress] = useState<{
    requestCount: number;
    remainingRequests: number;
  } | null>(null);

  const since = useMemo(() => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setMonth(since.getMonth() - 1);
    return since.toISOString();
  }, []);

  const until = useMemo(() => {
    const until = new Date();
    until.setHours(0, 0, 0, 0);
    until.setMonth(until.getMonth() + 1);
    return until.toISOString();
  }, []);

  useEffect(() => {
    if (!repo) return;

    getLatestRepoScan(repo.owner, repo.name, since, until)
      .then((latestUserScan) => {
        if (latestUserScan) {
          if (latestUserScan.data.repository) {
            setRepoScanResult(evaluateRepoData(latestUserScan.data.repository));
          }
          if (!latestUserScan.done && accessToken) {
            const scanner = new Scanner({ viewerToken: accessToken });

            setScanning(true);
            scanner
              .scanContinue<{ repo: RepoData }>(latestUserScan.id)(
                (data, paginators) => {
                  setRepoScanResult(evaluateRepoData(data.repo));

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
  }, [repo, since, until, accessToken]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (!repo) {
      console.log("No repo set");
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanRepo(repo.owner, repo.name, since, until);

    setScanning(true);
    scan((data, paginators) => {
      setRepoScanResult(evaluateRepoData(data.repository));

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

  if (!repo) return <>Repository does not exist.</>;

  return (
    <>
      <h1 className="mb-12 flex items-center text-3xl font-bold">
        {repo.owner}/{repo.name}
        <div className="ml-3">
          <Button onClick={scan}>
            {scanning && (
              <>
                <LoadingSpinner />
                {progress && (
                  <span className="ml-2">
                    {(
                      (progress.requestCount /
                        (progress.requestCount + progress.remainingRequests)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                )}
              </>
            )}
            {!scanning && <ArrowPathIcon className="h-5 w-5 opacity-50" />}
          </Button>
        </div>
      </h1>
      {repoScanResult && <Card data={repoScanResult} />}
    </>
  );
}
