import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

interface ClientRecord {
  count: number;
  resetTime: number;
}

const clientRequests = new Map<string, ClientRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = env.RATE_LIMIT_MAX_REQUESTS;

  let record = clientRequests.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    clientRequests.set(ip, record);
    next();
    return;
  }

  record.count++;

  if (record.count > maxRequests) {
    const retrySec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retrySec);
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: `Boardroom rate limit exceeded. Please wait ${retrySec}s before sending additional requests.`,
    });
    return;
  }

  next();
}
