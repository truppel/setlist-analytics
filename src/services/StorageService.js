export class StorageService {
  constructor(key, version) {
    this.key = key;
    this.version = version;
  }

  load() {
    try {
      const value = JSON.parse(localStorage.getItem(this.key));
      return value?.version === this.version ? value : null;
    } catch { return null; }
  }

  save({ records, filters, settings, savedViews = [] }) {
    const value = {
      version: this.version,
      savedAt: new Date().toISOString(),
      records: records.map((record) => ({ ...record })),
      filters,
      settings,
      savedViews,
    };
    localStorage.setItem(this.key, JSON.stringify(value));
    return value;
  }

  isFresh(savedAt, ttlMs) {
    return Boolean(savedAt) && Date.now() - new Date(savedAt).valueOf() < ttlMs;
  }
}
