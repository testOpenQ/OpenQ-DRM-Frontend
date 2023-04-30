import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  type ChartData,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { options } from "~/lib/chartjs";
import { RepoEvaluationResult } from "~/lib/github/repo/evaluate";
import { formatter } from "~/lib/numbers";

function prepareChartData(repoEvaluation: RepoEvaluationResult) {
  const commits = repoEvaluation.commitsByDayNormalized.commitCount;
  commits.reverse();
  const linesChanged = repoEvaluation.commitsByDayNormalized.linesChanged;
  linesChanged.reverse();

  return {
    labels: Object.keys(repoEvaluation.commitsByDay),
    datasets: [
      {
        data: commits,
        borderColor: "white",
        borderWidth: 3,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.4,
      },
      {
        data: linesChanged,
        borderColor: "gray",
        borderWidth: 2,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

export default function CardActivityChart({
  evaluation,
}: {
  evaluation: RepoEvaluationResult;
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
  );

  const data: ChartData<"line"> = useMemo(
    () => prepareChartData(evaluation),
    [evaluation]
  );

  return (
    <div className="bg-gray-900/50 pt-3">
      <div className="mb-3 flex items-center justify-center space-x-6 text-center text-xs text-gray-400">
        <div>
          {formatter.format(evaluation.commitCount)} commits
          <div className="mr-2 mt-1 h-1 w-full rounded-full bg-white"></div>
        </div>
        <div>
          {formatter.format(evaluation.linesChanged)} changes
          <div className="mr-2 mt-1 h-0.5 w-full rounded-full bg-gray-400"></div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
