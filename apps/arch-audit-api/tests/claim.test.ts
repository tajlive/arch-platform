import { describe, it, expect } from "vitest";
import { PublicAuditDataAccess } from "../src/sessions";

// ── Claim-flow: atomisk + credential-krav ────────────────────
// verifyCredential monkey-patches for å isolere den atomiske ownership-transfer-logikken
// (credential-verifisering er testet separat i sessions.test.ts).

function claimDb(initial: { session: { ownership_mode: string } | null }) {
  const state = {
    ownership_mode: initial.session?.ownership_mode ?? "ANONYMOUS",
    sessionExists: initial.session !== null,
    credentialDeleted: false,
  };
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            run: async () => {
              if (sql.includes("UPDATE audit_sessions")) {
                if (sql.includes("ownership_mode = 'ANONYMOUS'") && state.sessionExists && state.ownership_mode === "ANONYMOUS") {
                  state.ownership_mode = "AUTHENTICATED";
                  return { meta: { changes: 1 } };
                }
                return { meta: { changes: 0 } };
              }
              if (sql.includes("DELETE FROM session_credentials")) {
                state.credentialDeleted = true;
                return { meta: { changes: 1 } };
              }
              return { meta: { changes: 0 } };
            },
            first: async () => {
              if (sql.includes("SELECT ownership_mode")) {
                return state.sessionExists ? { ownership_mode: state.ownership_mode } : null;
              }
              return null;
            },
            all: async () => ({ results: [] }),
          };
        },
      };
    },
  };
  return { db, state };
}

function makeAccess(db: unknown, credentialValid: boolean): PublicAuditDataAccess {
  const access = new PublicAuditDataAccess(db as never);
  // Monkey-patch credential-verifisering (isolér claim-logikken)
  (access as unknown as { verifyCredential: (id: string, c: string) => Promise<boolean> }).verifyCredential =
    async () => credentialValid;
  return access;
}

describe("claimSession — atomisk anonymous→authenticated", () => {
  it("CLAIMED når credential valid og session ANONYMOUS", async () => {
    const { db, state } = claimDb({ session: { ownership_mode: "ANONYMOUS" } });
    const access = makeAccess(db, true);
    const result = await access.claimSession("s1", "cred", "tA", "uA");
    expect(result).toBe("CLAIMED");
    expect(state.ownership_mode).toBe("AUTHENTICATED");
    expect(state.credentialDeleted).toBe(true);
  });

  it("INVALID_CREDENTIAL når credential ikke matcher (login alene er ikke nok)", async () => {
    const { db, state } = claimDb({ session: { ownership_mode: "ANONYMOUS" } });
    const access = makeAccess(db, false);
    expect(await access.claimSession("s1", "wrong", "tA", "uA")).toBe("INVALID_CREDENTIAL");
    // Session skal IKKE endres
    expect(state.ownership_mode).toBe("ANONYMOUS");
  });

  it("ALREADY_CLAIMED når session allerede AUTHENTICATED (race/replay)", async () => {
    const { db } = claimDb({ session: { ownership_mode: "AUTHENTICATED" } });
    const access = makeAccess(db, true);
    expect(await access.claimSession("s1", "cred", "tB", "uB")).toBe("ALREADY_CLAIMED");
  });

  it("NOT_FOUND når session ikke eksisterer", async () => {
    const { db } = claimDb({ session: null });
    const access = makeAccess(db, true);
    expect(await access.claimSession("nonexistent", "cred", "tA", "uA")).toBe("NOT_FOUND");
  });
});
