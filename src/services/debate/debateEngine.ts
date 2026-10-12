import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BoardSession, BoardMessage, Persona } from '../../models/board.types';
import { dbService } from '../db';
import { llmService } from '../ai/llmService';

export interface SseClientHandler {
  sendEvent: (event: string, data: any) => void;
  isAborted: () => boolean;
}

export class DebateEngine {
  private static activeSessions = new Set<string>();

  /**
   * Helper to sleep asynchronously
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Stream text tokens with a natural human-like cadence
   */
  private static async streamTokens(
    text: string,
    handler: SseClientHandler,
    tokenDelayMs: number = 22
  ): Promise<boolean> {
    // Break into tokens (words with trailing spaces/punctuation)
    const tokens = text.match(/\S+\s*/g) || [text];

    for (const token of tokens) {
      if (handler.isAborted()) {
        return false;
      }
      handler.sendEvent('persona_token', { token });
      await this.sleep(tokenDelayMs);
    }

    return true;
  }

  /**
   * Orchestrates the multi-turn boardroom hearing:
   * Round 1: Opening Salvos (each persona attacks user's proposal)
   * Round 2: Crossfire (personas clash and cross-examine each other)
   */
  public static async orchestrateDebate(
    sessionId: string,
    handler: SseClientHandler
  ): Promise<void> {
    if (this.activeSessions.has(sessionId)) {
      handler.sendEvent('error', {
        message: 'A debate stream is already active for this session.',
      });
      return;
    }

    this.activeSessions.add(sessionId);

    try {
      const session = dbService.getSession(sessionId);
      if (!session) {
        handler.sendEvent('error', { message: `Session ${sessionId} not found.` });
        return;
      }

      const activePersonas = Object.values(session.personas);
      if (activePersonas.length === 0) {
        handler.sendEvent('error', { message: 'No active personas found in session.' });
        return;
      }

      handler.sendEvent('board_convened', {
        sessionId,
        proposalTitle: session.proposalTitle,
        personaCount: activePersonas.length,
        timestamp: new Date().toISOString(),
      });

      let currentTension = session.overallTension || 65;

      // ==========================================
      // ROUND 1: OPENING SALVOS
      // ==========================================
      handler.sendEvent('round_started', {
        round: 1,
        roundName: 'Round 1: Opening Salvos',
        description: 'Each board persona delivers a devastating domain-specific critique.',
      });

      for (let i = 0; i < activePersonas.length; i++) {
        if (handler.isAborted()) break;

        const persona = activePersonas[i];
        const messageId = uuidv4();

        handler.sendEvent('persona_started', {
          speakerId: persona.id,
          speakerName: persona.name,
          speakerRole: persona.role,
          round: 1,
        });

        // Generate opening salvo
        const salvoText = await llmService.getOpeningSalvo(
          persona,
          session.proposalTitle,
          session.proposalContent
        );

        const completed = await this.streamTokens(salvoText, handler, 25);
        if (!completed) break;

        // Increase tension and maintain skepticism
        currentTension = Math.min(95, currentTension + 3.5);
        const skepticismScore = persona.skepticismScore;

        const messageRecord: BoardMessage = {
          id: messageId,
          sessionId,
          round: 1,
          roundName: 'Round 1: Opening Salvos',
          speakerId: persona.id,
          content: salvoText,
          skepticismScore,
          tensionScore: Math.round(currentTension),
          timestamp: new Date().toISOString(),
        };

        dbService.saveMessage(messageRecord);

        handler.sendEvent('persona_finished', {
          messageId,
          speakerId: persona.id,
          content: salvoText,
          targetId: null,
          skepticismScore,
        });

        handler.sendEvent('tension_update', {
          overallTension: Math.round(currentTension),
        });

        await this.sleep(400); // Realistic boardroom beat between speakers
      }

      if (handler.isAborted()) return;

      // Inter-round intermission
      await this.sleep(600);
      handler.sendEvent('round_transition', {
        round: 2,
        roundName: 'Round 2: Crossfire',
        description: 'Board members clash with conflicting domain priorities.',
      });

      // ==========================================
      // ROUND 2: CROSSFIRE
      // ==========================================
      // Define crossfire clash pairs
      const crossfirePairs: Array<{ speakerId: string; targetId: string }> = [
        { speakerId: 'elena_rostova', targetId: 'marcus_chen' },
        { speakerId: 'victor_vance', targetId: 'sasha_morales' },
        { speakerId: 'marcus_chen', targetId: 'elena_rostova' },
        { speakerId: 'sasha_morales', targetId: 'victor_vance' },
      ];

      for (const pair of crossfirePairs) {
        if (handler.isAborted()) break;

        const speaker = session.personas[pair.speakerId];
        const target = session.personas[pair.targetId];

        if (!speaker || !target) continue;

        const messageId = uuidv4();

        handler.sendEvent('persona_started', {
          speakerId: speaker.id,
          speakerName: speaker.name,
          speakerRole: speaker.role,
          targetId: target.id,
          targetName: target.name,
          round: 2,
        });

        const crossfireText = await llmService.getCrossfire(
          speaker,
          target,
          session.proposalTitle
        );

        const completed = await this.streamTokens(crossfireText, handler, 22);
        if (!completed) break;

        // Tension escalates during crossfire
        currentTension = Math.min(98, currentTension + 3.0);
        const skepticismScore = speaker.skepticismScore;

        const messageRecord: BoardMessage = {
          id: messageId,
          sessionId,
          round: 2,
          roundName: 'Round 2: Crossfire',
          speakerId: speaker.id,
          targetId: target.id,
          content: crossfireText,
          skepticismScore,
          tensionScore: Math.round(currentTension),
          timestamp: new Date().toISOString(),
        };

        dbService.saveMessage(messageRecord);

        handler.sendEvent('persona_finished', {
          messageId,
          speakerId: speaker.id,
          targetId: target.id,
          content: crossfireText,
          skepticismScore,
        });

        handler.sendEvent('tension_update', {
          overallTension: Math.round(currentTension),
        });

        await this.sleep(450);
      }

      if (handler.isAborted()) return;

      // Update session state in DB
      session.overallTension = Math.round(currentTension);
      session.status = 'defending';
      session.currentRound = 2;
      session.updatedAt = new Date().toISOString();
      dbService.saveSession(session);

      handler.sendEvent('debate_concluded', {
        sessionId,
        currentRound: 2,
        overallTension: session.overallTension,
        nextStep: 'Mount your defense via POST /api/board/session/:sessionId/defend or request Pre-Mortem.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(`[DebateEngine] Error in session ${sessionId}:`, err);
      if (!handler.isAborted()) {
        handler.sendEvent('error', {
          message: err?.message || 'Unexpected debate orchestration failure.',
        });
      }
    } finally {
      this.activeSessions.delete(sessionId);
    }
  }
}
