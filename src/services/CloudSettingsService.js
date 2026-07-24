export class CloudSettingsService {
  constructor({ binId, accessKey }) {
    this.binId = binId;
    this.accessKey = accessKey;
  }

  get configured() { return Boolean(this.binId && this.accessKey); }

  headers() {
    return { "Content-Type": "application/json", "X-Access-Key": this.accessKey };
  }

  async load() {
    if (!this.configured) throw new Error("JSONBin is not configured");
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, { headers: this.headers() });
    if (!response.ok) throw new Error(`JSONBin read failed (${response.status})`);
    return (await response.json()).record;
  }

  async save(localValue) {
    if (!this.configured) throw new Error("JSONBin is not configured");
    let remoteValue = null;
    try { remoteValue = await this.load(); } catch { /* A write can still succeed. */ }
    const winner = remoteValue?.updatedAt > localValue.updatedAt ? remoteValue : localValue;
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify(winner),
    });
    if (!response.ok) throw new Error(`JSONBin write failed (${response.status})`);
    return winner;
  }
}
