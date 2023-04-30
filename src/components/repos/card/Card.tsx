import CardActivityChart from "./ActivityChart";
import CardMembers from "./Members";
import CardScores from "./Scores";
import { signIn, useSession } from "next-auth/react";
import { type Repo, getEvaluationsByTypeAndTagetId } from "~/db";
import Button from "../../base/Button";
import CardHeader from "./Header";
import Tabs from "./tabs/Tabs";
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useSubmitScore } from "~/store/ScoresProvider";
import { generateFakeScores } from "~/lib/scores";
import { RepoEvaluation } from "~/lib/github/repo/evaluate";

export default function Card({
  campaignId,
  repo,
  since,
  until,
}: {
  campaignId: number;
  repo: Repo;
  since: string;
  until: string;
}) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const submitScore = useSubmitScore();

  const evaluations = useLiveQuery(
    () => getEvaluationsByTypeAndTagetId("repo", repo.id),
    [repo.id]
  ) as RepoEvaluation[];

  const latestEvaluation = evaluations?.[0];
  const previousEvaluation = evaluations?.[1];
  const displayedEvaluation = latestEvaluation?.result
    ? latestEvaluation
    : previousEvaluation;
  const isEvaluating = latestEvaluation !== undefined && !latestEvaluation.done;

  const fakeScores = generateFakeScores(repo.fullName);

  useEffect(() => {
    submitScore(repo.id, "activity", fakeScores.activity);
    submitScore(repo.id, "growth", fakeScores.growth);
    submitScore(repo.id, "popularity", fakeScores.popularity);
    submitScore(repo.id, "reputation", fakeScores.reputation);
  });

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader
        campaignId={campaignId}
        repo={repo}
        since={since}
        until={until}
        isEvaluating={isEvaluating}
      />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {displayedEvaluation && displayedEvaluation.result && (
            <CardMembers
              members={displayedEvaluation.result.authors.map((a) => a.user)}
            />
          )}
          {!evaluations?.length && (
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
          <CardScores repo={repo} />
        </div>
      </div>
      {displayedEvaluation && displayedEvaluation.result && (
        <>
          <CardActivityChart evaluation={displayedEvaluation.result} />
          <Tabs
            repo={repo}
            evaluation={displayedEvaluation.result}
            since={since}
            until={until}
          />
        </>
      )}
    </div>
  );
}
