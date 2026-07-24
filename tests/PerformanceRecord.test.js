import { describe, expect, it } from "vitest";
import { PerformanceRecord } from "../src/models/PerformanceRecord.js";
import { sampleRecords } from "./fixtures.js";

describe("PerformanceRecord", () => {
  it("normalizes text, classification, and numeric values", () => {
    const record = new PerformanceRecord({ ...sampleRecords[0], songTitle: "  Home   Song ", classification: "ORIGINAL", setNumber: "2" });
    expect(record.songTitle).toBe("Home Song");
    expect(record.classification).toBe("original");
    expect(record.setNumber).toBe(2);
  });

  it("uses unknown for a missing or unsupported classification", () => {
    expect(new PerformanceRecord({ ...sampleRecords[0], classification: "traditional" }).classification).toBe("unknown");
  });

  it("keeps optional set and position values null", () => {
    const record = new PerformanceRecord({ ...sampleRecords[0], setNumber: "", position: undefined });
    expect(record.setNumber).toBeNull();
    expect(record.position).toBeNull();
  });

  it("rejects missing required values and impossible calendar dates", () => {
    expect(() => new PerformanceRecord({ ...sampleRecords[0], songTitle: "" })).toThrow(/songTitle/);
    expect(() => new PerformanceRecord({ ...sampleRecords[0], gigDate: "2026-02-31" })).toThrow(/gigDate/);
  });
});
