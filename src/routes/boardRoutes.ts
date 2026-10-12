import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';
import { StreamController } from '../controllers/streamController';

const router = Router();

// Persona metadata & catalog
router.get('/personas', SessionController.getPersonas);

// Session lifecycle routes
router.get('/sessions', SessionController.listSessions);
router.post('/session', SessionController.createSession);
router.get('/session/:sessionId', SessionController.getSession);

// Debate Orchestration SSE stream
router.get('/session/:sessionId/stream', StreamController.streamDebate);

export { router as boardRouter };
