// demo-company.ts — SYNTHETIC demo «Multi-location Service Organization»
// Anonymisert, eksplisitt merket som demo. Aldri blandet med ekte data.
// Inspirert av en typisk nordisk multi-lokasjons servicevirksomhet (kantine/food-service),
// men INGEN reelle kundenavn eller tall — kun anonymiserte struktursignaler.

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
  company_id: "demo-multi-location-service",
  org_number: "999999999",  // SYNTHETIC — ikke et ekte org.nr
  name: "Multi-location Service Organization",
  industry_code: "56.220",
  industry_name: "Kantinedrift og catering",
  employees: 120,
  website: "demo.example",
  municipality: "Midt-Norge",
  disclaimer: "SYNTHETIC DEMO",
  signals: [
    {
      signal_type: "MULTI_LOCATION",
      description: "Mange servicepunkter fordelt over en region — høy koordineringskompleksitet",
      confidence: "HIGH",
      evidence_reference: "synthetic:brreg:multiple-units",
    },
    {
      signal_type: "WORKFORCE",
      description: "Stor andel operativt ansatte spredt på mange lokasjoner",
      confidence: "HIGH",
      evidence_reference: "synthetic:brreg:workforce",
    },
    {
      signal_type: "CUSTOMER_FACING",
      description: "Kundedialog skjer på tvers av mange servicepunkter — telefoni, epost, bestilling",
      confidence: "MEDIUM",
      evidence_reference: "synthetic:website:channels",
    },
    {
      signal_type: "OPERATIONAL",
      description: "Bemanning, vaktlister og koordinering på tvers av enheter",
      confidence: "MEDIUM",
      evidence_reference: "synthetic:industry:operations",
    },
    {
      signal_type: "DOCUMENTATION",
      description: "Rapportering og dokumentasjon spredt over lokasjoner",
      confidence: "LOW",
      evidence_reference: "synthetic:industry:documentation",
    },
  ],
  potential_areas: [
    "Customer communication",
    "Workforce coordination",
    "Documentation flow",
    "Operational efficiency",
  ],
  uncertainty: [
    "Faktisk tidsbruk på koordinering og kundedialog (krever kundesvar)",
    "Eksisterende systemer (bemannings-/bestillingssystem) — ikke synlig offentlig",
    "Volum av henvendelser per servicepunkt",
  ],
};

// Demo-flyt: public signals → AI reasoning → questions → findings → upgrade boundary
export interface DemoStep {
  step: string;
  content: string;
}

export const NORDIC_SERVICE_FLOW: DemoStep[] = [
  { step: "PUBLIC_SIGNALS", content: "Fant 5 struktursignaler: multi-location, workforce, customer-facing, operational, documentation." },
  { step: "AI_REASONING", content: "Mange servicepunkter + spredt bemanning + kundedialog på tvers → mulig høy koordinerings- og kommunikasjonsbelastning. INSUFFICIENT EVIDENCE for presis ROI." },
  { step: "QUESTION", content: "«Hvor mye tid bruker ledelsen på koordinering og kundedialog på tvers av lokasjoner per uke?»" },
  { step: "FINDING", content: "Potensielt automatiseringsområde: koordinering og kundekommunikasjon (confidence: MEDIUM)." },
  { step: "UPGRADE_BOUNDARY", content: "For å verifisere og kvantifisere krever Full Audit intern prosess- og systemdata." },
];
