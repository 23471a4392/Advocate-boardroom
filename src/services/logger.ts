export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

export class Logger {
  public static log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify(entry));
    }
  }

  public static info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  public static warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  public static error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }
}
