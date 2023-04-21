import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import Button from "~/components/base/Button";
import {
  Repo,
  addCommitSummary,
  getLatestRepoScan,
  getRepoCommitSummaries,
} from "~/db";
import useLocalStorage from "~/hooks/useLocalstorage";
import { RepoData } from "~/lib/githubScanner/evaluators/repo";

export default function ChangesTab({
  repo,
  since,
  until,
}: {
  repo: Repo;
  since: string;
  until: string;
}) {
  const [showCommitSummaryInfo, setShowCommitSummaryInfo] = useLocalStorage(
    "ui.info.commit-summary",
    true
  );

  const [latestRepoScanData, setLatestRepoScanData] = useState<RepoData | null>(
    null
  );
  const [commitSummary, setCommitSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    getLatestRepoScan(repo.ownerLogin, repo.name, since, until).then((scan) => {
      if (scan?.data?.repository) {
        setLatestRepoScanData(scan.data.repository);
      }
    });

    getRepoCommitSummaries(repo.id)
      .then((summaries) => {
        const last = summaries.pop();
        if (last) {
          setCommitSummary(last.summary);
        }
      })
      .catch(console.error);
  }, [repo.id]);

  function generateSummary() {
    if (!latestRepoScanData) {
      throw new Error("No latest repo scan data");
    }

    const rawCommits = latestRepoScanData.defaultBranchRef.target.history.nodes;

    setGeneratingSummary(true);
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
        setCommitSummary(data.summary);
        setGeneratingSummary(false);
        addCommitSummary({ repoId: repo.id, summary: data.summary }).catch(
          console.error
        );
      })
      .catch(console.error);
  }

  return (
    <div className="p-3">
      {latestRepoScanData && (
        <Button onClick={generateSummary}>
          {generatingSummary && <LoadingSpinner className="mr-2" />}
          {commitSummary ? "Regenerate" : "Generate"} summary
        </Button>
      )}
      {!latestRepoScanData && (
        <div className="font-bold">
          No data available to summarize for the selected time period. Showing
          old report. Scan the repository again to generate a new one.
        </div>
      )}
      {commitSummary && (
        <>
          <div
            className="leading-normal text-gray-300"
            dangerouslySetInnerHTML={{
              __html: commitSummary
                .replace(
                  /(critical|severe|serious|bugs?|hot[ -]?fix|urgent)/gi,
                  '<strong class="text-red-300">$1</strong>'
                )
                .replace(
                  /(feature(s)?|fix(e[sd])?|design|test(s)?|terms of use|terms of service|licen[sc]e)/gi,
                  '<strong class="text-indigo-300">$1</strong>'
                ),
            }}
          />
          {showCommitSummaryInfo && (
            <div className="mt-2 text-xs font-bold">
              This summary was generated automatically. It might not be
              absolutely perfect but indicates the workload and general
              direction of the project.{" "}
              <a
                href="#"
                className="font-normal text-indigo-400"
                onClick={() => setShowCommitSummaryInfo(false)}
              >
                Got it! Don&apos;t show this message any more.
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
