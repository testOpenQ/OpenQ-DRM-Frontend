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
import type { RepoEvaluationResult } from "~/lib/evaluation/Repo/RepoEvaluator";
import { formatter } from "~/lib/numbers";

function prepareChartData(evaluationResult: RepoEvaluationResult) {
  const commits = evaluationResult.commitsByDayNormalized.commitCount;
  commits.reverse();
  const linesChanged = evaluationResult.commitsByDayNormalized.linesChanged;
  linesChanged.reverse();

  return {
    labels: Object.keys(evaluationResult.commitsByDay),
    datasets: [
      {
        data: commits,
        borderColor: "white",
        borderWidth: 2,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0.4,
      },
      {
        data: linesChanged,
        borderColor: "rgb(79 70 229)",
        borderWidth: 2,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };
}

export default function CardActivityChart({
  evaluationResult,
}: {
  evaluationResult: RepoEvaluationResult;
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
  );

  const data: ChartData<"line"> = useMemo(
    () => prepareChartData(evaluationResult),
    [evaluationResult]
  );

  return (
    <div className="pt-3">
      <div className="mb-3 flex items-center justify-center space-x-6 text-center text-xs text-gray-400">
        <div>
          {formatter.format(evaluationResult.commitCount)} changes
          <div className="mr-2 mt-1 h-0.5 w-full rounded-full bg-white"></div>
        </div>
        <div>
          {formatter.format(evaluationResult.linesChanged)} lines
          <div className="mr-2 mt-1 h-0.5 w-full rounded-full bg-indigo-600"></div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
