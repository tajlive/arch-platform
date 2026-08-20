// sessions.ts — anonymous audit session data access + security

import type { D1Database } from "@cloudflare/workers-types";
import { AuditSessionRow, AuditSessionStatus, AuditScope } from "./types";
import { randomId, sessionCredential } from "./utils";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 timer for anonym session

export interface CreateSessionInput {
  scope?: AuditScope;
  company_context_id?: string | null;
}

export interface CreatedSession {
  sessionId: string;
  credential: string; // NEVER returned to client after creation; stored in HttpOnly cookie
}

/**
 * PublicAuditDataAccess — for ANONYMOUS sessions (no tenant scope).
 * Deliberately separate from TenantDataAccess to avoid auth-spaghetti.
 */
export class PublicAuditDataAccess {
  constructor(private db: D1Database) {}

  async createSession(input: CreateSessionInput = {}): Promise<CreatedSession & { expires_at: string }> {
    const sessionId = randomId(16);
    const credential = sessionCredential();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

    await this.db
      .prepare(
        `INSERT INTO audit_sessions
          (id, scope, ownership_mode, tenant_id, user_id, company_context_id, status, free_boundary_reached, created_at, updated_at, expires_at)
         VALUES (?, ?, 'ANONYMOUS', NULL, NULL, ?, 'ACTIVE', 0, ?, ?, ?)`
      )
      .bind(
        sessionId,
        input.scope ?? "FREE",
        input.company_context_id ?? null,
        now.toISOString(),
        now.toISOString(),
        expiresAt.toISOString()
      )
      .run();

    // Store the credential separately (server-side). We keep it in a dedicated
    // table so the session ID alone is never sufficient authorization.
    await this.db
      .prepare(`INSERT INTO session_credentials (session_id, credential_hash, created_at) VALUES (?, ?, ?)`)
      .bind(sessionId, await this.hashCredential(credential), now.toISOString())
      .run();

    return { sessionId, credential, expires_at: expiresAt.toISOString() };
  }

  async getSession(sessionId: string): Promise<AuditSessionRow | null> {
    const row = await this.db
      .prepare(`SELECT * FROM audit_sessions WHERE id = ?`)
      .bind(sessionId)
      .first<AuditSessionRow>();
    return row ?? null;
  }

  async verifyCredential(sessionId: string, credential: string): Promise<boolean> {
    const row = await this.db
      .prepare(`SELECT credential_hash FROM session_credentials WHERE session_id = ?`)
      .bind(sessionId)
      .first<{ credential_hash: string }>();
    if (!row) return false;
    return (await this.hashCredential(credential)) === row.credential_hash;
  }

  async isExpired(session: AuditSessionRow): Promise<boolean> {
    return new Date(session.expires_at).getTime() < Date.now();
  }

  async addQuestion(sessionId: string, q: {
    question: string;
    reason: string;
    target_unknown: string;
    expected_information_gain: number;
    required_for: string;
    related_process?: string | null;
    related_finding?: string | null;
  }): Promise<string> {
    const id = randomId(16);
    await this.db
      .prepare(
        `INSERT INTO question_decisions
          (id, audit_session_id, question, reason, target_unknown, expected_information_gain, required_for, related_process, related_finding, asked_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        sessionId,
        q.question,
        q.reason,
        q.target_unknown,
        q.expected_information_gain,
        q.required_for,
        q.related_process ?? null,
        q.related_finding ?? null,
        new Date().toISOString()
      )
      .run();
    return id;
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE audit_sessions SET updated_at = ? WHERE id = ?`)
      .bind(new Date().toISOString(), sessionId)
      .run();
  }

  private async hashCredential(credential: string): Promise<string> {
    const data = new TextEncoder().encode(`arch-session:${credential}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
}
