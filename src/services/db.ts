import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { BoardSession, BoardMessage, PreMortemReport } from '../models/board.types';

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const isTest = env.NODE_ENV === 'test';
    const dbPath = isTest ? ':memory:' : env.DB_PATH;

    if (!isTest && dbPath !== ':memory:') {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initTables();
  }

  private initTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        proposal_title TEXT NOT NULL,
        proposal_content TEXT NOT NULL,
        selected_personas TEXT NOT NULL,
        personas_state TEXT NOT NULL,
        overall_tension REAL NOT NULL DEFAULT 65.0,
        status TEXT NOT NULL DEFAULT 'initialized',
        current_round INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        round INTEGER NOT NULL,
        round_name TEXT NOT NULL,
        speaker_id TEXT NOT NULL,
        target_id TEXT,
        content TEXT NOT NULL,
        skepticism_score REAL NOT NULL,
        tension_score REAL NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS pre_mortems (
        session_id TEXT PRIMARY KEY,
        proposal_title TEXT NOT NULL,
        survival_score REAL NOT NULL,
        fatal_flaws TEXT NOT NULL,
        risk_matrix TEXT NOT NULL,
        recommended_pivots TEXT NOT NULL,
        executive_summary TEXT NOT NULL,
        generated_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    `);
  }

  public saveSession(session: BoardSession): void {
    const stmt = this.db.prepare(`
      INSERT INTO sessions (
        session_id, proposal_title, proposal_content, selected_personas,
        personas_state, overall_tension, status, current_round, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        personas_state = excluded.personas_state,
        overall_tension = excluded.overall_tension,
        status = excluded.status,
        current_round = excluded.current_round,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      session.sessionId,
      session.proposalTitle,
      session.proposalContent,
      JSON.stringify(session.selectedPersonas),
      JSON.stringify(session.personas),
      session.overallTension,
      session.status,
      session.currentRound,
      session.createdAt,
      session.updatedAt
    );
  }

  public getSession(sessionId: string): BoardSession | null {
    const stmt = this.db.prepare(`SELECT * FROM sessions WHERE session_id = ?`);
    const row = stmt.get(sessionId) as any;
    if (!row) return null;

    return {
      sessionId: row.session_id,
      proposalTitle: row.proposal_title,
      proposalContent: row.proposal_content,
      selectedPersonas: JSON.parse(row.selected_personas),
      personas: JSON.parse(row.personas_state),
      overallTension: row.overall_tension,
      status: row.status,
      currentRound: row.current_round,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public saveMessage(message: BoardMessage): void {
    const stmt = this.db.prepare(`
      INSERT INTO messages (
        id, session_id, round, round_name, speaker_id, target_id,
        content, skepticism_score, tension_score, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      message.id,
      message.sessionId,
      message.round,
      message.roundName,
      message.speakerId,
      message.targetId || null,
      message.content,
      message.skepticismScore,
      message.tensionScore,
      message.timestamp
    );
  }

  public getMessages(sessionId: string): BoardMessage[] {
    const stmt = this.db.prepare(`
      SELECT * FROM messages WHERE session_id = ? ORDER BY rowid ASC
    `);
    const rows = stmt.all(sessionId) as any[];

    return rows.map((r) => ({
      id: r.id,
      sessionId: r.session_id,
      round: r.round,
      roundName: r.round_name,
      speakerId: r.speaker_id,
      targetId: r.target_id || undefined,
      content: r.content,
      skepticismScore: r.skepticism_score,
      tensionScore: r.tension_score,
      timestamp: r.timestamp,
    }));
  }

  public savePreMortem(report: PreMortemReport): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO pre_mortems (
        session_id, proposal_title, survival_score, fatal_flaws,
        risk_matrix, recommended_pivots, executive_summary, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      report.sessionId,
      report.proposalTitle,
      report.survivalScore,
      JSON.stringify(report.fatalFlaws),
      JSON.stringify(report.riskMatrix),
      JSON.stringify(report.recommendedPivots),
      report.executiveSummary,
      report.generatedAt
    );
  }

  public getPreMortem(sessionId: string): PreMortemReport | null {
    const stmt = this.db.prepare(`SELECT * FROM pre_mortems WHERE session_id = ?`);
    const row = stmt.get(sessionId) as any;
    if (!row) return null;

    return {
      sessionId: row.session_id,
      proposalTitle: row.proposal_title,
      survivalScore: row.survival_score,
      fatalFlaws: JSON.parse(row.fatal_flaws),
      riskMatrix: JSON.parse(row.risk_matrix),
      recommendedPivots: JSON.parse(row.recommended_pivots),
      executiveSummary: row.executive_summary,
      generatedAt: row.generated_at,
    };
  }

  public listSessions(limit = 20): BoardSession[] {
    const stmt = this.db.prepare(`SELECT * FROM sessions ORDER BY updated_at DESC LIMIT ?`);
    const rows = stmt.all(limit) as any[];
    return rows.map((row) => ({
      sessionId: row.session_id,
      proposalTitle: row.proposal_title,
      proposalContent: row.proposal_content,
      selectedPersonas: JSON.parse(row.selected_personas),
      personas: JSON.parse(row.personas_state),
      overallTension: row.overall_tension,
      status: row.status,
      currentRound: row.current_round,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  public close(): void {
    this.db.close();
  }
}

export const dbService = new DatabaseService();
