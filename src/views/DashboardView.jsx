import { Bar, Line } from "react-chartjs-2";
import { AnalyticsEngine } from "../analytics/AnalyticsEngine.js";
import { ChartRenderer } from "../charts/ChartRenderer.js";
import { DataTools } from "../components/DataTools.jsx";
import { FilterPanel } from "../components/FilterPanel.jsx";
import { MetricCard } from "../components/MetricCard.jsx";
import { SavedViews } from "../components/SavedViews.jsx";
import { SongTable } from "../components/SongTable.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { useAppStore } from "../state/AppStore.jsx";

export function DashboardView() {
  const { state, filteredRecords, refresh } = useAppStore();
  const analytics = new AnalyticsEngine(filteredRecords);
  const summary = analytics.summary();
  const songs = analytics.songPlayCounts();
  const topSongs = songs.slice(0, 10);
  const months = analytics.performancesByMonth();
  const topChart = { labels: topSongs.map((song) => song.title), datasets: [{ data: topSongs.map((song) => song.count), backgroundColor: "#2dd4bf", borderRadius: 7 }] };
  const trendChart = { labels: months.map((item) => item.month), datasets: [{ data: months.map((item) => item.count), borderColor: "#a78bfa", backgroundColor: "rgba(167,139,250,.2)", tension: 0.35, fill: true }] };

  return (
    <>
      <StatusMessage {...state} onRetry={refresh} />
      <FilterPanel />
      {filteredRecords.length ? (
        <>
          <section className="metrics" aria-label="Performance summary">
            <MetricCard label="Concerts" value={summary.concerts} detail="unique gigs" />
            <MetricCard label="Song performances" value={summary.performances} detail="after filters" />
            <MetricCard label="Unique songs" value={summary.songs} detail="in the repertoire" />
            <MetricCard label="Top-five concentration" value={`${analytics.repertoireConcentration()}%`} detail="of all performances" />
          </section>
          <section className="dashboard-grid">
            <article className="panel chart-panel chart-panel--wide"><div className="section-heading"><div><p className="eyebrow">Repertoire leaders</p><h2>Most-played songs</h2></div><span>Top 10</span></div><div className="chart-box chart-box--tall"><Bar data={topChart} options={ChartRenderer.options({ horizontal: true })} /></div></article>
            <article className="panel chart-panel"><div className="section-heading"><div><p className="eyebrow">Through time</p><h2>Performances by month</h2></div></div><div className="chart-box"><Line data={trendChart} options={ChartRenderer.options()} /></div></article>
          </section>
          <section className="panel"><div className="section-heading"><div><p className="eyebrow">All filtered songs</p><h2>Song frequency</h2></div><DataTools /></div><SongTable songs={songs} /></section>
          <SavedViews />
        </>
      ) : state.status !== "loading" && <section className="empty-state"><strong>No performances match these filters.</strong><p>Reset or broaden the filters to see the repertoire again.</p></section>}
    </>
  );
}
