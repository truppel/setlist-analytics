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

  staleSongs(days = 90) {
    if (!this.records.length) return [];
    const latestDate = this.records.reduce((latest, record) => record.gigDate > latest ? record.gigDate : latest, "");
    const cutoff = new Date(`${latestDate}T00:00:00`);
    cutoff.setDate(cutoff.getDate() - days);
    const lastPlayed = new Map();
    this.records.forEach((record) => {
      const current = lastPlayed.get(record.songTitle);
      if (!current || record.gigDate > current) lastPlayed.set(record.songTitle, record.gigDate);
    });
    return [...lastPlayed.entries()]
      .filter(([, date]) => new Date(`${date}T00:00:00`) < cutoff)
      .map(([title, date]) => ({ title, lastPlayed: date }))
      .sort((a, b) => a.lastPlayed.localeCompare(b.lastPlayed));
  }

  originalsGoalProgress(goal) {
    const original = this.classificationBreakdown().find((item) => item.name === "original");
    return { current: original?.percent || 0, goal, met: (original?.percent || 0) >= goal };
  }
}
