import crypto from 'crypto';

export class EtagHelper {
  public static generateEtag(payload: any): string {
    const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = crypto.createHash('md5').update(str).digest('hex').slice(0, 16);
    return `W/"${hash}"`;
  }
}
