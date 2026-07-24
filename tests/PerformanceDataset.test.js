import { describe, expect, it } from "vitest";
import { PerformanceDataset } from "../src/models/PerformanceDataset.js";
import { sampleRecords } from "./fixtures.js";

const allFilters = { classification: "all", venue: "all", song: "", startDate: "", endDate: "" };

describe("PerformanceDataset", () => {
  const dataset = new PerformanceDataset(sampleRecords);

  it("combines classification, venue, song, and date filters", () => {
    const filtered = dataset.filter({ ...allFilters, classification: "original", venue: "Beta", song: "home", startDate: "2026-02-01", endDate: "2026-04-01" });
    expect(filtered.records.map((record) => record.performanceId)).toEqual(["p3"]);
  });

  it("sorts without changing original record order", () => {
    const sorted = dataset.sortByDate("desc");
    expect(sorted[0].performanceId).toBe("p4");
    expect(dataset.records[0].performanceId).toBe("p1");
  });

  it("returns sorted unique field values", () => {
    expect(dataset.unique("venue")).toEqual(["Alpha", "Beta"]);
  });
});
