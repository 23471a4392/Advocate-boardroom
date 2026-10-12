export interface VoiceProfile {
  personaId: string;
  formalityIndex: number;
  sarcasmIndex: number;
  cadenceWordsPerMinute: number;
}

export const VOICE_PROFILES: Record<string, VoiceProfile> = {
  victor_vance: { personaId: 'victor_vance', formalityIndex: 0.9, sarcasmIndex: 0.7, cadenceWordsPerMinute: 135 },
  elena_rostova: { personaId: 'elena_rostova', formalityIndex: 0.95, sarcasmIndex: 0.85, cadenceWordsPerMinute: 140 },
  marcus_chen: { personaId: 'marcus_chen', formalityIndex: 0.85, sarcasmIndex: 0.6, cadenceWordsPerMinute: 125 },
  sasha_morales: { personaId: 'sasha_morales', formalityIndex: 0.75, sarcasmIndex: 0.8, cadenceWordsPerMinute: 150 },
};
