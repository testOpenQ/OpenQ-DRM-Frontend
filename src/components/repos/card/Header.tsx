import {
  type RepoData,
  type RepoEvaluation,
  Scanner,
  evaluateRepoData,
} from "@mktcodelib/github-insights";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { type Repo, addCommitSummary, deleteRepo } from "~/db";
import LoadingSpinner from "../../LoadingSpinner";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../../base/DiscreetButton";

export default function CardHeader({ repo }: { repo: Repo }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoEvaluation | null>(
    null
  );

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

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanRepo(repo.owner, repo.name, since, until);

    setScanning(true);
    let rawCommits: RepoData["defaultBranchRef"]["target"]["history"]["nodes"] =
      [];
    scan((data) => {
      setRepoScanResult(evaluateRepoData(data.repository));

      rawCommits = data.repository.defaultBranchRef.target.history.nodes;
    })
      .catch((err) => console.log(err))
      .finally(() => {
        setScanning(false);

        fetch("/api/commit-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commits: rawCommits }),
        })
          .then((res) => res.json())
          .then((data: { summary: string }) => {
            if (!data.summary || typeof data.summary !== "string") {
              throw new Error("Invalid summary response");
            }
            addCommitSummary({ repoId: repo.id, summary: data.summary }).catch(
              console.error
            );
          })
          .catch(console.error);
      });
  }

  function handleDeleteRepo() {
    deleteRepo(repo.id).catch(console.error);
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
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
  );
}
