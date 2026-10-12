import { Request, Response, NextFunction } from 'express';

export function compressionHeaderHint(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Vary', 'Accept-Encoding');
  next();
}
