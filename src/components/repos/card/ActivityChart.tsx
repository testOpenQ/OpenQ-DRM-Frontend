import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
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
  repoEvaluation,
}: {
  repoEvaluation: RepoEvaluationResult;
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
  );

  const data: ChartData<"line"> = useMemo(
    () => prepareChartData(repoEvaluation),
    [repoEvaluation]
  );

  const options: ChartOptions<"line"> = useMemo(() => {
    return {
      aspectRatio: 15,
      layout: {
        padding: {
          top: 5,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        filler: {
          drawTime: "beforeDatasetsDraw",
          propagate: true,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    };
  }, []);

  return (
    <div className="bg-gray-900/50 pt-3">
      <div className="mb-3 flex items-center justify-center space-x-6 text-center text-xs text-gray-400">
        <div>
          {formatter.format(repoEvaluation.commitCount)} commits
          <div className="mr-2 mt-1 h-1 w-full rounded-full bg-white"></div>
        </div>
        <div>
          {formatter.format(repoEvaluation.linesChanged)} changes
          <div className="mr-2 mt-1 h-0.5 w-full rounded-full bg-gray-400"></div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
