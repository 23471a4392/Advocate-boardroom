import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { defendProposalSchema } from '../schemas/board.schema';
import { dbService } from '../services/db';
import { llmService } from '../services/ai/llmService';
import { AppError } from '../middleware/errorHandler';
import { BoardMessage, BoardSession } from '../models/board.types';

function mapPersonaId(id?: string): string | undefined {
  if (!id) return undefined;
  if (id === 'sre') return 'victor_vance';
  if (id === 'cfo') return 'elena_rostova';
  if (id === 'cso') return 'marcus_chen';
  if (id === 'ux') return 'sasha_morales';
  return id;
}

function unmapPersonaId(id: string): string {
  if (id === 'victor_vance') return 'sre';
  if (id === 'elena_rostova') return 'cfo';
  if (id === 'marcus_chen') return 'cso';
  if (id === 'sasha_morales') return 'ux';
  return id;
}

export class DefenseController {
  /**
   * Helper to fetch current or specified session
   */
  private static resolveSession(req: Request): BoardSession {
    const sessionId = req.params.sessionId || (req.body && req.body.sessionId);
    if (sessionId) {
      const session = dbService.getSession(String(sessionId));
      if (session) return session;
    }

    // Fall back to most recent session
    const sessions = dbService.listSessions(1);
    if (sessions.length > 0) {
      return sessions[0];
    }

    throw new AppError('No active boardroom session found. Please initialize a session first.', 404);
  }

  /**
   * POST /api/board/session/:sessionId/defend AND POST /api/board/defend
   * Evaluates user's defense argument against boardroom skepticism
   */
  public static async defend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = DefenseController.resolveSession(req);

      // Support both userArgument and defenseText (teammate's frontend)
      const rawArgument = req.body.userArgument || req.body.defenseText;
      const rawTarget = req.body.targetPersonaId;

      const validated = defendProposalSchema.parse({
        userArgument: rawArgument,
        targetPersonaId: mapPersonaId(rawTarget),
      });

      // Pick target persona
      let targetPersonaId = validated.targetPersonaId;
      if (!targetPersonaId || !session.personas[targetPersonaId]) {
        const sorted = Object.values(session.personas).sort(
          (a, b) => b.skepticismScore - a.skepticismScore
        );
        targetPersonaId = sorted[0]?.id || Object.keys(session.personas)[0];
      }

      const targetPersona = session.personas[targetPersonaId];
      if (!targetPersona) {
        throw new AppError('No active persona found to evaluate defense.', 400);
      }

      // Evaluate defense
      const evalResult = await llmService.evaluateDefense(
        targetPersona,
        validated.userArgument,
        session.proposalTitle,
        targetPersona.skepticismScore
      );

      // Update persona skepticism score
      const newScore = Math.max(
        5,
        Math.min(100, targetPersona.skepticismScore + evalResult.skepticismDelta)
      );
      targetPersona.skepticismScore = newScore;
      session.personas[targetPersonaId] = targetPersona;

      // Update tension
      const tensionAdjustment = evalResult.skepticismDelta > 0 ? 5 : -7;
      session.overallTension = Math.max(10, Math.min(100, session.overallTension + tensionAdjustment));
      session.currentRound = Math.max(session.currentRound, 3);
      session.status = 'defending';
      session.updatedAt = new Date().toISOString();

      // Persist messages
      const rebuttalMsgId = uuidv4();
      const userMessage: BoardMessage = {
        id: uuidv4(),
        sessionId: session.sessionId,
        round: session.currentRound,
        roundName: 'Defense Argument',
        speakerId: 'user',
        targetId: targetPersonaId,
        content: validated.userArgument,
        skepticismScore: newScore,
        tensionScore: session.overallTension,
        timestamp: new Date().toISOString(),
      };
      dbService.saveMessage(userMessage);

      const rebuttalMessage: BoardMessage = {
        id: rebuttalMsgId,
        sessionId: session.sessionId,
        round: session.currentRound,
        roundName: 'Defense Rebuttal',
        speakerId: targetPersonaId,
        content: evalResult.rebuttal,
        skepticismScore: newScore,
        tensionScore: session.overallTension,
        timestamp: new Date().toISOString(),
      };
      dbService.saveMessage(rebuttalMessage);

      dbService.saveSession(session);

      const updatedScores: Record<string, number> = {};
      Object.entries(session.personas).forEach(([id, p]) => {
        updatedScores[id] = p.skepticismScore;
      });

      const shortTargetId = unmapPersonaId(targetPersonaId);

      res.status(200).json({
        success: true,
        rebuttal: evalResult.rebuttal,
        updatedScores,
        skepticismDelta: evalResult.skepticismDelta,
        targetPersonaId,
        argumentQuality: evalResult.argumentQuality,
        rationale: evalResult.rationale,
        // Teammate frontend compatibility properties:
        rebuttalMessage: {
          id: rebuttalMsgId,
          speakerId: shortTargetId,
          speakerName: targetPersona.name,
          speakerRole: targetPersona.role,
          content: evalResult.rebuttal,
          targetId: 'user',
          targetName: 'Founder',
          round: session.currentRound,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          critiqueType: evalResult.skepticismDelta < 0 ? 'defense' : 'verdict',
          skepticismDelta: evalResult.skepticismDelta,
        },
        updatedPersonas: Object.values(session.personas).map((p) => ({
          id: unmapPersonaId(p.id),
          name: p.name,
          role: p.role,
          title: p.role,
          specialty: p.focusArea,
          avatar: p.avatar,
          accentColor: p.id === 'victor_vance' ? '#38bdf8' : p.id === 'elena_rostova' ? '#f59e0b' : p.id === 'marcus_chen' ? '#ef4444' : '#ec4899',
          skepticismScore: p.skepticismScore,
          initialSkepticism: 75,
          isSpeaking: false,
          signatureCatchphrase: p.quote,
          personalityBio: p.focusArea,
        })),
        overallTensionChange: tensionAdjustment,
        wasEffective: evalResult.skepticismDelta < 0,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/board/round/:roundNum
   * Direct fetch for Round 1 or Round 2 critiques (supporting teammate's frontend)
   */
  public static async getRoundCritiques(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = DefenseController.resolveSession(req);
      const roundNum = Number(req.params.roundNum) || 1;

      // Check existing messages in DB
      let messages = dbService.getMessages(session.sessionId).filter((m) => m.round === roundNum);

      if (messages.length === 0) {
        // Generate on the fly
        const activePersonas = Object.values(session.personas);
        if (roundNum === 1) {
          for (const persona of activePersonas) {
            const salvo = await llmService.getOpeningSalvo(persona, session.proposalTitle, session.proposalContent);
            const msg: BoardMessage = {
              id: uuidv4(),
              sessionId: session.sessionId,
              round: 1,
              roundName: 'Round 1: Opening Salvos',
              speakerId: persona.id,
              content: salvo,
              skepticismScore: persona.skepticismScore,
              tensionScore: session.overallTension,
              timestamp: new Date().toISOString(),
            };
            dbService.saveMessage(msg);
            messages.push(msg);
          }
        } else {
          const pairs = [
            { speakerId: 'elena_rostova', targetId: 'marcus_chen' },
            { speakerId: 'victor_vance', targetId: 'sasha_morales' },
            { speakerId: 'marcus_chen', targetId: 'elena_rostova' },
            { speakerId: 'sasha_morales', targetId: 'victor_vance' },
          ];
          for (const pair of pairs) {
            const speaker = session.personas[pair.speakerId];
            const target = session.personas[pair.targetId];
            if (!speaker || !target) continue;
            const crossfire = await llmService.getCrossfire(speaker, target, session.proposalTitle);
            const msg: BoardMessage = {
              id: uuidv4(),
              sessionId: session.sessionId,
              round: 2,
              roundName: 'Round 2: Crossfire',
              speakerId: speaker.id,
              targetId: target.id,
              content: crossfire,
              skepticismScore: speaker.skepticismScore,
              tensionScore: session.overallTension,
              timestamp: new Date().toISOString(),
            };
            dbService.saveMessage(msg);
            messages.push(msg);
          }
        }
      }

      // Format for frontend HearingMessage
      const formatted = messages.map((m) => {
        const persona = session.personas[m.speakerId];
        const target = m.targetId ? session.personas[m.targetId] : null;
        return {
          id: m.id,
          speakerId: unmapPersonaId(m.speakerId),
          speakerName: persona?.name || m.speakerId,
          speakerRole: persona?.role || 'Board Member',
          content: m.content,
          targetId: target ? unmapPersonaId(target.id) : undefined,
          targetName: target ? target.name : undefined,
          round: m.round,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          critiqueType: roundNum === 2 ? 'crossfire' : 'fatal_flaw',
          skepticismDelta: 5,
        };
      });

      res.status(200).json(formatted);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/board/session/:sessionId/pre-mortem AND POST /api/board/pre-mortem AND GET /api/board/pre-mortem
   * Synthesizes boardroom hearing into structured Executive Pre-Mortem Report
   */
  public static async preMortem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = DefenseController.resolveSession(req);
      const report = await llmService.generatePreMortem(session);

      dbService.savePreMortem(report);
      session.status = 'concluded';
      session.updatedAt = new Date().toISOString();
      dbService.saveSession(session);

      // Return unified response satisfying Prompt 1.3 AND teammate frontend
      res.status(200).json({
        success: true,
        sessionId: report.sessionId,
        proposalTitle: report.proposalTitle,
        survivalScore: report.survivalScore,
        fatalFlaws: report.fatalFlaws,
        riskMatrix: {
          technicalRisk: report.riskMatrix.technicalRisk,
          financialRisk: report.riskMatrix.financialRisk,
          securityRisk: report.riskMatrix.securityRisk,
          marketRisk: report.riskMatrix.marketRisk,
          // Support frontend camelCase property names
          technical: report.riskMatrix.technicalRisk,
          financial: report.riskMatrix.financialRisk,
          security: report.riskMatrix.securityRisk,
          market: report.riskMatrix.marketRisk,
        },
        recommendedPivots: report.recommendedPivots,
        executiveSummary: report.executiveSummary,
        executiveVerdict: report.executiveSummary,
        generatedAt: report.generatedAt,
      });
    } catch (err) {
      next(err);
    }
  }
}
