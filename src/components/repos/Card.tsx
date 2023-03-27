import { RepoCommitsEvaluation } from '@mktcodelib/github-insights';
import CardActivityChart from './CardActivityChart';
import CardMembers from './CardMembers';
import CardScores from './CardScores';

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export default function Card({ data }: { data: RepoCommitsEvaluation }) {
  return (
    <div className="border rounded-lg flex flex-col sm:flex-row">
      <div className="flex flex-col border-b sm:border-b-0 sm:border-r">
        <CardMembers />
        <div
          className="flex justify-center space-x-1 text-xs text-center p-3"
        >
          <span>{ Object.keys(data.commitsByAuthor).length } contributors</span>
          <span>•</span>
          <span>{ numberFormatter.format(data.commitCount) } commits</span>
          <span>•</span>
          <span>{ numberFormatter.format(data.linesChanged) } changes</span>
        </div>
        <CardActivityChart />
      </div>
      <div className="px-5 py-3">
        <div className="font-bold text-right">
          Submission to hackathon
        </div>
        <div className="text-right text-xs mb-3">
          OpenQDev/OpenQ-Frontend
        </div>
        <CardScores />
      </div>
    </div>
  );
}
