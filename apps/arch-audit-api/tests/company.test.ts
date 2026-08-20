import { describe, expect, it } from "vitest";
import { CompanyService } from "../src/company";

const company = {
  company_name: "Sorgardsveien 11 Rune Sorgard",
  industry_name: "Utleie av egen eller leid fast eiendom"
} as never;

describe("CompanyService - forste kartleggingssporsmal", () => {
  it("tilpasser sporsmalet til valgt fokusomrade", async () => {
    const service = new CompanyService({} as never);

    await expect(service.firstQuestion(company, "Administrasjon")).resolves.toMatchObject({
      question: "For Sorgardsveien 11 Rune Sorgard: Hvilken administrativ oppgave tar mest tid i en vanlig uke?",
      target_unknown: "highest_effort_administrative_task",
      required_for: "IDENTIFY_PROCESS"
    });
  });

  it("bruker et nøytralt standardsporsmal uten automasjonsantakelse", async () => {
    const service = new CompanyService({} as never);

    await expect(service.firstQuestion(company)).resolves.toMatchObject({
      question: "For Sorgardsveien 11 Rune Sorgard: Hvor kommer flest nye kundehenvendelser inn i dag?",
      target_unknown: "primary_customer_inbound_channel"
    });
  });
});
