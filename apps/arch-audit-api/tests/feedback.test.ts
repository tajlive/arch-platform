// feedback.test.ts — enhetstest for analyst feedback-logging
import { describe, it, expect, vi } from "vitest";
import { validateFeedback, storeFeedback, getFeedbackSummary, randomFeedbackId } from "../src/feedback";

describe("validateFeedback", () => {
  it("godkjenner gyldig feedback", () => {
    expect(validateFeedback({ org_number: "951001880", focus_area: "salg", finding_type: "strength", finding_index: 0, feedback: "correct" }).ok).toBe(true);
    expect(validateFeedback({ org_number: "951001880", focus_area: "drift", finding_type: "priority", finding_index: 2, feedback: "missing_context" }).ok).toBe(true);
  });

  it("avviser ugyldig feedback-verdi", () => {
    expect(validateFeedback({ org_number: "951001880", focus_area: "salg", finding_type: "strength", finding_index: 0, feedback: "nonsense" as any }).error).toBe("INVALID_FEEDBACK");
  });

  it("avviser ugyldig finding_type", () => {
    expect(validateFeedback({ org_number: "951001880", focus_area: "salg", finding_type: "junk" as any, finding_index: 0, feedback: "correct" }).error).toBe("INVALID_FINDING_TYPE");
  });

  it("avviser manglende org_number / negativ index", () => {
    expect(validateFeedback({ org_number: "", focus_area: "salg", finding_type: "strength", finding_index: 0, feedback: "correct" }).ok).toBe(false);
    expect(validateFeedback({ org_number: "951001880", focus_area: "salg", finding_type: "strength", finding_index: -1, feedback: "correct" }).ok).toBe(false);
  });
});

describe("storeFeedback", () => {
  it("setter inn rad i D1 (append-only)", async () => {
    const run = vi.fn().mockResolvedValue({ success: true });
    const prepare = vi.fn().mockReturnValue({ bind: vi.fn().mockReturnValue({ run }) });
    const db = { prepare } as any;

    const result = await storeFeedback(db, {
      org_number: "951001880",
      focus_area: "salg",
      finding_type: "strength",
      finding_index: 0,
      feedback: "correct",
      comment: "bra",
    });
    expect(result.ok).toBe(true);
    expect(result.feedback_id).toBeTruthy();
    expect(prepare).toHaveBeenCalledTimes(1);
    expect(prepare.mock.calls[0][0]).toContain("INSERT INTO analyst_feedback");
  });

  it("returnerer DB_ERROR ved databasfeil", async () => {
    const run = vi.fn().mockRejectedValue(new Error("db down"));
    const prepare = vi.fn().mockReturnValue({ bind: vi.fn().mockReturnValue({ run }) });
    const db = { prepare } as any;

    const result = await storeFeedback(db, {
      org_number: "951001880",
      focus_area: "salg",
      finding_type: "weakness",
      finding_index: 1,
      feedback: "irrelevant",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("DB_ERROR");
  });
});

describe("getFeedbackSummary", () => {
  it("aggregerer tellinger per feedback-type og finding-type", async () => {
    const totalFirst = vi.fn().mockResolvedValue({ c: 5 });
    const allGrouped = vi.fn().mockResolvedValue({
      results: [
        { feedback: "correct", c: 3 },
        { feedback: "useful", c: 1 },
        { feedback: "irrelevant", c: 1 },
      ],
    });
    const allTypes = vi.fn().mockResolvedValue({
      results: [
        { finding_type: "strength", c: 2 },
        { finding_type: "priority", c: 3 },
      ],
    });
    const allAreas = vi.fn().mockResolvedValue({
      results: [{ focus_area: "salg", c: 5 }],
    });
    const prepare = vi.fn()
      .mockReturnValueOnce({ bind: vi.fn().mockReturnValue({ first: totalFirst }) })
      .mockReturnValueOnce({ bind: vi.fn().mockReturnValue({ all: allGrouped }) })
      .mockReturnValueOnce({ bind: vi.fn().mockReturnValue({ all: allTypes }) })
      .mockReturnValueOnce({ bind: vi.fn().mockReturnValue({ all: allAreas }) });
    const db = { prepare } as any;

    const summary = await getFeedbackSummary(db);
    expect(summary.total).toBe(5);
    expect(summary.by_feedback.correct).toBe(3);
    expect(summary.by_feedback.useful).toBe(1);
    expect(summary.by_finding_type.strength).toBe(2);
    expect(summary.by_finding_type.priority).toBe(3);
    expect(summary.by_focus_area).toEqual([{ focus_area: "salg", count: 5 }]);
  });
});

describe("randomFeedbackId", () => {
  it("produserer unike id-er", () => {
    expect(randomFeedbackId()).not.toBe(randomFeedbackId());
  });
});
