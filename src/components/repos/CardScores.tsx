import CardScore from './CardScore';

function randomScore() {
  return Math.floor(Math.random() * 5) + 1;
}

export default function CardScores() {
  return (
    <div className="flex flex-col items-end text-gray-900 text-sm">
      <CardScore
        label="Activity"
        score={randomScore()}
        activeClass="bg-lime-500"
      />
      <CardScore
        label="Growth"
        score={randomScore()}
        activeClass="bg-cyan-500"
      />
      <CardScore
        label="Popularity"
        score={randomScore()}
        activeClass="bg-violet-500"
      />
      <CardScore
        label="Reputation"
        score={randomScore()}
        activeClass="bg-rose-500"
      />
    </div>
  );
}
