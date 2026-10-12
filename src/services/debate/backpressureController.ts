export class BackpressureController {
  private queue: string[] = [];
  private maxQueueSize: number;

  constructor(maxSize = 250) {
    this.maxQueueSize = maxSize;
  }

  public enqueue(token: string): boolean {
    if (this.queue.length >= this.maxQueueSize) return false;
    this.queue.push(token);
    return true;
  }

  public dequeue(): string | undefined {
    return this.queue.shift();
  }

  public get size(): number {
    return this.queue.length;
  }
}
