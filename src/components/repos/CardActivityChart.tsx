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

  return <Line data={data} options={options} />;
}
