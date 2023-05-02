import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import Button from "~/components/base/Button";
import {
  addCommitSummary,
  getRepoCommitSummaries,
  type RepoEvaluation,
  type Repo,
  type CommitSummary,
} from "~/db";
import useLocalStorage from "~/hooks/useLocalstorage";
import CardActivityChart from "../ActivityChart";
import { useLatestEvaluation } from "~/store/EvaluationProvider";
import type { RepoQueryResponseDataCommitAuthor } from "~/lib/evaluation/Repo/queries";
import type { RepoEvaluationResult } from "~/lib/evaluation/Repo/RepoEvaluator";
import WaitingForFirstEvaluation from "../WaitingForFirstEvaluation";

export default function ChangesTab({ repo }: { repo: Repo }) {
  const latestEvaluation = useLatestEvaluation<RepoEvaluation>();

  const [showCommitSummaryInfo, setShowCommitSummaryInfo] = useLocalStorage(
    "ui.info.commit-summary",
    true
  );

  const summaries = useLiveQuery(() => getRepoCommitSummaries(repo.id));
  const [latestSummary, setLatestSummary] = useState<CommitSummary | null>(
    null
  );

  useEffect(() => {
    if (summaries && summaries[0]) {
      setLatestSummary(summaries[0]);
    }
  }, [summaries]);

  const [generatingSummary, setGeneratingSummary] = useState(false);

  function generateSummary(evaluationResult: RepoEvaluationResult | undefined) {
    if (!evaluationResult) {
      return;
    }

    setGeneratingSummary(true);
    fetch("/api/commit-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commits: evaluationResult.commits }),
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

          console.info(
            "Summary cost: $" +
              (
                (data.totalConsumedTokens.input * 0.03 +
                  data.totalConsumedTokens.output * 0.06) /
                1000
              ).toFixed(2)
          );

          const since = new Date();
          since.setHours(0, 0, 0, 0);
          since.setMonth(since.getMonth() - 1);

          const until = new Date();
          until.setHours(0, 0, 0, 0);

          setGeneratingSummary(false);
          addCommitSummary({
            repoId: repo.id,
            summary: data.report,
            since: since.toISOString(),
            until: until.toISOString(),
          }).catch(console.error);
        }
      )
      .catch(console.error);
  }

  function getSummaryHtml(
    summary: string,
    authors: RepoQueryResponseDataCommitAuthor[]
  ) {
    let html = summary
      .replace(
        /(critical|severe|serious|bugs?|hot[ -]?fix|urgent|breaking change)/gi,
        '<strong class="text-red-400">$1</strong>'
      )
      .replace(
        /(feature(s)?|fix(e[sd])?|design|test(s)?|terms of use|terms of service|licen[sc]e)/gi,
        '<strong class="text-sky-400">$1</strong>'
      )
      .replace(
        /\(#(\d+)\)/gi,
        `<a href="https://github.com/${repo.fullName}/issues/$1" target="_blank" class="text-lime-400">(#$1)</a>`
      );

    authors.forEach((author) => {
      html = html.replace(
        new RegExp(`${author.user.login}`, "gi"),
        `<a href="https://github.com/${author.user.login}" target="_blank" class="font-bold pr-1 whitespace-nowrap">
          <img src="${author.user.avatarUrl}" class="w-3 h-3 rounded-full inline-block ml-1" />
          ${author.user.login}
        </a>`
      );
    });

    return html;
  }

  if (!latestEvaluation || latestEvaluation.result === undefined) {
    return <WaitingForFirstEvaluation />;
  }

  return (
    <>
      <CardActivityChart evaluationResult={latestEvaluation.result} />
      <div className="p-3">
        {!generatingSummary && summaries?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Button
              className="mt-2"
              onClick={() => generateSummary(latestEvaluation.result)}
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
              className="mt-3 leading-normal text-gray-300"
              dangerouslySetInnerHTML={{
                __html: getSummaryHtml(
                  latestSummary.summary,
                  latestEvaluation.result.authors
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
    </>
  );
}
