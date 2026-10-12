import { Request, Response, NextFunction } from 'express';

function sanitizeValue(val: any): any {
  if (typeof val === 'string') {
    return val.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '').trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object') {
    const res: Record<string, any> = {};
    for (const k of Object.keys(val)) {
      res[k] = sanitizeValue(val[k]);
    }
    return res;
  }
  return val;
}

export function payloadSanitizer(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  next();
}
