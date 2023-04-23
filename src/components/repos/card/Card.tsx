import CardActivityChart from "./ActivityChart";
import CardMembers from "./Members";
import CardScores from "./Scores";
import { signIn, useSession } from "next-auth/react";
import { type Repo } from "~/db";
import Button from "../../base/Button";
import { generateFakeScores } from "~/lib/scores";
import CardHeader from "./Header";
import useRepoScanner from "~/hooks/useRepoScanner";
import Tabs from "./tabs/Tabs";

export default function Card({ repo }: { repo: Repo }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const { latestRepoEvaluation, since, until } = useRepoScanner(repo);

  const scores = generateFakeScores(repo.fullName);

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader repo={repo} />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {latestRepoEvaluation && (
            <CardMembers
              members={latestRepoEvaluation.authors.map((a) => a.user)}
            />
          )}
          {!latestRepoEvaluation && (
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
      {latestRepoEvaluation && (
        <CardActivityChart repoEvaluation={latestRepoEvaluation} />
      )}
      <Tabs repo={repo} since={since} until={until} />
    </div>
  );
}
