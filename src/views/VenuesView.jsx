import { Bar } from "react-chartjs-2";
import { AnalyticsEngine } from "../analytics/AnalyticsEngine.js";
import { ChartRenderer } from "../charts/ChartRenderer.js";
import { useAppStore } from "../state/AppStore.jsx";

export function VenuesView() {
  const { state } = useAppStore();
  const venues = new AnalyticsEngine(state.records).venueCounts();
  const chart = { labels: venues.map((item) => item.venue), datasets: [{ data: venues.map((item) => item.count), backgroundColor: "#f59e0b", borderRadius: 7 }] };
  return <><div className="page-heading"><p className="eyebrow">Where it happens</p><h1>Venue comparison</h1><p>Compare repertoire activity across performance locations.</p></div><section className="panel chart-panel"><div className="chart-box chart-box--tall"><Bar data={chart} options={ChartRenderer.options({ horizontal: true })} /></div></section></>;
}
