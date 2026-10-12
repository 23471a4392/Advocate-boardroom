import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createSessionSchema } from '../schemas/board.schema';
import { PersonaRegistry } from '../services/personas/personaRegistry';
import { dbService } from '../services/db';
import { BoardSession } from '../models/board.types';
import { AppError } from '../middleware/errorHandler';

export class SessionController {
  /**
   * GET /api/board/personas
   * Returns metadata and cynical background for all available board members
   */
  public static async getPersonas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const personas = PersonaRegistry.getAllDefinitions();
      res.status(200).json({
        success: true,
        count: personas.length,
        personas,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/board/session
   * Initializes a new Devil's Advocate Boardroom hearing
   */
  public static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bodyToParse = req.body.proposal
        ? {
            proposalTitle: req.body.proposal.title,
            proposalContent:
              req.body.proposal.summary ||
              (req.body.proposal.keyAssumptions
                ? req.body.proposal.keyAssumptions.join('. ')
                : 'Enterprise Proposal Architecture'),
            selectedPersonas: Array.isArray(req.body.personas)
              ? req.body.personas.map((p: any) =>
                  p.id === 'sre'
                    ? 'victor_vance'
                    : p.id === 'cfo'
                    ? 'elena_rostova'
                    : p.id === 'cso'
                    ? 'marcus_chen'
                    : p.id === 'ux'
                    ? 'sasha_morales'
                    : p.id
                )
              : undefined,
          }
        : req.body;

      const validated = createSessionSchema.parse(bodyToParse);
      const sessionId = uuidv4();
      const now = new Date().toISOString();

      const personasMap = PersonaRegistry.initializePersonas(validated.selectedPersonas);
      const selectedPersonas = Object.keys(personasMap);

      const session: BoardSession = {
        sessionId,
        proposalTitle: validated.proposalTitle,
        proposalContent: validated.proposalContent,
        selectedPersonas,
        personas: personasMap,
        overallTension: 65,
        status: 'initialized',
        currentRound: 0,
        createdAt: now,
        updatedAt: now,
      };

      // Persist to SQLite
      dbService.saveSession(session);

      const personasList = PersonaRegistry.toList(personasMap);

      res.status(201).json({
        success: true,
        sessionId,
        proposalTitle: session.proposalTitle,
        proposalContent: session.proposalContent,
        personas: personasList,
        overallTension: session.overallTension,
        createdAt: session.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/board/session/:sessionId
   * Returns current session details, tension level, and full critique transcript
   */
  public static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = String(req.params.sessionId);
      const session = dbService.getSession(sessionId);

      if (!session) {
        throw new AppError(`Boardroom session "${sessionId}" not found`, 404);
      }

      const messages = dbService.getMessages(sessionId);
      const preMortem = dbService.getPreMortem(sessionId);

      res.status(200).json({
        success: true,
        session: {
          ...session,
          personas: PersonaRegistry.toList(session.personas),
        },
        messages,
        preMortem,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/board/sessions
   * Lists recently convened boardroom hearings
   */
  public static async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = dbService.listSessions(15);
      res.status(200).json({
        success: true,
        count: sessions.length,
        sessions: sessions.map((s) => ({
          sessionId: s.sessionId,
          proposalTitle: s.proposalTitle,
          overallTension: s.overallTension,
          status: s.status,
          currentRound: s.currentRound,
          updatedAt: s.updatedAt,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
}
