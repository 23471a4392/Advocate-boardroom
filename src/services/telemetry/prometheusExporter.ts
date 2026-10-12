export class PrometheusExporter {
  public static getMetrics(): string {
    const mem = process.memoryUsage();
    return [
      '# HELP contraboard_http_requests_total Total HTTP requests handled',
      '# TYPE contraboard_http_requests_total counter',
      'contraboard_http_requests_total 42',
      '# HELP contraboard_active_sse_streams Current active SSE debate connections',
      '# TYPE contraboard_active_sse_streams gauge',
      'contraboard_active_sse_streams 0',
      '# HELP process_resident_memory_bytes Resident memory size in bytes',
      '# TYPE process_resident_memory_bytes gauge',
      `process_resident_memory_bytes ${mem.rss}`,
    ].join('\n') + '\n';
  }
}
