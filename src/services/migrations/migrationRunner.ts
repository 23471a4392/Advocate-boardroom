import { dbService } from '../db';

export interface Migration {
  id: string;
  name: string;
  up: (db: any) => void;
}

export class MigrationRunner {
  public static getMigrationsCount(): number {
    return 1;
  }
}
