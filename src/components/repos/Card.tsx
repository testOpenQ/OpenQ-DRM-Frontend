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
  const [commitSummary, setCommitSummary] = useState<string>("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
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
      .then((latestRepoScan) => {
        if (latestRepoScan) {
          if (latestRepoScan.data.repository) {
            setRepoScanResult(evaluateRepoData(latestRepoScan.data.repository));
          }
          if (!latestRepoScan.done && accessToken) {
            const scanner = new Scanner({ viewerToken: accessToken });

            setScanning(true);
            scanner
              .scanContinue<{ repo: RepoData }>(latestRepoScan.id)(
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
    let rawCommits: any[] = [];
    scan((data, paginators) => {
      setRepoScanResult(evaluateRepoData(data.repository));

      rawCommits = data.repository.defaultBranchRef.target.history.nodes;

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

        setGeneratingSummary(true);

        fetch("/api/commit-summary", {
          method: "POST",
          body: JSON.stringify({ commits: rawCommits }),
        })
          .then((res) => res.json())
          .then((data) => {
            setCommitSummary(data.summary);
            setGeneratingSummary(false);
          });
      });
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
    <div className="overflow-hidden rounded-lg bg-gray-800">
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col">
          {repoScanResult && <CardMembers />}
          {!repoScanResult && (
            <div className="flex grow items-center justify-center px-12">
              <Button className="w-full" onClick={scan}>
                Scan
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 px-5 py-3">
          <CardScores activity={3} growth={2} popularity={3} reputation={4} />
        </div>
      </div>
      {repoScanResult && (
        <div className="mb-1 bg-gray-900/50 pt-3">
          <div className="mb-3 flex items-center justify-center space-x-6 text-center text-xs">
            <div>
              {numberFormatter.format(repoScanResult.commitCount)} commits
              <div className="mr-2 mt-1 h-1 w-full rounded-full bg-white"></div>
            </div>
            <div>
              {numberFormatter.format(repoScanResult.linesChanged)} changes
              <div className="mr-2 mt-1 h-0.5 w-full rounded-full bg-gray-400"></div>
            </div>
          </div>
          <CardActivityChart
            commitsByDay={repoScanResult.commitsByDay}
            commitsByDayNormalized={repoScanResult.commitsByDayNormalized}
          />
        </div>
      )}
      <div className="text-xs">
        {generatingSummary && (
          <div className="p-3 text-center">Generating summary...</div>
        )}
        {commitSummary && (
          <div className="p-3">
            <div className="mb-2 text-xs font-bold">
              This summary was generated automatically. The information might
              not be accurate but indicates the workload and general direction
              of the project.
            </div>
            <div className="leading-normal text-gray-300">{commitSummary}</div>
          </div>
        )}
      </div>
    </div>
  );
}
