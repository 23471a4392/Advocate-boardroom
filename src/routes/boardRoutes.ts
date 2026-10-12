import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';
import { StreamController } from '../controllers/streamController';
import { DefenseController } from '../controllers/defenseController';

const router = Router();

// Persona metadata & catalog
router.get('/personas', SessionController.getPersonas);

// Session lifecycle routes
router.get('/sessions', SessionController.listSessions);
router.post('/session', SessionController.createSession);
router.get('/session/:sessionId', SessionController.getSession);

// Debate Orchestration SSE stream (Prompt 1.2)
router.get('/session/:sessionId/stream', StreamController.streamDebate);

// Defense Evaluation & Executive Pre-Mortem (Prompt 1.3)
router.post('/session/:sessionId/defend', DefenseController.defend);
router.post('/session/:sessionId/pre-mortem', DefenseController.preMortem);

// Teammate frontend direct routes
router.get('/round/:roundNum', DefenseController.getRoundCritiques);
router.post('/defend', DefenseController.defend);
router.get('/pre-mortem', DefenseController.preMortem);
router.post('/pre-mortem', DefenseController.preMortem);

export { router as boardRouter };
