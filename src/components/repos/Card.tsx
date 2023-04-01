import {
  RepoData,
  RepoEvaluation,
  Scanner,
  evaluateRepoData,
  getLatestRepoScan,
} from "@mktcodelib/github-insights";
import CardActivityChart from "./CardActivityChart";
import CardMembers from "./CardMembers";
import CardScores from "./CardScores";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Repo } from "~/db";
import Button from "../base/Button";

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export default function Card({ repo }: { repo: Repo }) {
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

  if (!repoScanResult)
    return (
      <div>
        <div>No data fetched yet.</div>
        <Button onClick={scan}>Scan</Button>
      </div>
    );

  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800 sm:flex-row">
      <div className="flex flex-col border-b border-gray-700 sm:border-b-0 sm:border-r">
        <CardMembers />
        <div className="flex justify-center space-x-1 p-3 text-center text-xs">
          <span>
            {Object.keys(repoScanResult.commitsByAuthor).length} contributors
          </span>
          <span>•</span>
          <span>
            {numberFormatter.format(repoScanResult.commitCount)} commits
          </span>
          <span>•</span>
          <span>
            {numberFormatter.format(repoScanResult.linesChanged)} changes
          </span>
        </div>
        <CardActivityChart />
      </div>
      <div className="px-5 py-3">
        <div className="text-right font-bold">Submission to hackathon</div>
        <div className="mb-3 text-right text-xs">OpenQDev/OpenQ-Frontend</div>
        <CardScores />
      </div>
    </div>
  );
}
