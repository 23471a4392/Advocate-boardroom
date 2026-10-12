import type { HearingMessage, Persona, PreMortemReport, Proposal } from '../types';
import { MockBoardroomEngine } from './mockBoardroomEngine';

// CONFIGURATION: Set to false when your teammate connects the Node.js / FastAPI backend!
export const USE_MOCK_ENGINE = true;
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let activeEngine: MockBoardroomEngine | null = null;

export const boardApi = {
  // 1. Initialize a new hearing session
  initSession: async (proposal: Proposal, personas: Persona[]): Promise<{ sessionId: string }> => {
    if (USE_MOCK_ENGINE) {
      activeEngine = new MockBoardroomEngine(proposal, personas);
      return { sessionId: `session-${Date.now()}` };
    }

    const res = await fetch(`${API_BASE_URL}/board/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal, personas })
    });
    return res.json();
  },

  // 2. Fetch Round 1 Opening Critiques
  getRound1Critiques: async (): Promise<HearingMessage[]> => {
    if (USE_MOCK_ENGINE && activeEngine) {
      await new Promise(r => setTimeout(r, 600));
      return activeEngine.generateRound1Critiques();
    }

    const res = await fetch(`${API_BASE_URL}/board/round/1`);
    return res.json();
  },

  // 3. Fetch Round 2 Crossfire Critiques
  getRound2Crossfire: async (): Promise<HearingMessage[]> => {
    if (USE_MOCK_ENGINE && activeEngine) {
      await new Promise(r => setTimeout(r, 700));
      return activeEngine.generateRound2Crossfire();
    }

    const res = await fetch(`${API_BASE_URL}/board/round/2`);
    return res.json();
  },

  // 4. Submit defense in the Hot Seat
  submitDefense: async (
    defenseText: string,
    targetPersonaId?: Persona['id']
  ): Promise<{
    rebuttalMessage: HearingMessage;
    updatedPersonas: Persona[];
    overallTensionChange: number;
    wasEffective: boolean;
  }> => {
    if (USE_MOCK_ENGINE && activeEngine) {
      await new Promise(r => setTimeout(r, 800));
      return activeEngine.evaluateDefense(defenseText, targetPersonaId);
    }

    const res = await fetch(`${API_BASE_URL}/board/defend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defenseText, targetPersonaId })
    });
    return res.json();
  },

  // 5. Generate Pre-Mortem Report
  generatePreMortem: async (): Promise<PreMortemReport> => {
    if (USE_MOCK_ENGINE && activeEngine) {
      await new Promise(r => setTimeout(r, 900));
      return activeEngine.generatePreMortemReport();
    }

    const res = await fetch(`${API_BASE_URL}/board/pre-mortem`);
    return res.json();
  }
};
