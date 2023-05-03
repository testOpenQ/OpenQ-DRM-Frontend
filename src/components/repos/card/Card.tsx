import CardMembers from "./Members";
import CardScores from "./Scores";
import type { Repo } from "~/store/model";
import CardHeader from "./Header";
import Tabs from "./tabs/Tabs";
import { useEffect } from "react";
import { useSubmitScore } from "~/providers/ScoresProvider";
import { generateFakeScores } from "~/lib/scores";

export default function Card({
  campaignId,
  repo,
}: {
  campaignId?: number;
  repo: Repo;
}) {
  const submitScore = useSubmitScore();

  const fakeScores = generateFakeScores(repo.fullName);

  useEffect(() => {
    submitScore(repo.id, "activity", fakeScores.activity);
    submitScore(repo.id, "growth", fakeScores.growth);
    submitScore(repo.id, "popularity", fakeScores.popularity);
    submitScore(repo.id, "reputation", fakeScores.reputation);
  });

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <CardHeader repo={repo} campaignId={campaignId} />
      <div className="flex flex-col sm:flex-row">
        <div className="flex grow flex-col items-center justify-center">
          <CardMembers />
        </div>
        <div className="flex-1 px-5 py-3">
          <CardScores repo={repo} />
        </div>
      </div>
      <Tabs repo={repo} />
    </div>
  );
}
