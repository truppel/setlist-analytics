import { afterEach, describe, expect, it, vi } from "vitest";
import { PerformanceDataSource } from "../src/services/PerformanceDataSource.js";
import { PublishedDatasetSource } from "../src/services/PublishedDatasetSource.js";
import { parseCsv } from "../src/utils/csvParser.js";
import { sampleRecords } from "./fixtures.js";

afterEach(() => vi.unstubAllGlobals());

describe("data utilities and sources", () => {
  it("requires data-source subclasses to implement loading", async () => {
    await expect(new PerformanceDataSource().loadPerformances()).rejects.toThrow(/Subclasses/);
  });

  it("parses quoted CSV fields and escaped quotes", () => {
    const rows = parseCsv('songTitle,venue\r\n"Song, Part 1","The ""Room"""');
    expect(rows).toEqual([{ songTitle: "Song, Part 1", venue: 'The "Room"' }]);
  });

  it("loads valid JSON records and reports invalid rows", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([sampleRecords[0], { bad: true }]), { status: 200, headers: { "Content-Type": "application/json" } })));
    const source = new PublishedDatasetSource({ url: "https://example.test/data.json", retryCount: 0 });
    const result = await source.loadPerformances();
    expect(result.records).toHaveLength(1);
    expect(result.invalid).toHaveLength(1);
  });

  it("surfaces a failed request after retries are exhausted", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("error", { status: 503 })));
    const source = new PublishedDatasetSource({ url: "https://example.test/data.json", retryCount: 0 });
    await expect(source.loadPerformances()).rejects.toThrow(/503/);
  });
});
