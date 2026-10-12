import { describe, it, expect } from 'vitest';
import { PITCH_TEMPLATES } from '../src/fixtures/pitchTemplates';

describe('Pitch Templates Catalog', () => {
  it('should include enterprise templates across core sectors', () => {
    expect(PITCH_TEMPLATES).toHaveLength(3);
    expect(PITCH_TEMPLATES[0].category).toBe('FinTech');
  });
});
