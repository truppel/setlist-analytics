export const APP_CONFIG = {
  schemaVersion: 1,
  cacheKey: "live-repertoire-explorer:v1",
  cacheTtlMs: 1000 * 60 * 60,
  requestTimeoutMs: 10000,
  retryCount: 2,
  datasetUrl: import.meta.env.VITE_DATASET_URL || `${import.meta.env.BASE_URL}data/performances.json`,
  jsonBinId: import.meta.env.VITE_JSONBIN_BIN_ID || "",
  jsonBinAccessKey: import.meta.env.VITE_JSONBIN_ACCESS_KEY || "",
};

export const DEFAULT_FILTERS = {
  classification: "all",
  venue: "all",
  song: "",
  startDate: "",
  endDate: "",
};

export const DEFAULT_SETTINGS = {
  originalsGoalPercent: 20,
};
