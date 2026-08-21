// packages/osint/runner-manager/spiderfoot-adapter.ts
// SpiderFoot RunnerAdapter - the concrete bridge between the Arch control
// plane and a SpiderFoot instance. It receives a RunnerJobRequest whose spec
// already contains ONLY the policy-approved capability set; this adapter
// resolves those to SpiderFoot modules and talks to the SpiderFoot HTTP API.
//
// SAFETY PROPERTIES:
//  - Executes ONLY the modules derived from approved_capabilities.
//  - Never accepts arbitrary module input from a caller.
//  - Health check must pass before any scan is created.
//  - HTTP client is injected so the adapter is unit-testable without a live
//    SpiderFoot instance.

import type {
  RunnerAdapter,
  RunnerJobRequest,
  RunnerJobResponse,
  RunnerFinding,
  RunnerJobStatus,
} from './runner-contract';
import { resolveSpiderFootModules } from './runner-contract';
import { nowTimestamp } from '../types/core';

// ──────────────────────────────────────────────────────────────
// HTTP client interface (injected - testable, no real network in tests)
// ──────────────────────────────────────────────────────────────

export interface HttpClient {
  get(path: string, query?: Record<string, string>): Promise<{ ok: boolean; json: unknown }>;
  post(path: string, body: Record<string, unknown>): Promise<{ ok: boolean; json: unknown }>;
}

// SpiderFoot REST API surface used by this adapter (subset).
// Scan lifecycle: /scan/create → /scan/status → /scan/results (paginated).
interface SpiderFootScanCreateResponse {
  scanid?: string;
  error?: string;
}

interface SpiderFootScanStatusResponse {
  status?: string; // 'RUNNING' | 'FINISHED' | 'ERROR' | ...
  scanid?: string;
  error?: string;
}

interface SpiderFootScanResultsResponse {
  rows?: Array<{ module: string; type: string; data: Record<string, unknown> }>;
  error?: string;
}

export interface SpiderFootAdapterOptions {
  runnerId: string;
  version: string;
  baseUrl: string; // internal endpoint, e.g. http://spiderfoot-internal:5001
  http: HttpClient;
  /** Capabilities this SpiderFoot instance is configured to support. */
  supportedCapabilities: string[];
}

/**
 * Maps an Arch runner job status onto the control-plane RunnerJobStatus.
 * Unknown/transient SpiderFoot states are treated as 'running'.
 */
function toRunnerStatus(spiderFootStatus: string | undefined): RunnerJobStatus {
  const s = (spiderFootStatus ?? '').toUpperCase();
  if (s.includes('FINISH') || s.includes('COMPLETE')) return 'completed';
  if (s.includes('ERROR') || s.includes('FAIL')) return 'failed';
  if (s.includes('CANCEL') || s.includes('STOP')) return 'cancelled';
  if (s.includes('QUEUE')) return 'queued';
  return 'running';
}

export class SpiderFootAdapter implements RunnerAdapter {
  readonly runner_id: string;
  readonly runner_type = 'spiderfoot' as const;

  constructor(private readonly opts: SpiderFootAdapterOptions) {
    this.runner_id = opts.runnerId;
  }

  async run(request: RunnerJobRequest): Promise<RunnerJobResponse> {
    const { spec } = request;

    // Resolve approved capabilities → SpiderFoot modules. Forbidden and
    // unmapped capabilities are dropped here; we never run an unrelated module.
    const { modules, dropped } = resolveSpiderFootModules(spec.approved_capabilities);

    if (modules.length === 0) {
      return {
        accepted: false,
        error: `No SpiderFoot modules resolvable from approved capabilities${
          dropped.length ? ` (dropped: ${dropped.join(', ')})` : ''
        }`,
      };
    }

    const res = await this.opts.http.post('/scan/create', {
      scanname: `arch-${spec.scan_job_id}`,
      modulelist: modules.join(','),
      target: spec.target.identifier,
      type: 'SCAN',
      usecase: 'all',
    });

    const body = res.json as SpiderFootScanCreateResponse;
    if (!res.ok || !body.scanid) {
      return { accepted: false, error: body.error ?? 'SpiderFoot scan creation failed' };
    }

    return { accepted: true, runner_job_id: body.scanid, estimated_duration_seconds: spec.timeout_seconds };
  }

  async collectFindings(jobId: string): Promise<RunnerFinding[]> {
    // Pull results in a single page for now; production would paginate.
    const res = await this.opts.http.get('/scan/results', { scanid: jobId, page: '0' });
    const body = res.json as SpiderFootScanResultsResponse;

    if (!res.ok || !Array.isArray(body.rows)) return [];

    return body.rows.map(row => ({
      module: row.module,
      type: row.type,
      data: row.data ?? {},
      timestamp: nowTimestamp(),
    }));
  }

  async status(jobId: string): Promise<RunnerJobStatus> {
    const res = await this.opts.http.get('/scan/status', { scanid: jobId });
    const body = res.json as SpiderFootScanStatusResponse;
    return toRunnerStatus(body.status);
  }

  async cancel(jobId: string): Promise<void> {
    await this.opts.http.post('/scan/stop', { scanid: jobId });
  }

  async healthCheck(): Promise<{ healthy: boolean; detail?: string }> {
    try {
      const res = await this.opts.http.get('/ping');
      if (res.ok) return { healthy: true };
      return { healthy: false, detail: 'SpiderFoot /ping returned non-OK' };
    } catch (err) {
      return { healthy: false, detail: err instanceof Error ? err.message : 'unreachable' };
    }
  }
}
