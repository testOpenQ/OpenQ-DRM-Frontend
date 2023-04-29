import { useScores } from "~/store/ScoresProvider";
import CardScore from "./Score";
import { Repo } from "~/db";

export default function CardScores({ repo }: { repo: Repo }) {
  const scores = useScores();
  const activity = scores[repo.id]?.activity || 0;
  const growth = scores[repo.id]?.growth || 0;
  const popularity = scores[repo.id]?.popularity || 0;
  const reputation = scores[repo.id]?.reputation || 0;

  return (
    <div className="flex flex-col items-end text-sm">
      <CardScore label="Activity" score={activity} activeClass="bg-lime-700" />
      <CardScore label="Growth" score={growth} activeClass="bg-cyan-700" />
      <CardScore
        label="Popularity"
        score={popularity}
        activeClass="bg-violet-700"
      />
      <CardScore
        label="Reputation"
        score={reputation}
        activeClass="bg-red-700"
      />
    </div>
  );
}
