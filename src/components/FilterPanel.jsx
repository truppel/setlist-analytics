import { useAppStore } from "../state/AppStore.jsx";

export function FilterPanel() {
  const { state, dataset, dispatch } = useAppStore();
  const update = (event) => dispatch({ type: "SET_FILTER", name: event.target.name, value: event.target.value });
  return (
    <section className="filter-panel" aria-labelledby="filters-heading">
      <div className="section-heading compact">
        <div><p className="eyebrow">Refine the story</p><h2 id="filters-heading">Filters</h2></div>
        <button className="text-button" onClick={() => dispatch({ type: "RESET_FILTERS" })}>Reset all</button>
      </div>
      <div className="filter-grid">
        <label>Classification
          <select name="classification" value={state.filters.classification} onChange={update}>
            <option value="all">All classifications</option><option value="original">Originals</option><option value="cover">Covers</option><option value="unknown">Unknown</option>
          </select>
        </label>
        <label>Venue
          <select name="venue" value={state.filters.venue} onChange={update}>
            <option value="all">All venues</option>{dataset.unique("venue").map((venue) => <option key={venue}>{venue}</option>)}
          </select>
        </label>
        <label>Search songs<input name="song" type="search" value={state.filters.song} onChange={update} placeholder="Type a song title" /></label>
        <label>From<input name="startDate" type="date" value={state.filters.startDate} onChange={update} /></label>
        <label>To<input name="endDate" type="date" value={state.filters.endDate} onChange={update} /></label>
      </div>
    </section>
  );
}
