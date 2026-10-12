import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { env } from '../../config/env';
import { Persona, BoardSession, DefenseEvaluationResult, PreMortemReport } from '../../models/board.types';
import { MockProvider } from './mockProvider';

export class LlmService {
  private geminiClient: GoogleGenAI | null = null;
  private openaiClient: OpenAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '') {
      try {
        this.geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
      } catch (err) {
        console.warn('⚠️ Could not initialize Gemini SDK. Using Mock Provider fallback.', err);
      }
    }

    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim() !== '') {
      try {
        this.openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      } catch (err) {
        console.warn('⚠️ Could not initialize OpenAI SDK. Using Mock Provider fallback.', err);
      }
    }
  }

  public hasRealLlmConfigured(): boolean {
    return Boolean(this.geminiClient || this.openaiClient);
  }

  /**
   * Generates opening salvo for a persona
   */
  public async getOpeningSalvo(
    persona: Persona,
    proposalTitle: string,
    proposalContent: string
  ): Promise<string> {
    if (this.geminiClient) {
      try {
        const prompt = `${persona.systemPrompt}\n\nThe user has submitted the following pitch/architecture proposal:\nTitle: "${proposalTitle}"\nContent: "${proposalContent}"\n\nDeliver your 2-3 sentence opening salvo attack targeting your specific domain. Be ruthlessly cynical, direct, and devastating.`;
        const response = await this.geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const text = response.text?.trim();
        if (text) return text;
      } catch (err) {
        console.warn(`[LLM] Gemini generation failed for ${persona.id}, falling back to MockProvider:`, (err as any).message);
      }
    }

    if (this.openaiClient) {
      try {
        const res = await this.openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: persona.systemPrompt },
            {
              role: 'user',
              content: `Proposal: "${proposalTitle}"\nContent: "${proposalContent}"\nDeliver your 2-3 sentence opening salvo attack.`,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        });
        const text = res.choices[0]?.message?.content?.trim();
        if (text) return text;
      } catch (err) {
        console.warn(`[LLM] OpenAI generation failed for ${persona.id}, falling back to MockProvider:`, (err as any).message);
      }
    }

    return MockProvider.generateOpeningSalvo(persona, proposalTitle, proposalContent);
  }

  /**
   * Generates crossfire clash between two personas
   */
  public async getCrossfire(
    speaker: Persona,
    target: Persona,
    proposalTitle: string
  ): Promise<string> {
    if (this.geminiClient) {
      try {
        const prompt = `${speaker.systemPrompt}\n\nYou are in a heated boardroom debate regarding "${proposalTitle}". Attack your fellow board member, ${target.name} (${target.role}), for their short-sighted demands in their domain. Keep it to 2-3 devastating sentences.`;
        const response = await this.geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const text = response.text?.trim();
        if (text) return text;
      } catch (err) {
        console.warn(`[LLM] Gemini crossfire failed, falling back to mock:`, (err as any).message);
      }
    }

    if (this.openaiClient) {
      try {
        const res = await this.openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: speaker.systemPrompt },
            {
              role: 'user',
              content: `Proposal: "${proposalTitle}". Cross-examine and clash with ${target.name} (${target.role}) in 2-3 sharp sentences.`,
            },
          ],
          temperature: 0.85,
          max_tokens: 200,
        });
        const text = res.choices[0]?.message?.content?.trim();
        if (text) return text;
      } catch (err) {
        console.warn(`[LLM] OpenAI crossfire failed, falling back to mock:`, (err as any).message);
      }
    }

    return MockProvider.generateCrossfire(speaker, target, proposalTitle);
  }

  /**
   * Evaluates user defense
   */
  public async evaluateDefense(
    persona: Persona,
    userArgument: string,
    proposalTitle: string,
    currentScore: number
  ): Promise<DefenseEvaluationResult> {
    // If real LLM is available, we can also evaluate with LLM or blend with mock heuristics
    if (this.geminiClient || this.openaiClient) {
      try {
        const prompt = `Evaluate this defense argument for proposal "${proposalTitle}":
Persona: ${persona.name} (${persona.role})
User Argument: "${userArgument}"

Respond strictly in JSON with format:
{
  "isConcrete": boolean,
  "skepticismDelta": number (if isConcrete: between -25 and -10; if hand-wavy/defensive: between +10 and +20),
  "rebuttal": "2-3 cynical sentences responding to the user",
  "rationale": "one sentence explanation"
}`;

        let jsonText = '';
        if (this.geminiClient) {
          const res = await this.geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          jsonText = res.text || '';
        } else if (this.openaiClient) {
          const res = await this.openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          });
          jsonText = res.choices[0]?.message?.content || '';
        }

        const cleaned = jsonText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const delta = Number(parsed.skepticismDelta) || (parsed.isConcrete ? -15 : +15);
        const newScore = Math.max(5, Math.min(100, currentScore + delta));

        return {
          rebuttal: parsed.rebuttal,
          updatedScores: { [persona.id]: newScore },
          skepticismDelta: delta,
          targetedPersona: persona.id,
          argumentQuality: parsed.isConcrete ? 'concrete' : 'hand_wavy',
          rationale: parsed.rationale || 'Evaluated via AI board review',
        };
      } catch (err) {
        console.warn('[LLM] Defense evaluation error, using MockProvider fallback:', (err as any).message);
      }
    }

    return MockProvider.evaluateDefense(persona, userArgument, proposalTitle, currentScore);
  }

  /**
   * Generates Pre-Mortem report
   */
  public async generatePreMortem(session: BoardSession): Promise<PreMortemReport> {
    if (this.geminiClient || this.openaiClient) {
      try {
        const prompt = `Synthesize a comprehensive Boardroom Pre-Mortem report for the following pitch:
Title: "${session.proposalTitle}"
Content: "${session.proposalContent}"
Persona Skepticism Scores: ${JSON.stringify(
          Object.fromEntries(Object.entries(session.personas).map(([k, v]) => [v.name, v.skepticismScore]))
        )}

Return strictly JSON with:
{
  "survivalScore": number (0 to 100),
  "fatalFlaws": [string, string, string],
  "riskMatrix": {
    "technicalRisk": number (0-100),
    "financialRisk": number (0-100),
    "securityRisk": number (0-100),
    "marketRisk": number (0-100)
  },
  "recommendedPivots": [string, string, string, string],
  "executiveSummary": string
}`;

        let jsonText = '';
        if (this.geminiClient) {
          const res = await this.geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          jsonText = res.text || '';
        } else if (this.openaiClient) {
          const res = await this.openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          });
          jsonText = res.choices[0]?.message?.content || '';
        }

        const cleaned = jsonText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          sessionId: session.sessionId,
          proposalTitle: session.proposalTitle,
          survivalScore: parsed.survivalScore ?? 42,
          fatalFlaws: parsed.fatalFlaws ?? [],
          riskMatrix: parsed.riskMatrix ?? { technicalRisk: 75, financialRisk: 75, securityRisk: 75, marketRisk: 75 },
          recommendedPivots: parsed.recommendedPivots ?? [],
          executiveSummary: parsed.executiveSummary ?? '',
          generatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('[LLM] Pre-mortem generation error, using MockProvider fallback:', (err as any).message);
      }
    }

    return MockProvider.generatePreMortem(session);
  }
}

export const llmService = new LlmService();
