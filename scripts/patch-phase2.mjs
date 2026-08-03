import fs from "fs";

function replaceInFile(path, replacer) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, "utf8");
  content = replacer(content);
  fs.writeFileSync(path, content);
}

replaceInFile("src/lib/quotation-schema.ts", (s) => {
  s = s.replace(
    "  focs: z.number().int().min(0).default(0),\n});",
    "  focs: z.number().int().min(0).default(0),\n  focRequiresAccommodation: z.boolean().default(true),\n  focRequiresTransport: z.boolean().default(true),\n});"
  );
  s = s.replace("totalPrice: z.number().min(0),", "pricePerPerson: z.number().min(0),");
  s = s.replace(
    "export function guestsNeedingBeds(p: Passengers): number {\n  return p.adults + p.children;\n}",
    `export function payingPassengers(p: Passengers): number {
  return p.adults + p.children;
}

export function guestsNeedingBeds(p: Passengers): number {
  const base = p.adults + p.children + p.infants;
  return p.focRequiresAccommodation ? base + p.focs : base;
}

export function travellersNeedingTransport(p: Passengers): number {
  const base = p.adults + p.children + p.infants;
  return p.focRequiresTransport ? base + p.focs : base;
}`
  );
  return s;
});

replaceInFile("src/store/quotation-store.ts", (s) => {
  s = s.replace(
    "import { WIZARD_STEPS } from \"@/lib/quotation-schema\";",
    "import { WIZARD_STEPS, guestsNeedingBeds, travellersNeedingTransport } from \"@/lib/quotation-schema\";"
  );
  s = s.replace(
    "passengers: { adults: 2, children: 0, infants: 0, focs: 0 },",
    "passengers: { adults: 2, children: 0, infants: 0, focs: 0, focRequiresAccommodation: true, focRequiresTransport: true },"
  );
  s = s.replace(/totalPrice/g, "pricePerPerson");
  s = s.replace(
    "const guests = draft.passengers.adults + draft.passengers.children;",
    "const guests = guestsNeedingBeds(draft.passengers);"
  );
  s = s.replace(
    "const total = draft.passengers.adults + draft.passengers.children + draft.passengers.infants + draft.passengers.focs;",
    "const total = travellersNeedingTransport(draft.passengers);"
  );
  return s;
});

for (const file of [
  "src/components/wizard/pricing-step.tsx",
  "src/lib/export/build-doc-data.ts",
  "src/components/preview/quotation-preview.tsx",
  "src/components/wizard/preview-step.tsx",
]) {
  replaceInFile(file, (s) => {
    s = s.replace(/totalPrice/g, "pricePerPerson");
    s = s.replace("Total Price", "Price Per Person");
    return s;
  });
}

replaceInFile("src/components/wizard/passengers-step.tsx", (s) => {
  if (s.includes("focRequiresAccommodation")) return s;
  s = s.replace(
    'import { totalPassengers, guestsNeedingBeds } from "@/lib/quotation-schema";',
    'import { totalPassengers, guestsNeedingBeds, payingPassengers, travellersNeedingTransport } from "@/lib/quotation-schema";\nimport { Checkbox } from "@/components/ui/checkbox";'
  );
  s = s.replace(
    `        <div className="mt-4 text-sm text-gray-600">
          Total passengers: {totalPassengers(p)} | Guests needing beds: {guestsNeedingBeds(p)}
        </div>`,
    `        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={p.focRequiresAccommodation} onChange={(e) => setPassengers({ ...p, focRequiresAccommodation: e.target.checked })} />
            FOCs require accommodation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={p.focRequiresTransport} onChange={(e) => setPassengers({ ...p, focRequiresTransport: e.target.checked })} />
            FOCs require transport
          </label>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Paying passengers: {payingPassengers(p)} | Total travellers: {totalPassengers(p)} | Beds needed: {guestsNeedingBeds(p)} | Transport seats: {travellersNeedingTransport(p)}
        </div>`
  );
  return s;
});

replaceInFile("src/app/page.tsx", (s) => {
  if (s.includes("beforeunload")) return s;
  s = s.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport { hasDraft, clearDraft } from "@/lib/draft-storage";\nimport { Button } from "@/components/ui/button";'
  );
  s = s.replace(
    "  const { setConfig, loadFromStorage, persistDraft } = useQuotationStore();",
    "  const { setConfig, loadFromStorage, persistDraft, resetDraft } = useQuotationStore();"
  );
  s = s.replace(
    "  const [error, setError] = useState<string | null>(null);",
    "  const [error, setError] = useState<string | null>(null);\n  const [showDraftPrompt, setShowDraftPrompt] = useState(false);"
  );
  s = s.replace(
    "  useEffect(() => {\n    loadFromStorage();",
    "  useEffect(() => {\n    if (hasDraft()) setShowDraftPrompt(true);\n    else loadFromStorage();"
  );
  s = s.replace(
    "  useEffect(() => {\n    const interval = setInterval(() => persistDraft(), 30000);",
    `  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => persistDraft(), 30000);`
  );
  s = s.replace(
    "      <WizardContainer />",
    `      {showDraftPrompt ? (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="mb-4">You have an unfinished quotation draft.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => { loadFromStorage(); setShowDraftPrompt(false); }}>Continue draft</Button>
            <Button variant="outline" onClick={() => { clearDraft(); resetDraft(); setShowDraftPrompt(false); }}>Start new</Button>
          </div>
        </div>
      ) : (
        <WizardContainer />
      )}`
  );
  return s;
});

replaceInFile("src/components/wizard/wizard-container.tsx", (s) => {
  if (s.includes("resetDraft")) return s;
  s = s.replace(
    "  const { currentStep, setStep, nextStep, prevStep } = useQuotationStore();",
    "  const { currentStep, setStep, nextStep, prevStep, resetDraft } = useQuotationStore();"
  );
  s = s.replace(
    '      <div className="flex justify-between">',
    `      <div className="mb-4 flex justify-end">
        <Button variant="ghost" onClick={() => { if (confirm("Clear all quotation data and start again?")) resetDraft(); }}>Start new quotation</Button>
      </div>
      <div className="flex justify-between">`
  );
  return s;
});

console.log("Phase 2 patches applied");
