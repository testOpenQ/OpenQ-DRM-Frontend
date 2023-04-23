import CardScore from "./CardScore";

export default function CardScores({
  activity,
  growth,
  popularity,
  reputation,
}: {
  activity: number;
  growth: number;
  popularity: number;
  reputation: number;
}) {
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
