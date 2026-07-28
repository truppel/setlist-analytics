export class AnalyticsEngine {
  constructor(records = []) {
    this.records = records;
  }

  summary() {
    return {
      concerts: new Set(this.records.map((record) => record.gigId)).size,
      performances: this.records.length,
      songs: new Set(this.records.map((record) => record.songTitle.toLowerCase())).size,
    };
  }

  songPlayCounts() {
    const counts = new Map();
    this.records.forEach((record) => {
      const key = record.songTitle.toLowerCase();
      const current = counts.get(key) || { title: record.songTitle, artist: record.songArtist, count: 0 };
      current.count += 1;
      counts.set(key, current);
    });
    return [...counts.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
  }

  classificationBreakdown() {
    const counts = { original: 0, cover: 0, unknown: 0 };
    this.records.forEach((record) => { counts[record.classification] += 1; });
    const total = this.records.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 1000) / 10,
    }));
  }

  performancesByMonth() {
    const counts = new Map();
    this.records.forEach((record) => {
      const month = record.gigDate.slice(0, 7);
      counts.set(month, (counts.get(month) || 0) + 1);
    });
    return [...counts.entries()].sort().map(([month, count]) => ({ month, count }));
  }

  venueCounts() {
    const counts = new Map();
    this.records.forEach((record) => counts.set(record.venue, (counts.get(record.venue) || 0) + 1));
    return [...counts.entries()].map(([venue, count]) => ({ venue, count })).sort((a, b) => b.count - a.count);
  }

  repertoireConcentration(limit = 5) {
    const plays = this.songPlayCounts();
    const topCount = plays.slice(0, limit).reduce((sum, song) => sum + song.count, 0);
    return this.records.length ? Math.round((topCount / this.records.length) * 1000) / 10 : 0;
  }

  songRotationStatuses() {
    if (!this.records.length) return [];
    const latestDate = this.records.reduce((latest, record) => record.gigDate > latest ? record.gigDate : latest, "");
    const latestTime = Date.parse(`${latestDate}T00:00:00Z`);
    const lastPlayed = new Map();
    this.records.forEach((record) => {
      const key = record.songTitle.toLowerCase();
      const current = lastPlayed.get(key);
      if (!current || record.gigDate > current.lastPlayed) {
        lastPlayed.set(key, { title: record.songTitle, lastPlayed: record.gigDate });
      }
    });

    return [...lastPlayed.values()].map((song) => {
      const daysSinceLastPlayed = Math.round(
        (latestTime - Date.parse(`${song.lastPlayed}T00:00:00Z`)) / 86_400_000,
      );
      const rotationStatus = daysSinceLastPlayed <= 30
        ? "Active"
        : daysSinceLastPlayed <= 90 ? "Cooling Off" : "Stale";
      return { ...song, daysSinceLastPlayed, rotationStatus };
    });
  }

  staleSongs(days = 90) {
    return this.songRotationStatuses()
      .filter((song) => song.daysSinceLastPlayed > days)
      .map(({ title, lastPlayed }) => ({ title, lastPlayed }))
      .sort((a, b) => a.lastPlayed.localeCompare(b.lastPlayed));
  }

  originalsGoalProgress(goal) {
    const original = this.classificationBreakdown().find((item) => item.name === "original");
    return { current: original?.percent || 0, goal, met: (original?.percent || 0) >= goal };
  }
}
