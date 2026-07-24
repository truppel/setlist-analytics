export function downloadJson(records) {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "performance-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}
