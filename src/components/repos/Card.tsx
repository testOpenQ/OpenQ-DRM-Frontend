import {
  type RepoData,
  type RepoEvaluation,
  Scanner,
  evaluateRepoData,
  getLatestRepoScan,
} from "@mktcodelib/github-insights";
import CardActivityChart from "./CardActivityChart";
import CardMembers from "./CardMembers";
import CardScores from "./CardScores";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  type Repo,
  addCommitSummary,
  deleteRepo,
  getRepoCommitSummaries,
} from "~/db";
import Button from "../base/Button";
import LoadingSpinner from "../LoadingSpinner";
import useLocalStorage from "~/hooks/useLocalstorage";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DiscreetButton from "../base/DiscreetButton";

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export default function Card({ repo }: { repo: Repo }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [showCommitSummaryInfo, setShowCommitSummaryInfo] = useLocalStorage(
    "ui.info.commit-summary",
    true
  );

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoEvaluation | null>(
    null
  );
  const [commitSummary, setCommitSummary] = useState<string>("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showCommitSummary, setShowCommitSummary] = useState(false);

  const [members, setMembers] = useState<{ avatarUrl: string }[]>([]);

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
    (async () => {
      if (repoScanResult) {
        const members = Object.keys(repoScanResult.commitsByAuthor);

        Promise.all(
          members.map((member) =>
            fetch(`https://api.github.com/users/${member}`, {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }).then((res) => res.json())
          )
        ).then((members) => {
          setMembers(
            members.map((member) => ({ avatarUrl: member.avatar_url }))
          );
        });
      }
    })();
  }, [repoScanResult]);

  useEffect(() => {
    getRepoCommitSummaries(repo.id).then((summaries) => {
      if (summaries[0]) {
        setCommitSummary(summaries[0].summary);
      }
    });
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
              .scanContinue<{ repo: RepoData }>(latestRepoScan.id)((data) => {
                setRepoScanResult(evaluateRepoData(data.repo));
              })
              .finally(() => {
                setScanning(false);
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
    scan((data) => {
      setRepoScanResult(evaluateRepoData(data.repository));

      rawCommits = data.repository.defaultBranchRef.target.history.nodes;
    })
      .catch((err) => console.log(err))
      .finally(() => {
        setScanning(false);

        setGeneratingSummary(true);

        fetch("/api/commit-summary", {
          method: "POST",
          body: JSON.stringify({ commits: rawCommits }),
        })
          .then((res) => res.json())
          .then((data) => {
            setCommitSummary(data.summary);
            setGeneratingSummary(false);
            addCommitSummary({ repoId: repo.id, summary: data.summary });
          });
      });
  }

  function handleHideMessage() {
    setShowCommitSummaryInfo(false);
  }

  function handleDeleteRepo() {
    deleteRepo(repo.id);
  }

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <div className="flex items-center justify-between bg-gray-900/50 px-3 py-2 font-bold">
        <div>
          {repo.owner}/{repo.name}
        </div>
        <div className="flex">
          {accessToken && repoScanResult && (
            <DiscreetButton disabled={scanning} onClick={scan}>
              {scanning && <LoadingSpinner className="!h-4 !w-4" />}
              {!scanning && <ArrowPathIcon className="h-4 w-4" />}
            </DiscreetButton>
          )}
          <DiscreetButton>
            <XMarkIcon className="h-4 w-4" onClick={handleDeleteRepo} />
          </DiscreetButton>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {repoScanResult && <CardMembers members={members} />}
          {!repoScanResult && (
            <div className="flex grow items-center justify-center px-12">
              {accessToken && (
                <Button className="w-full" onClick={scan}>
                  {scanning && <LoadingSpinner className="mr-2" />}
                  scan repository
                </Button>
              )}
              {!accessToken && (
                <Button className="w-full" onClick={handleSignIn}>
                  Connect to GitHub
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 px-5 py-3">
          <CardScores activity={3} growth={2} popularity={3} reputation={4} />
        </div>
      </div>
      {repoScanResult && (
        <div className="mb-1 bg-gray-900/50 pt-3">
          <div className="mb-3 flex items-center justify-center space-x-6 text-center text-xs text-gray-400">
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
          <div className="flex items-center justify-center px-3 py-2 text-gray-300">
            <LoadingSpinner className="mr-2 !h-3 !w-3" />
            Generating summary...
          </div>
        )}
        {!generatingSummary && commitSummary && (
          <>
            <div
              className={`${
                showCommitSummary ? "max-h-32" : "max-h-0"
              } overflow-auto transition-all`}
            >
              <div className="p-3">
                <div className="leading-normal text-gray-300">
                  {commitSummary}
                </div>
                {showCommitSummaryInfo && (
                  <div className="mt-2 text-xs font-bold">
                    This summary was generated automatically. It might not be
                    absolutely perfect but indicates the workload and general
                    direction of the project.{" "}
                    <a
                      href="#"
                      className="font-normal text-indigo-400"
                      onClick={handleHideMessage}
                    >
                      Got it! Don't show this message any more.
                    </a>
                  </div>
                )}
              </div>
            </div>
            <DiscreetButton
              className="w-full rounded-t-none"
              onClick={() => setShowCommitSummary(!showCommitSummary)}
            >
              {showCommitSummary ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </DiscreetButton>
          </>
        )}
      </div>
    </div>
  );
}
