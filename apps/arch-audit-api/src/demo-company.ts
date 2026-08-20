// demo-company.ts — SYNTHETIC demo-firma «Nordic Service AS»
// Merket eksplisitt som SYNTHETIC DEMO. Aldri blandet med ekte data.

export interface DemoSignal {
  signal_type: string;
  description: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  evidence_reference: string;   // syntetisk kilde-referanse
}

export interface DemoCompany {
  company_id: string;
  org_number: string;      // syntetisk, ikke ekte org.nr
  name: string;
  industry_code: string;
  industry_name: string;
  employees: number;
  website: string;
  municipality: string;
  disclaimer: "SYNTHETIC DEMO";
  signals: DemoSignal[];
  potential_areas: string[];
  uncertainty: string[];
}

export const NORDIC_SERVICE_DEMO: DemoCompany = {
  company_id: "demo-nordic-service",
  org_number: "999999999",  // SYNTHETIC — ikke et ekte org.nr
  name: "Nordic Service AS",
  industry_code: "43.210",
  industry_name: "Elektrisk installasjonsarbeid",
  employees: 24,
  website: "demo.nordicservice.example",
  municipality: "Trondheim",
  disclaimer: "SYNTHETIC DEMO",
  signals: [
    {
      signal_type: "HIRING",
      description: "3 aktive stillingsannonser for kundeservice/ordrebehandling siste 30 dager",
      confidence: "MEDIUM",
      evidence_reference: "synthetic:nav-stillinger:3",
    },
    {
      signal_type: "CUSTOMER_FACING",
      description: "Nettside har kontakttelefon + epost, men ingen digital booking eller selvbetjening",
      confidence: "HIGH",
      evidence_reference: "synthetic:website:no-booking",
    },
    {
      signal_type: "GROWTH",
      description: "Vekst i antall ansatte fra 18 til 24 siste 24 måneder",
      confidence: "MEDIUM",
      evidence_reference: "synthetic:brreg:ansatte-vekst",
    },
    {
      signal_type: "DIGITAL_MATURITY",
      description: "Ingen detekterbar ERP/CRM-integrasjon på offentlig nettside",
      confidence: "LOW",
      evidence_reference: "synthetic:website:no-crm-signal",
    },
    {
      signal_type: "OPERATIONAL",
      description: "Manuell ordrebehandling — signal fra stillingsannonser («registrere ordre», «oppdatere Excel»)",
      confidence: "MEDIUM",
      evidence_reference: "synthetic:nav-arbeidsoppgaver",
    },
  ],
  potential_areas: [
    "Customer operations",
    "Order administration",
    "Reporting / documentation",
  ],
  uncertainty: [
    "Faktisk tidsbruk på manuell ordrebehandling (krever kundesvar)",
    "Eksisterende systemer (ERP/CRM) — ikke synlig offentlig",
    "Volum av kundehenvendelser",
  ],
};

// Demo-flyt: public signals → AI reasoning → questions → findings → upgrade boundary
export interface DemoStep {
  step: string;
  content: string;
}

export const NORDIC_SERVICE_FLOW: DemoStep[] = [
  { step: "PUBLIC_SIGNALS", content: "Fant 5 signaler: hiring, customer-facing, growth, digital maturity, operational." },
  { step: "AI_REASONING", content: "3 stillingsannonser for kundeservice + ingen digital booking → mulig høy manuell kundehåndtering. INSUFFICIENT EVIDENCE for presis ROI." },
  { step: "QUESTION", content: "«Hvor mye tid bruker teamet på manuell ordrebehandling og kundehenvendelser per uke?»" },
  { step: "FINDING", content: "Potensielt automatiseringsområde: innkommende kundehenvendelser (confidence: MEDIUM)." },
  { step: "UPGRADE_BOUNDARY", content: "For å verifisere og kvantifisere krever Full Audit intern prosess- og systemdata." },
];
