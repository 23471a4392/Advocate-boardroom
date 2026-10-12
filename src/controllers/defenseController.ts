import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { defendProposalSchema } from '../schemas/board.schema';
import { dbService } from '../services/db';
import { llmService } from '../services/ai/llmService';
import { AppError } from '../middleware/errorHandler';
import { BoardMessage } from '../models/board.types';

export class DefenseController {
  /**
   * POST /api/board/session/:sessionId/defend
   * Evaluates user's defense argument against boardroom skepticism
   */
  public static async defend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = String(req.params.sessionId);
      const validated = defendProposalSchema.parse(req.body);

      const session = dbService.getSession(sessionId);
      if (!session) {
        throw new AppError(`Session "${sessionId}" not found.`, 404);
      }

      // Pick target persona: specified ID or most skeptical board member
      let targetPersonaId = validated.targetPersonaId;
      if (!targetPersonaId || !session.personas[targetPersonaId]) {
        // Pick persona with the highest skepticism
        const sorted = Object.values(session.personas).sort(
          (a, b) => b.skepticismScore - a.skepticismScore
        );
        targetPersonaId = sorted[0]?.id || Object.keys(session.personas)[0];
      }

      const targetPersona = session.personas[targetPersonaId];
      if (!targetPersona) {
        throw new AppError(`No active persona found to evaluate defense.`, 400);
      }

      // Evaluate the user's defense
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

      // Update overall tension
      const tensionAdjustment = evalResult.skepticismDelta > 0 ? 5 : -7;
      session.overallTension = Math.max(10, Math.min(100, session.overallTension + tensionAdjustment));
      session.currentRound = Math.max(session.currentRound, 3);
      session.status = 'defending';
      session.updatedAt = new Date().toISOString();

      // Persist user argument as message
      const userMsgId = uuidv4();
      const userMessage: BoardMessage = {
        id: userMsgId,
        sessionId,
        round: session.currentRound,
        roundName: 'Defense Argument',
        speakerId: 'user_pitcher',
        targetId: targetPersonaId,
        content: validated.userArgument,
        skepticismScore: newScore,
        tensionScore: session.overallTension,
        timestamp: new Date().toISOString(),
      };
      dbService.saveMessage(userMessage);

      // Persist persona rebuttal as message
      const rebuttalMsgId = uuidv4();
      const rebuttalMessage: BoardMessage = {
        id: rebuttalMsgId,
        sessionId,
        round: session.currentRound,
        roundName: 'Defense Rebuttal',
        speakerId: targetPersonaId,
        content: evalResult.rebuttal,
        skepticismScore: newScore,
        tensionScore: session.overallTension,
        timestamp: new Date().toISOString(),
      };
      dbService.saveMessage(rebuttalMessage);

      // Save updated session state
      dbService.saveSession(session);

      // Return updated scores dictionary
      const updatedScores: Record<string, number> = {};
      Object.entries(session.personas).forEach(([id, p]) => {
        updatedScores[id] = p.skepticismScore;
      });

      res.status(200).json({
        success: true,
        rebuttal: evalResult.rebuttal,
        updatedScores,
        skepticismDelta: evalResult.skepticismDelta,
        targetPersonaId,
        argumentQuality: evalResult.argumentQuality,
        rationale: evalResult.rationale,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/board/session/:sessionId/pre-mortem
   * Synthesizes boardroom hearing into structured Executive Pre-Mortem Report
   */
  public static async preMortem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = String(req.params.sessionId);
      const session = dbService.getSession(sessionId);

      if (!session) {
        throw new AppError(`Session "${sessionId}" not found.`, 404);
      }

      // Generate structured Pre-Mortem report
      const report = await llmService.generatePreMortem(session);

      // Persist to database
      dbService.savePreMortem(report);

      // Conclude session
      session.status = 'concluded';
      session.updatedAt = new Date().toISOString();
      dbService.saveSession(session);

      // Return exact required schema:
      // { survivalScore, fatalFlaws, riskMatrix, recommendedPivots, executiveSummary }
      res.status(200).json({
        success: true,
        survivalScore: report.survivalScore,
        fatalFlaws: report.fatalFlaws,
        riskMatrix: report.riskMatrix,
        recommendedPivots: report.recommendedPivots,
        executiveSummary: report.executiveSummary,
      });
    } catch (err) {
      next(err);
    }
  }
}
