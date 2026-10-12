export interface Persona {
  id: string;
  name: string;
  role: string;
  focusArea: string;
  systemPrompt: string;
  skepticismScore: number; // 0 to 100, default 75
  avatar: string;
  quote: string;
}

export type DebateRound = 'round_1_opening_salvos' | 'round_2_crossfire' | 'defense_phase' | 'concluded';

export interface BoardMessage {
  id: string;
  sessionId: string;
  round: number; // 1, 2, or defense rounds
  roundName: string;
  speakerId: string;
  targetId?: string;
  content: string;
  skepticismScore: number;
  tensionScore: number;
  timestamp: string;
}

export interface BoardSession {
  sessionId: string;
  proposalTitle: string;
  proposalContent: string;
  selectedPersonas: string[];
  personas: Record<string, Persona>;
  overallTension: number;
  status: 'initialized' | 'debating' | 'defending' | 'concluded';
  currentRound: number;
  createdAt: string;
  updatedAt: string;
}

export interface DefenseEvaluationResult {
  rebuttal: string;
  updatedScores: Record<string, number>;
  skepticismDelta: number;
  targetedPersona: string;
  argumentQuality: 'concrete' | 'defensive' | 'hand_wavy' | 'superficial';
  rationale: string;
}

export interface RiskMatrix {
  technicalRisk: number; // 0 to 100
  financialRisk: number; // 0 to 100
  securityRisk: number; // 0 to 100
  marketRisk: number; // 0 to 100
}

export interface PreMortemReport {
  sessionId: string;
  proposalTitle: string;
  survivalScore: number; // 0 to 100
  fatalFlaws: string[]; // Top 3 critical vulnerabilities
  riskMatrix: RiskMatrix;
  recommendedPivots: string[];
  executiveSummary: string;
  generatedAt: string;
}
