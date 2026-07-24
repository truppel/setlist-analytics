import { PerformanceDataSource } from "./PerformanceDataSource.js";
import { PerformanceRecord } from "../models/PerformanceRecord.js";
import { parseCsv } from "../utils/csvParser.js";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class PublishedDatasetSource extends PerformanceDataSource {
  constructor({ url, timeoutMs = 10000, retryCount = 2 }) {
    super();
    this.url = url;
    this.timeoutMs = timeoutMs;
    this.retryCount = retryCount;
  }

  async loadPerformances() {
    let lastError;
    for (let attempt = 0; attempt <= this.retryCount; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await fetch(this.url, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error(`Dataset request failed (${response.status})`);
        const contentType = response.headers.get("content-type") || "";
        const raw = contentType.includes("json") || this.url.endsWith(".json")
          ? await response.json()
          : parseCsv(await response.text());
        const items = Array.isArray(raw) ? raw : raw.records;
        if (!Array.isArray(items)) throw new Error("Dataset must contain an array of records");
        const valid = [];
        const invalid = [];
        items.forEach((item, index) => {
          try { valid.push(PerformanceRecord.from(item)); }
          catch (error) { invalid.push({ index, message: error.message }); }
        });
        if (!valid.length && items.length) throw new Error("No valid performance records were found");
        return { records: valid, invalid };
      } catch (error) {
        lastError = error;
        if (attempt < this.retryCount && error.name !== "AbortError") await wait(500 * 2 ** attempt);
      } finally { clearTimeout(timer); }
    }
    throw lastError;
  }
}

export class XcitementSheetSource extends PublishedDatasetSource {}
