import { beforeEach, describe, expect, it, vi } from "vitest";
import { StorageService } from "../src/services/StorageService.js";

function fakeStorage() {
  const values = new Map();
  return { getItem: vi.fn((key) => values.get(key) ?? null), setItem: vi.fn((key, value) => values.set(key, value)) };
}

describe("StorageService", () => {
  beforeEach(() => { vi.stubGlobal("localStorage", fakeStorage()); });

  it("saves and restores versioned application state", () => {
    const storage = new StorageService("test", 1);
    storage.save({ records: [], filters: { classification: "cover" }, settings: { originalsGoalPercent: 20 } });
    expect(storage.load()).toMatchObject({ version: 1, filters: { classification: "cover" } });
  });

  it("rejects corrupt data and schema version mismatches", () => {
    const storage = new StorageService("test", 2);
    localStorage.setItem("test", "not json");
    expect(storage.load()).toBeNull();
    localStorage.setItem("test", JSON.stringify({ version: 1 }));
    expect(storage.load()).toBeNull();
  });

  it("applies a TTL to saved timestamps", () => {
    const storage = new StorageService("test", 1);
    expect(storage.isFresh(new Date(Date.now() - 500).toISOString(), 1000)).toBe(true);
    expect(storage.isFresh(new Date(Date.now() - 1500).toISOString(), 1000)).toBe(false);
  });
});
