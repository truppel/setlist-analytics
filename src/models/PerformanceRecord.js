const CLASSIFICATIONS = new Set(["original", "cover", "unknown"]);

function cleanText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function dateOnly(value) {
  const text = cleanText(value);
  const date = new Date(`${text}T00:00:00`);
  return /^\d{4}-\d{2}-\d{2}$/.test(text)
    && !Number.isNaN(date.valueOf())
    && date.toISOString().slice(0, 10) === text
    ? text
    : "";
}

function optionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

export class PerformanceRecord {
  constructor(input) {
    const classification = cleanText(input.classification).toLowerCase();
    this.performanceId = cleanText(input.performanceId);
    this.gigId = cleanText(input.gigId);
    this.gigDate = dateOnly(input.gigDate);
    this.venue = cleanText(input.venue);
    this.city = cleanText(input.city);
    this.songTitle = cleanText(input.songTitle);
    this.songArtist = cleanText(input.songArtist) || "Unknown";
    this.performingArtist = cleanText(input.performingArtist);
    this.classification = CLASSIFICATIONS.has(classification)
      ? classification
      : "unknown";
    this.setNumber = optionalNumber(input.setNumber);
    this.position = optionalNumber(input.position);

    const errors = this.validate();
    if (errors.length) throw new Error(errors.join("; "));
  }

  validate() {
    const required = ["performanceId", "gigId", "gigDate", "venue", "songTitle", "performingArtist"];
    return required.filter((field) => !this[field]).map((field) => `Missing or invalid ${field}`);
  }

  toJSON() {
    return { ...this };
  }

  static from(input) {
    return new PerformanceRecord(input);
  }
}
