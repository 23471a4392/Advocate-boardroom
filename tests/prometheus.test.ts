import { describe, it, expect } from 'vitest';
import { PrometheusExporter } from '../src/services/telemetry/prometheusExporter';

describe('Prometheus Exporter', () => {
  it('should format metrics in Prometheus exposition text format', () => {
    const metrics = PrometheusExporter.getMetrics();
    expect(metrics).toContain('contraboard_http_requests_total');
    expect(metrics).toContain('process_resident_memory_bytes');
  });
});
