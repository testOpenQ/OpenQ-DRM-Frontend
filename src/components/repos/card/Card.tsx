import CardActivityChart from "./ActivityChart";
import CardMembers from "./Members";
import CardScores from "./Scores";
import { signIn, useSession } from "next-auth/react";
import { scansDb, type Repo } from "~/db";
import Button from "../../base/Button";
import { generateFakeScores } from "~/lib/scores";
import { Scan } from "@mktcodelib/github-scanner";
import CardHeader from "./Header";
import Tabs from "./tabs/Tabs";
import { useEffect, useState } from "react";
import { RepoEvaluation, evaluateRepoData } from "~/lib/github/repo/evaluate";
import { useLiveQuery } from "dexie-react-hooks";

export default function Card({
  repo,
  since,
  until,
  ranks,
  submitScore,
}: {
  repo: Repo;
  since: string;
  until: string;
  ranks: { [key: string]: number };
  submitScore: (score: number, category: string) => void;
}) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [repoEvaluation, setRepoEvaluation] = useState<RepoEvaluation | null>(
    null
  );

  const lastScan = useLiveQuery(
    () => scansDb.scans.get(repo.lastScanId || 0) as Promise<Scan>,
    [repo.lastScanId]
  );

  const fakeScores = generateFakeScores(repo.fullName);

  useEffect(() => {
    (async () => {
      if (lastScan) {
        const repoEvaluation = evaluateRepoData(lastScan.data.repository);
        setRepoEvaluation(repoEvaluation);
        submitScore(repoEvaluation.commitsTrend, "activity");
      }
    })();
  }, [lastScan]);

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader repo={repo} since={since} until={until} />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {repoEvaluation && (
            <CardMembers members={repoEvaluation.authors.map((a) => a.user)} />
          )}
          {!repoEvaluation && (
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
            activity={fakeScores[1] || 0}
            growth={fakeScores[1] || 0}
            popularity={fakeScores[2] || 0}
            reputation={fakeScores[3] || 0}
          />
        </div>
      </div>
      {repoEvaluation && <CardActivityChart repoEvaluation={repoEvaluation} />}
      <Tabs
        repo={repo}
        lastScanData={lastScan?.data.repository}
        since={since}
        until={until}
      />
    </div>
  );
}
