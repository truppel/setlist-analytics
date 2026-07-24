export class PerformanceDataSource {
  async loadPerformances() {
    throw new Error("Subclasses must implement loadPerformances()");
  }
}
