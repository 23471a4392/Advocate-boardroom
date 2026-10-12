import { Router } from 'express';
import { SessionController } from '../controllers/sessionController';

const router = Router();

// Persona metadata & catalog
router.get('/personas', SessionController.getPersonas);

// Session lifecycle routes
router.get('/sessions', SessionController.listSessions);
router.post('/session', SessionController.createSession);
router.get('/session/:sessionId', SessionController.getSession);

export { router as boardRouter };
