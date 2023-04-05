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
import { Line } from "react-chartjs-2";

interface CommitsByDay {
  [key: string]: { commitCount: number; linesChanged: number };
}
interface CommitsByDayNormalized {
  commitCount: number[];
  linesChanged: number[];
}

function prepareChartData(
  commitsByDay: CommitsByDay,
  commitsByDayNormalized: CommitsByDayNormalized
) {
  const commits = commitsByDayNormalized.commitCount;
  commits.reverse();
  const linesChanged = commitsByDayNormalized.linesChanged;
  linesChanged.reverse();

  return {
    labels: Object.keys(commitsByDay),
    datasets: [
      {
        data: commits,
        backgroundColor: "rgba(0, 255, 0, 0.05)",
        borderColor: "green",
        borderWidth: 2,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.2,
      },
      {
        data: linesChanged,
        backgroundColor: "rgba(255, 0, 0, 0.05)",
        borderColor: "red",
        borderWidth: 2,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.2,
      },
    ],
  };
}

export default function CardActivityChart({
  commitsByDay,
  commitsByDayNormalized,
}: {
  commitsByDay: CommitsByDay;
  commitsByDayNormalized: CommitsByDayNormalized;
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
  );

  const data: ChartData<"line"> = prepareChartData(
    commitsByDay,
    commitsByDayNormalized
  );
  const options: ChartOptions<"line"> = {
    aspectRatio: 7,
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

  return <Line data={data} options={options} />;
}
