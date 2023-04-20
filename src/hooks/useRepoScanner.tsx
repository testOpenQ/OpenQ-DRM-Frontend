import {
  RepoData,
  RepoEvaluation,
  Scanner,
  evaluateRepoData,
  getLatestRepoScan,
} from "@mktcodelib/github-insights";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { RepoModel, addCommitSummary } from "~/db";

export default function useRepoScanner(repo: RepoModel) {
  const { data } = useSession();
  const viewerToken = data?.accessToken;

  const [isScanning, setIsScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoEvaluation | null>(
    null
  );
  const [rawCommits, setRawCommits] = useState<
    RepoData["defaultBranchRef"]["target"]["history"]["nodes"]
  >([]);
  const [isSummarizingCommits, setIsSummarizingCommits] = useState(false);

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
    if (!viewerToken) {
      console.log("No access token set");
      return;
    }

    if (isScanning) {
      console.log("Already scanning");
      return;
    }

    const scanner = new Scanner({ viewerToken });
    const scan = scanner.scanRepo(repo.owner, repo.name, since, until);

    setIsScanning(true);
    scan((data) => {
      setRepoScanResult(evaluateRepoData(data.repository));
      setRawCommits(data.repository.defaultBranchRef.target.history.nodes);
    })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsScanning(false);
      });
  }

  function summarizeCommits() {
    if (isSummarizingCommits) {
      console.log("Already summarizing commits");
      return;
    }

    if (!rawCommits.length) {
      console.log("No commits to summarize");
      return;
    }

    setIsSummarizingCommits(true);

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
      .catch(console.error)
      .finally(() => {
        setIsSummarizingCommits(false);
      });
  }

  useEffect(() => {
    getLatestRepoScan(repo.owner, repo.name, since, until)
      .then((latestRepoScan) => {
        if (latestRepoScan) {
          if (latestRepoScan.data && latestRepoScan.data.repository) {
            const evaluation = evaluateRepoData(latestRepoScan.data.repository);
            setRepoScanResult(evaluation);
            setRawCommits(
              latestRepoScan.data.repository.defaultBranchRef.target.history
                .nodes
            );
          }
        }
      })
      .catch((err) => console.error(err));
  }, [repo, since, until]);

  return { isScanning, repoScanResult, scan, summarizeCommits };
}
