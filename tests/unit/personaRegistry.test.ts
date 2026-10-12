import { describe, it, expect } from 'vitest';
import { PersonaRegistry } from '../../src/services/personas/personaRegistry';

describe('Unit: PersonaRegistry Edge Cases', () => {
  it('should fallback to all default personas if unknown IDs are passed', () => {
    const personas = PersonaRegistry.initializePersonas(['unknown_persona_999']);
    expect(Object.keys(personas)).toHaveLength(4);
  });

  it('should initialize each persona with skepticismScore 75', () => {
    const personas = PersonaRegistry.initializePersonas();
    Object.values(personas).forEach((p) => {
      expect(p.skepticismScore).toBe(75);
    });
  });
});
