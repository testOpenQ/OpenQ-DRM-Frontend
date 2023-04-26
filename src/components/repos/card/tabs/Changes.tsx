import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import Button from "~/components/base/Button";
import {
  type Repo,
  addCommitSummary,
  getRepoCommitSummaries,
  CommitSummary,
} from "~/db";
import useLocalStorage from "~/hooks/useLocalstorage";
import type { RepoQueryResponseData } from "~/lib/githubData/repo/query";

export default function ChangesTab({
  repo,
  lastScanData,
  since,
  until,
}: {
  repo: Repo;
  lastScanData: RepoQueryResponseData | null;
  since: string;
  until: string;
}) {
  const summaries = useLiveQuery(() => getRepoCommitSummaries(repo.id));
  const [latestSummary, setLatestSummary] = useState<CommitSummary | null>(
    null
  );

  useEffect(() => {
    if (summaries && summaries.length > 0) {
      setLatestSummary(summaries[0]!);
    }
  }, [summaries]);

  const [showCommitSummaryInfo, setShowCommitSummaryInfo] = useLocalStorage(
    "ui.info.commit-summary",
    true
  );

  const [generatingSummary, setGeneratingSummary] = useState(false);

  function generateSummary() {
    if (!lastScanData) {
      throw new Error("No data available.");
    }

    const rawCommits =
      lastScanData.defaultBranchRef.target.history.nodes.filter(
        (commit) => commit.author.user?.login
      );

    setGeneratingSummary(true);
    fetch("/api/commit-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commits: rawCommits }),
    })
      .then((res) => res.json())
      .then(
        (data: {
          report: string;
          totalConsumedTokens: { input: number; output: number };
        }) => {
          if (!data.report || typeof data.report !== "string") {
            throw new Error("Invalid summary response");
          }

          console.log(
            "$" +
              (
                data.totalConsumedTokens.input * 0.03 +
                data.totalConsumedTokens.output * 0.06
              ).toFixed(2)
          );

          setGeneratingSummary(false);
          addCommitSummary({
            repoId: repo.id,
            summary: data.report,
            since,
            until,
          }).catch(console.error);
        }
      )
      .catch(console.error);
  }

  return (
    <div className="p-3">
      {!lastScanData && (
        <div className="text-center font-bold">No data available yet.</div>
      )}

      {!generatingSummary && summaries?.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Button
            className="mt-2"
            onClick={generateSummary}
            disabled={generatingSummary}
          >
            Generate summary
          </Button>
        </div>
      )}

      {generatingSummary && (
        <div className="my-3 flex items-center justify-center">
          <LoadingSpinner className="mr-2 opacity-50" />
          Generating summary...
        </div>
      )}

      {latestSummary && (
        <>
          <div
            className="leading-normal text-gray-300"
            dangerouslySetInnerHTML={{
              __html: latestSummary.summary
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
