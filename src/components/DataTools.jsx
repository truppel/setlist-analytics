import { useRef, useState } from "react";
import { PerformanceRecord } from "../models/PerformanceRecord.js";
import { useAppStore } from "../state/AppStore.jsx";
import { downloadJson } from "../utils/exportUtils.js";

export function DataTools() {
  const { state, dispatch } = useAppStore();
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  async function importFile(event) {
    try {
      const raw = JSON.parse(await event.target.files[0].text());
      const items = Array.isArray(raw) ? raw : raw.records;
      const records = items.map(PerformanceRecord.from);
      dispatch({ type: "IMPORT_DATA", records });
      setMessage(`Imported ${records.length} records.`);
    } catch (error) { setMessage(`Import failed: ${error.message}`); }
    event.target.value = "";
  }
  return (
    <div className="tool-row">
      <button className="button button--secondary" onClick={() => inputRef.current.click()}>Import JSON</button>
      <input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importFile} />
      <button className="button button--secondary" onClick={() => downloadJson(state.records)}>Export JSON</button>
      {message && <span role="status">{message}</span>}
    </div>
  );
}
