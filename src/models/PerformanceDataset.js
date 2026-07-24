import { PerformanceRecord } from "./PerformanceRecord.js";

export class PerformanceDataset {
  constructor(records = []) {
    this.records = records.map((record) =>
      record instanceof PerformanceRecord ? record : PerformanceRecord.from(record),
    );
  }

  filter(filters) {
    const query = filters.song.trim().toLowerCase();
    const records = this.records.filter((record) => {
      if (filters.classification !== "all" && record.classification !== filters.classification) return false;
      if (filters.venue !== "all" && record.venue !== filters.venue) return false;
      if (query && !record.songTitle.toLowerCase().includes(query)) return false;
      if (filters.startDate && record.gigDate < filters.startDate) return false;
      if (filters.endDate && record.gigDate > filters.endDate) return false;
      return true;
    });
    return new PerformanceDataset(records);
  }

  sortByDate(direction = "asc") {
    const multiplier = direction === "desc" ? -1 : 1;
    return [...this.records].sort((a, b) => a.gigDate.localeCompare(b.gigDate) * multiplier);
  }

  unique(field) {
    return [...new Set(this.records.map((record) => record[field]).filter(Boolean))].sort();
  }
}
