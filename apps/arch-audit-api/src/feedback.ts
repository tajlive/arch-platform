// feedback.ts — Analyst Feedback-logging (produktflyt-steg 7)
//
// Append-only logging av brukerfeedback på ArchAnalyst-funn.
// REGEL: kun logging. Ingen auto-læring fra enkelttilbakemeldinger (systemprompt-Forbud).
// Aggregering eksponeres read-only for evals-grunnlag.

import type { D1Database } from "@cloudflare/workers-types";

export type FeedbackValue = "correct" | "useful" | "irrelevant" | "missing_context";
export type FindingType = "strength" | "weakness" | "priority" | "unknown";

export interface FeedbackInput {
  org_number: string;
  focus_area: string;
  analyst_run_id?: string;
  finding_type: FindingType;
  finding_index: number;
  feedback: FeedbackValue;
  comment?: string;
}

export interface FeedbackResult {
  ok: boolean;
  feedback_id?: string;
  error?: "INVALID_FEEDBACK" | "INVALID_FINDING_TYPE" | "DB_ERROR";
}

const VALID_FEEDBACK: ReadonlySet<string> = new Set(["correct", "useful", "irrelevant", "missing_context"]);
const VALID_FINDING_TYPES: ReadonlySet<string> = new Set(["strength", "weakness", "priority", "unknown"]);

export function validateFeedback(input: Partial<FeedbackInput>): FeedbackResult {
  if (!input.org_number || input.org_number.trim().length < 2) {
    return { ok: false, error: "INVALID_FEEDBACK" };
  }
  if (!input.focus_area || input.focus_area.trim().length < 1) {
    return { ok: false, error: "INVALID_FEEDBACK" };
  }
  if (!input.feedback || !VALID_FEEDBACK.has(input.feedback)) {
    return { ok: false, error: "INVALID_FEEDBACK" };
  }
  if (!input.finding_type || !VALID_FINDING_TYPES.has(input.finding_type)) {
    return { ok: false, error: "INVALID_FINDING_TYPE" };
  }
  if (typeof input.finding_index !== "number" || input.finding_index < 0 || !Number.isInteger(input.finding_index)) {
    return { ok: false, error: "INVALID_FEEDBACK" };
  }
  return { ok: true };
}

export function randomFeedbackId(): string {
  return crypto.randomUUID();
}

/** Append-only innsetting — ingen UPDATE/DELETE noe sted i kodebasen. */
export async function storeFeedback(db: D1Database, input: FeedbackInput): Promise<FeedbackResult> {
  const validation = validateFeedback(input);
  if (!validation.ok) return validation;

  const id = randomFeedbackId();
  const createdAt = new Date().toISOString();
  try {
    await db
      .prepare(
        `INSERT INTO analyst_feedback (id, created_at, org_number, focus_area, analyst_run_id, finding_type, finding_index, feedback, comment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        createdAt,
        input.org_number.trim(),
        input.focus_area.trim(),
        input.analyst_run_id ?? null,
        input.finding_type,
        input.finding_index,
        input.feedback,
        input.comment?.trim() || null
      )
      .run();
    return { ok: true, feedback_id: id };
  } catch {
    return { ok: false, error: "DB_ERROR" };
  }
}

export interface FeedbackSummary {
  total: number;
  by_feedback: Record<FeedbackValue, number>;
  by_finding_type: Record<FindingType, number>;
  by_focus_area: Array<{ focus_area: string; count: number }>;
}

/** Aggregert, read-only sammendrag — aldri rå PII, aldri individuelle rader. */
export async function getFeedbackSummary(db: D1Database, orgNumber?: string): Promise<FeedbackSummary> {
  const empty: FeedbackSummary = {
    total: 0,
    by_feedback: { correct: 0, useful: 0, irrelevant: 0, missing_context: 0 },
    by_finding_type: { strength: 0, weakness: 0, priority: 0, unknown: 0 },
    by_focus_area: [],
  };

  try {
    const where = orgNumber ? "WHERE org_number = ?" : "";
    const params = orgNumber ? [orgNumber] : [];

    const totalRow = await db
      .prepare(`SELECT COUNT(*) AS c FROM analyst_feedback ${where}`)
      .bind(...params)
      .first<{ c: number }>();
    empty.total = totalRow?.c ?? 0;

    const byFeedback = await db
      .prepare(`SELECT feedback, COUNT(*) AS c FROM analyst_feedback ${where} GROUP BY feedback`)
      .bind(...params)
      .all<{ feedback: string; c: number }>();
    for (const row of byFeedback.results ?? []) {
      if (row.feedback in empty.by_feedback) {
        empty.by_feedback[row.feedback as FeedbackValue] = row.c;
      }
    }

    const byType = await db
      .prepare(`SELECT finding_type, COUNT(*) AS c FROM analyst_feedback ${where} GROUP BY finding_type`)
      .bind(...params)
      .all<{ finding_type: string; c: number }>();
    for (const row of byType.results ?? []) {
      if (row.finding_type in empty.by_finding_type) {
        empty.by_finding_type[row.finding_type as FindingType] = row.c;
      }
    }

    const byArea = await db
      .prepare(`SELECT focus_area, COUNT(*) AS c FROM analyst_feedback ${where} GROUP BY focus_area ORDER BY c DESC LIMIT 20`)
      .bind(...params)
      .all<{ focus_area: string; c: number }>();
    empty.by_focus_area = (byArea.results ?? []).map((r) => ({ focus_area: r.focus_area, count: r.c }));

    return empty;
  } catch {
    return empty;
  }
}
