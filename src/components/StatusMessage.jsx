export function StatusMessage({ status, message, lastUpdated, invalidCount, onRetry }) {
  return (
    <div className={`status status--${status}`} role={status === "error" ? "alert" : "status"}>
      <span className="status-dot" aria-hidden="true" />
      <div>
        <strong>{status === "offline" ? "Offline mode" : status === "error" ? "Data unavailable" : status === "refreshing" ? "Refreshing" : "Dataset ready"}</strong>
        <p>{message}{invalidCount ? ` ${invalidCount} invalid row(s) were skipped.` : ""}</p>
        {lastUpdated && <small>Last saved {new Date(lastUpdated).toLocaleString()}</small>}
      </div>
      {(status === "offline" || status === "error") && <button className="button button--small" onClick={onRetry}>Retry</button>}
    </div>
  );
}
