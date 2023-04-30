import { ChartOptions } from "chart.js";

export const options: ChartOptions<"line"> = {
  aspectRatio: 10,
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
