import { Doughnut } from "react-chartjs-2";
import { AnalyticsEngine } from "../analytics/AnalyticsEngine.js";
import { MetricCard } from "../components/MetricCard.jsx";
import { useAppStore } from "../state/AppStore.jsx";

export function OriginalsView() {
  const { state, filteredRecords, dispatch } = useAppStore();
  const analytics = new AnalyticsEngine(filteredRecords);
  const breakdown = analytics.classificationBreakdown();
  const progress = analytics.originalsGoalProgress(state.settings.originalsGoalPercent);
  const chart = { labels: breakdown.map((item) => item.name), datasets: [{ data: breakdown.map((item) => item.count), backgroundColor: ["#2dd4bf", "#a78bfa", "#475569"], borderWidth: 0 }] };
  return (
    <>
      <div className="page-heading"><p className="eyebrow">Originality mix</p><h1>Originals dashboard</h1><p>Track the balance between your own material, covers, and songs that still need classification.</p></div>
      <section className="goal-grid">
        <article className="panel goal-panel"><p className="eyebrow">Current goal</p><div className="goal-number">{progress.current}% <span>of {progress.goal}%</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, progress.goal ? (progress.current / progress.goal) * 100 : 100)}%` }} /></div><strong>{progress.met ? "Goal reached" : `${Math.round((progress.goal - progress.current) * 10) / 10} points to go`}</strong><label>Original-performance target<input type="range" min="0" max="100" step="5" value={state.settings.originalsGoalPercent} onChange={(event) => dispatch({ type: "SET_GOAL", value: Number(event.target.value) })} /><span>{state.settings.originalsGoalPercent}%</span></label></article>
        <article className="panel chart-panel"><div className="section-heading"><div><p className="eyebrow">Classification</p><h2>Performance mix</h2></div></div><div className="chart-box"><Doughnut data={chart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#cbd5e1", usePointStyle: true } } } }} /></div></article>
      </section>
      <section className="metrics">{breakdown.map((item) => <MetricCard key={item.name} label={item.name} value={`${item.percent}%`} detail={`${item.count} performances`} />)}</section>
    </>
  );
}
