import { NavLink, Route, Routes } from "react-router-dom";
import { DashboardView } from "../views/DashboardView.jsx";
import { OriginalsView } from "../views/OriginalsView.jsx";
import { SongsView } from "../views/SongsView.jsx";
import { VenuesView } from "../views/VenuesView.jsx";

const navItems = [["/", "Dashboard"], ["/originals", "Originals"], ["/songs", "Songs"], ["/venues", "Venues"]];

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/"><span className="brand-mark">LR</span><span>Live Repertoire<small>Explorer</small></span></NavLink>
        <nav aria-label="Main navigation">{navItems.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav>
      </header>
      <main>
        <Routes><Route path="/" element={<><div className="hero"><div><p className="eyebrow">Your repertoire, in motion</p><h1>See what the band actually plays.</h1><p>Explore frequency, rotation, venues, and the path toward more original music.</p></div><div className="hero-orbit" aria-hidden="true"><span>SET</span><strong>LIVE</strong><i>REPEAT</i></div></div><DashboardView /></>} /><Route path="/originals" element={<OriginalsView />} /><Route path="/songs" element={<SongsView />} /><Route path="/venues" element={<VenuesView />} /><Route path="*" element={<DashboardView />} /></Routes>
      </main>
      <footer><span>Live Repertoire Explorer</span><span>Local-first concert analytics</span></footer>
    </div>
  );
}
