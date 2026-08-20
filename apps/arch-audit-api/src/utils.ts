// utils.ts — crypto, logging, error handling helpers

import { HttpError } from "./types";

// ── Cryptographically random IDs ────────────────────────────

export function randomId(bytes: number = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function sessionCredential(): string {
  // 256-bit secret — separate from the public session ID.
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Constant-time comparison ────────────────────────────────

export function timingSafeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

// ── Structured logging ──────────────────────────────────────

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  request_id: string;
  trace_id: string;
  route: string;
  method: string;
  status?: number;
  latency_ms?: number;
  error_code?: string;
  [k: string]: unknown;
}

export function log(entry: LogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.log(line);
}

// ── Request context ─────────────────────────────────────────

export function requestId(): string {
  return randomId(12);
}

// ── Origin validation (CSRF/abuse defense) ─────────────────

export function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  if (!origin) return false;
  return allowed.some((o) => origin === o);
}

// ── Error helpers ───────────────────────────────────────────

export function badRequest(code: string, message: string): HttpError {
  return new HttpError(400, code, message);
}
export function unauthorized(code: string, message: string): HttpError {
  return new HttpError(401, code, message);
}
export function forbidden(code: string, message: string): HttpError {
  return new HttpError(403, code, message);
}
export function notFound(code: string, message: string): HttpError {
  return new HttpError(404, code, message);
}
export function tooMany(code: string, message: string): HttpError {
  return new HttpError(429, code, message);
}
