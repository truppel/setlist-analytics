import { AnalyticsEngine } from "../analytics/AnalyticsEngine.js";
import { SongTable } from "../components/SongTable.jsx";
import { useAppStore } from "../state/AppStore.jsx";

export function SongsView() {
  const { state } = useAppStore();
  const analytics = new AnalyticsEngine(state.records);
  const rotationStatuses = new Map(
    analytics.songRotationStatuses().map((song) => [song.title.toLowerCase(), song.rotationStatus]),
  );
  const songs = analytics.songPlayCounts().map((song) => ({
    ...song,
    rotationStatus: rotationStatuses.get(song.title.toLowerCase()),
  }));
  const stale = analytics.staleSongs(90);
  return (
    <>
      <div className="page-heading"><p className="eyebrow">Repertoire health</p><h1>Song catalog</h1><p>Review frequency and find songs that have fallen out of rotation.</p></div>
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">Complete catalog</p><h2>Play counts</h2></div></div><SongTable songs={songs} /></section>
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">Rotation check</p><h2>Not played in 90 days</h2></div><span>Relative to latest gig</span></div>{stale.length ? <div className="stale-list">{stale.map((song) => <div key={song.title}><strong>{song.title}</strong><span>Last played {new Date(`${song.lastPlayed}T00:00:00`).toLocaleDateString()}</span></div>)}</div> : <p className="muted">Every song was played within the last 90 days of the dataset.</p>}</section>
    </>
  );
}
