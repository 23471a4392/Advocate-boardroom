import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { boardRouter } from './routes/boardRoutes';

const app: Application = express();

// Security and standard middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// Serve static frontend assets if public folder exists
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// System health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ContraBoard (Devil\'s Advocate Boardroom API)',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// OpenAPI Spec endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../docs/openapi.yaml'));
});

// Boardroom API routes
app.use('/api/board', boardRouter);

// Global Error Handler
app.use(errorHandler);

export { app };
