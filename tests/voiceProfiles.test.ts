import { describe, it, expect } from 'vitest';
import { VOICE_PROFILES } from '../src/services/personas/voiceProfiles';

describe('Persona Voice Profiles', () => {
  it('should have voice profiles configured for all 4 default personas', () => {
    expect(Object.keys(VOICE_PROFILES)).toHaveLength(4);
    expect(VOICE_PROFILES.victor_vance.cadenceWordsPerMinute).toBe(135);
  });
});
