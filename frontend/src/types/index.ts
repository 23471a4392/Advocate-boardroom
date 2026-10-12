export type PersonaId = 'sre' | 'cfo' | 'cso' | 'ux';

export type CritiqueType = 
  | 'fatal_flaw' 
  | 'financial_burn' 
  | 'security_breach' 
  | 'friction' 
  | 'defense' 
  | 'crossfire' 
  | 'verdict';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  title: string;
  specialty: string;
  avatar: string;
  accentColor: string;
  skepticismScore: number; // 0 to 100
  initialSkepticism: number;
  isSpeaking: boolean;
  signatureCatchphrase: string;
  personalityBio: string;
}

export interface HearingMessage {
  id: string;
  speakerId: PersonaId | 'user' | 'system';
  speakerName: string;
  speakerRole: string;
  content: string;
  targetId?: PersonaId | 'user';
  targetName?: string;
  round: number;
  timestamp: string;
  critiqueType?: CritiqueType;
  skepticismDelta?: number;
}

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  category: 'Infrastructure & Tech' | 'Pricing & Monetization' | 'AI & Automation' | 'Go-To-Market';
  keyAssumptions: string[];
  budgetOrRunway?: string;
  timeline?: string;
}

export interface FatalFlaw {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  domain: 'Operations' | 'Finance' | 'Security' | 'Adoption';
  explanation: string;
  failureScenario: string;
}

export interface RecommendedPivot {
  priority: 'Immediate' | 'Phase 2' | 'Defensive Strategy';
  title: string;
  action: string;
  expectedRiskReduction: string;
}

export interface RiskMatrix {
  technical: number; // 0 to 100
  financial: number;
  security: number;
  market: number;
}

export interface PreMortemReport {
  sessionId: string;
  proposalTitle: string;
  survivalScore: number; // 0 to 100%
  executiveVerdict: string;
  fatalFlaws: FatalFlaw[];
  riskMatrix: RiskMatrix;
  recommendedPivots: RecommendedPivot[];
  generatedAt: string;
}

export type SessionStatus = 'idle' | 'in_session' | 'defending' | 'adjourned';
