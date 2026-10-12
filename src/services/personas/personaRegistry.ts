import { Persona } from '../../models/board.types';
import { PERSONA_DEFINITIONS } from './personaPrompts';

export class PersonaRegistry {
  public static getAllIds(): string[] {
    return Object.keys(PERSONA_DEFINITIONS);
  }

  public static getDefinition(id: string) {
    return PERSONA_DEFINITIONS[id] || null;
  }

  public static getAllDefinitions(): Persona[] {
    return Object.values(PERSONA_DEFINITIONS).map((def) => ({
      id: def.id,
      name: def.name,
      role: def.role,
      focusArea: def.focusArea,
      systemPrompt: def.systemPrompt,
      skepticismScore: def.initialSkepticismScore,
      avatar: def.avatar,
      quote: def.quote,
    }));
  }

  public static initializePersonas(selectedIds?: string[]): Record<string, Persona> {
    const activeIds =
      selectedIds && selectedIds.length > 0
        ? selectedIds.filter((id) => id in PERSONA_DEFINITIONS)
        : Object.keys(PERSONA_DEFINITIONS);

    // If none matched, default to all
    const validIds = activeIds.length > 0 ? activeIds : Object.keys(PERSONA_DEFINITIONS);

    const result: Record<string, Persona> = {};
    for (const id of validIds) {
      const def = PERSONA_DEFINITIONS[id];
      result[id] = {
        id: def.id,
        name: def.name,
        role: def.role,
        focusArea: def.focusArea,
        systemPrompt: def.systemPrompt,
        skepticismScore: 75, // Requirement: initial skepticismScore: 75
        avatar: def.avatar,
        quote: def.quote,
      };
    }
    return result;
  }

  public static toList(personasMap: Record<string, Persona>): Persona[] {
    return Object.values(personasMap);
  }
}
