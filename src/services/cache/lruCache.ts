export class LruCache<T> {
  private cache = new Map<string, T>();
  private capacity: number;

  constructor(capacity = 100) {
    this.capacity = capacity;
  }

  public get(key: string): T | undefined {
    if (!this.cache.has(key)) return undefined;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  public set(key: string, val: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, val);
  }

  public get size(): number {
    return this.cache.size;
  }
}
