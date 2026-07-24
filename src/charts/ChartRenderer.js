import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Tooltip, Legend);

export class ChartRenderer {
  static options({ horizontal = false, percent = false } = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? "y" : "x",
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "#111827", titleColor: "#f8fafc", bodyColor: "#cbd5e1" },
      },
      scales: {
        x: { beginAtZero: true, grid: { color: "rgba(148,163,184,.12)" }, ticks: { color: "#94a3b8" }, max: percent ? 100 : undefined },
        y: { beginAtZero: true, grid: { color: "rgba(148,163,184,.12)" }, ticks: { color: "#94a3b8", precision: 0 } },
      },
    };
  }
}
