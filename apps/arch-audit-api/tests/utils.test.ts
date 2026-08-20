import { describe, it, expect } from "vitest";
import { timingSafeEqual, isAllowedOrigin, randomId, sessionCredential } from "../src/utils";

describe("utils", () => {
  it("randomId gir unike verdier av riktig lengde", () => {
    const a = randomId(16);
    const b = randomId(16);
    expect(a).not.toBe(b);
    expect(a.length).toBe(32); // 16 bytes → 32 hex
  });

  it("sessionCredential gir 64 hex (256-bit)", () => {
    const c = sessionCredential();
    expect(c.length).toBe(64);
  });

  it("timingSafeEqual matcher like, avviser ulike", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });

  it("isAllowedOrigin tillater kun eksplisitte origins", () => {
    const allowed = ["https://arch.axn.no"];
    expect(isAllowedOrigin("https://arch.axn.no", allowed)).toBe(true);
    expect(isAllowedOrigin("https://evil.com", allowed)).toBe(false);
    expect(isAllowedOrigin(null, allowed)).toBe(false);
  });
});
