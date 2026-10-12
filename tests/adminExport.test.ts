import { describe, it, expect } from 'vitest';
import { DbExportService } from '../src/services/dbExport';

describe('Database Export Service', () => {
  it('should export audit dump with timestamp', () => {
    const dump = DbExportService.exportAuditDump();
    expect(dump).toHaveProperty('exportedAt');
    expect(dump).toHaveProperty('sessionCount');
  });
});
