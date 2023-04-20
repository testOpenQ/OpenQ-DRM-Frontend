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
import { type Repo } from "~/db";
import Button from "../base/Button";
import numberFormatter from "~/lib/numberFormatter";
import { generateFakeScores } from "~/lib/scores";
import CardHeader from "./card/Header";
import CardNav from "./card/Nav";
import ChangesTab from "./card/tabs/Changes";
import useRepoScanner from "~/hooks/useRepoScanner";

export default function Card({ repo }: { repo: Repo }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

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

  const [showCommitSummary, setShowCommitSummary] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [showDiscussions, setShowDiscussions] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);

  const scores = generateFakeScores(repo);

  const { repoScanResult } = useRepoScanner(repo);

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader repo={repo} />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {repoScanResult && (
            <CardMembers members={repoScanResult.authors.map((a) => a.user)} />
          )}
          {!repoScanResult && (
            <div className="flex grow flex-col items-center justify-center px-12">
              {accessToken && (
                <div className="text-sm text-gray-600">
                  Waiting for first scan to begin...
                </div>
              )}
              {!accessToken && (
                <Button className="w-full flex-col" onClick={handleSignIn}>
                  <span className="text-center text-xs font-normal text-indigo-400">
                    Start fetching data:
                  </span>
                  Connect to GitHub
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 px-5 py-3">
          <CardScores
            activity={scores[0] || 0}
            growth={scores[1] || 0}
            popularity={scores[2] || 0}
            reputation={scores[3] || 0}
          />
        </div>
      </div>
      {repoScanResult && (
        <div className="bg-gray-900/50 pt-3">
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
        <CardNav
          onClickChanges={() => setShowCommitSummary(!showCommitSummary)}
          onClickIssues={() => setShowIssues(!showIssues)}
          onClickDiscussions={() => setShowDiscussions(!showDiscussions)}
          onClickDevelopers={() => setShowDevelopers(!showDevelopers)}
        />
        <div
          className={`${
            showCommitSummary ? "max-h-40" : "max-h-0"
          } overflow-auto transition-all`}
        >
          <ChangesTab repo={repo} since={since} until={until} />
        </div>
      </div>
    </div>
  );
}
