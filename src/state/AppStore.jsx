import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { APP_CONFIG, DEFAULT_FILTERS, DEFAULT_SETTINGS } from "../config/appConfig.js";
import { PerformanceDataset } from "../models/PerformanceDataset.js";
import { PublishedDatasetSource } from "../services/PublishedDatasetSource.js";
import { StorageService } from "../services/StorageService.js";

const AppStore = createContext(null);
const storage = new StorageService(APP_CONFIG.cacheKey, APP_CONFIG.schemaVersion);
const source = new PublishedDatasetSource({
  url: APP_CONFIG.datasetUrl,
  timeoutMs: APP_CONFIG.requestTimeoutMs,
  retryCount: APP_CONFIG.retryCount,
});

const cached = storage.load();
const cacheIsFresh = storage.isFresh(cached?.savedAt, APP_CONFIG.cacheTtlMs);
const initialState = {
  records: cached?.records || [],
  filters: { ...DEFAULT_FILTERS, ...cached?.filters },
  settings: { ...DEFAULT_SETTINGS, ...cached?.settings },
  savedViews: cached?.savedViews || [],
  status: cached?.records?.length ? (cacheIsFresh ? "success" : "refreshing") : "loading",
  message: cached?.records?.length
    ? (cacheIsFresh ? "Showing recently saved performance data." : "Showing saved data while checking for updates.")
    : "Loading performance data…",
  lastUpdated: cached?.savedAt || "",
  invalidCount: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return { ...state, records: action.records, invalidCount: action.invalidCount, status: action.records.length ? "success" : "empty", message: action.message, lastUpdated: action.savedAt };
    case "LOAD_ERROR":
      return { ...state, status: state.records.length ? "offline" : "error", message: state.records.length ? "Offline: using your most recently saved data." : action.message };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, [action.name]: action.value } };
    case "RESET_FILTERS":
      return { ...state, filters: DEFAULT_FILTERS };
    case "SET_GOAL":
      return { ...state, settings: { ...state.settings, originalsGoalPercent: action.value } };
    case "SAVE_VIEW":
      return { ...state, savedViews: [...state.savedViews.filter((view) => view.name !== action.view.name), action.view] };
    case "APPLY_VIEW":
      return { ...state, filters: { ...DEFAULT_FILTERS, ...action.view.filters }, settings: { ...state.settings, originalsGoalPercent: action.view.originalsGoalPercent } };
    case "IMPORT_DATA":
      return { ...state, records: action.records, status: action.records.length ? "success" : "empty", message: `Imported ${action.records.length} records.`, lastUpdated: new Date().toISOString() };
    default: return state;
  }
}

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refresh = useCallback(async () => {
    try {
      const result = await source.loadPerformances();
      dispatch({ type: "LOAD_SUCCESS", records: result.records, invalidCount: result.invalid.length, savedAt: new Date().toISOString(), message: `Loaded ${result.records.length} performance records.` });
    } catch (error) {
      dispatch({ type: "LOAD_ERROR", message: error.name === "AbortError" ? "The dataset request timed out." : error.message });
    }
  }, []);

  useEffect(() => {
    if (!cacheIsFresh) refresh();
  }, [refresh]);

  useEffect(() => {
    if (!state.records.length) return;
    storage.save(state);
  }, [state.records, state.filters, state.settings, state.savedViews]);

  const dataset = useMemo(() => new PerformanceDataset(state.records), [state.records]);
  const filteredRecords = useMemo(() => dataset.filter(state.filters).records, [dataset, state.filters]);
  const value = useMemo(() => ({ state, dispatch, dataset, filteredRecords, refresh }), [state, dataset, filteredRecords, refresh]);
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStore);
  if (!context) throw new Error("useAppStore must be used within AppStoreProvider");
  return context;
}
