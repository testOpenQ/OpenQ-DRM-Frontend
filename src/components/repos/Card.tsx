import type { RepoEvaluation } from "@mktcodelib/github-insights";
import CardActivityChart from "./CardActivityChart";
import CardMembers from "./CardMembers";
import CardScores from "./CardScores";

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export default function Card({ data }: { data: RepoEvaluation }) {
  return (
    <div className="flex flex-col rounded-lg border sm:flex-row">
      <div className="flex flex-col border-b sm:border-b-0 sm:border-r">
        <CardMembers />
        <div className="flex justify-center space-x-1 p-3 text-center text-xs">
          <span>{Object.keys(data.commitsByAuthor).length} contributors</span>
          <span>•</span>
          <span>{numberFormatter.format(data.commitCount)} commits</span>
          <span>•</span>
          <span>{numberFormatter.format(data.linesChanged)} changes</span>
        </div>
        <CardActivityChart />
      </div>
      <div className="px-5 py-3">
        <div className="text-right font-bold">Submission to hackathon</div>
        <div className="mb-3 text-right text-xs">OpenQDev/OpenQ-Frontend</div>
        <CardScores />
      </div>
    </div>
  );
}
