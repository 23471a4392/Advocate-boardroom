import { Request, Response, NextFunction } from 'express';
import { DebateEngine, SseClientHandler } from '../services/debate/debateEngine';
import { dbService } from '../services/db';

export class StreamController {
  /**
   * GET /api/board/session/:sessionId/stream
   * Initiates Server-Sent Events (SSE) streaming for boardroom debate
   */
  public static async streamDebate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const sessionId = String(req.params.sessionId);
    const session = dbService.getSession(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        error: `Session "${sessionId}" not found.`,
      });
      return;
    }

    // Configure headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let clientDisconnected = false;

    // Disconnect listener for cleanup
    req.on('close', () => {
      clientDisconnected = true;
      console.log(`[SSE] Client connection closed for session: ${sessionId}`);
    });

    const handler: SseClientHandler = {
      sendEvent: (event: string, data: any) => {
        if (!clientDisconnected) {
          res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        }
      },
      isAborted: () => clientDisconnected,
    };

    // Send initial handshake event
    handler.sendEvent('connected', {
      sessionId,
      status: 'Debate stream initialized',
      timestamp: new Date().toISOString(),
    });

    try {
      await DebateEngine.orchestrateDebate(sessionId, handler);
    } catch (err: any) {
      if (!clientDisconnected) {
        handler.sendEvent('error', {
          message: err?.message || 'Internal debate streaming error',
        });
      }
    } finally {
      if (!clientDisconnected) {
        res.end();
      }
    }
  }
}
