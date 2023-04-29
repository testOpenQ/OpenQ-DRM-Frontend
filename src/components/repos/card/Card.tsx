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

export default function Card({
  repo,
  since,
  until,
}: {
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
  );

  useEffect(() => {
    submitScore(repo.id, "activity", 10);
    submitScore(repo.id, "growth", 3);
    submitScore(repo.id, "popularity", 3);
    submitScore(repo.id, "reputation", 8);
  });

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader repo={repo} since={since} until={until} />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          {evaluations && evaluations[0] && evaluations[0].result && (
            <CardMembers
              members={evaluations[0].result.authors.map((a) => a.user)}
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
      {evaluations && evaluations[0] && evaluations[0].result && (
        <>
          <CardActivityChart repoEvaluation={evaluations[0].result} />
          <Tabs
            repo={repo}
            evaluation={evaluations[0].result}
            since={since}
            until={until}
          />
        </>
      )}
    </div>
  );
}
