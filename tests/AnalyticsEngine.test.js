import { describe, expect, it } from "vitest";
import { AnalyticsEngine } from "../src/analytics/AnalyticsEngine.js";
import { PerformanceDataset } from "../src/models/PerformanceDataset.js";
import { sampleRecords } from "./fixtures.js";

describe("AnalyticsEngine", () => {
  const records = new PerformanceDataset(sampleRecords).records;
  const analytics = new AnalyticsEngine(records);

  it("calculates dashboard summary and ranked song counts", () => {
    expect(analytics.summary()).toEqual({ concerts: 3, performances: 4, songs: 3 });
    expect(analytics.songPlayCounts()[0]).toMatchObject({ title: "Home Song", count: 2 });
  });

  it("keeps original, cover, and unknown percentages separate", () => {
    expect(analytics.classificationBreakdown()).toEqual([
      { name: "original", count: 2, percent: 50 },
      { name: "cover", count: 1, percent: 25 },
      { name: "unknown", count: 1, percent: 25 },
    ]);
  });

  it("calculates monthly trends, venue totals, and concentration", () => {
    expect(analytics.performancesByMonth()).toEqual([
      { month: "2026-01", count: 2 }, { month: "2026-03", count: 1 }, { month: "2026-05", count: 1 },
    ]);
    expect(analytics.venueCounts()).toEqual([{ venue: "Alpha", count: 2 }, { venue: "Beta", count: 2 }]);
    expect(analytics.repertoireConcentration(1)).toBe(50);
  });

  it("evaluates goal progress and stale songs relative to the latest gig", () => {
    expect(analytics.originalsGoalProgress(40)).toEqual({ current: 50, goal: 40, met: true });
    expect(analytics.staleSongs(60).map((song) => song.title)).toEqual(["Cover Song", "Home Song"]);
  });

  it("classifies exact 30-day and 90-day rotation boundaries relative to the latest gig", () => {
    const boundaryAnalytics = new AnalyticsEngine([
      { songTitle: "Latest", gigDate: "2026-04-01" },
      { songTitle: "Thirty Days", gigDate: "2026-03-02" },
      { songTitle: "Ninety Days", gigDate: "2026-01-01" },
      { songTitle: "Ninety One Days", gigDate: "2025-12-31" },
    ]);

    expect(boundaryAnalytics.songRotationStatuses()).toEqual([
      { title: "Latest", lastPlayed: "2026-04-01", daysSinceLastPlayed: 0, rotationStatus: "Active" },
      { title: "Thirty Days", lastPlayed: "2026-03-02", daysSinceLastPlayed: 30, rotationStatus: "Active" },
      { title: "Ninety Days", lastPlayed: "2026-01-01", daysSinceLastPlayed: 90, rotationStatus: "Cooling Off" },
      { title: "Ninety One Days", lastPlayed: "2025-12-31", daysSinceLastPlayed: 91, rotationStatus: "Stale" },
    ]);
    expect(boundaryAnalytics.staleSongs(90).map((song) => song.title)).toEqual(["Ninety One Days"]);
  });
});
