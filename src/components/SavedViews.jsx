import { useState } from "react";
import { APP_CONFIG } from "../config/appConfig.js";
import { CloudSettingsService } from "../services/CloudSettingsService.js";
import { useAppStore } from "../state/AppStore.jsx";

const cloud = new CloudSettingsService({ binId: APP_CONFIG.jsonBinId, accessKey: APP_CONFIG.jsonBinAccessKey });

export function SavedViews() {
  const { state, dispatch } = useAppStore();
  const [name, setName] = useState("");
  const [cloudStatus, setCloudStatus] = useState("");
  function saveLocal() {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({ type: "SAVE_VIEW", view: { name: trimmed, filters: state.filters, originalsGoalPercent: state.settings.originalsGoalPercent } });
    setName("");
  }
  async function saveCloud() {
    setCloudStatus("Saving…");
    try {
      await cloud.save({ originalsGoalPercent: state.settings.originalsGoalPercent, savedView: state.filters, updatedAt: new Date().toISOString() });
      setCloudStatus("Shared settings saved to JSONBin.");
    } catch (error) { setCloudStatus(error.message); }
  }
  return (
    <section className="panel">
      <div className="section-heading compact"><div><p className="eyebrow">Local first</p><h2>Saved views</h2></div></div>
      <div className="save-row"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="View name" aria-label="Saved view name" /><button className="button" onClick={saveLocal}>Save view</button></div>
      {state.savedViews.length > 0 && <div className="chip-row">{state.savedViews.map((view) => <button className="chip" key={view.name} onClick={() => dispatch({ type: "APPLY_VIEW", view })}>{view.name}</button>)}</div>}
      <div className="cloud-row"><button className="button button--secondary" onClick={saveCloud} disabled={!cloud.configured}>Save shared preset</button><span>{cloud.configured ? cloudStatus : "Add JSONBin values to .env to enable cloud saving."}</span></div>
    </section>
  );
}
