"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { WIZARD_STEPS } from "@/lib/quotation-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomerStep } from "./customer-step";
import { DurationStep } from "./duration-step";
import { PlacesStep } from "./places-step";
import { PassengersStep } from "./passengers-step";
import { PricingStep } from "./pricing-step";
import { RoomsStep } from "./rooms-step";
import { TransportStep } from "./transport-step";
import { HotelsStep } from "./hotels-step";
import { TourPlanStep } from "./tour-plan-step";
import { InclusionsStep } from "./inclusions-step";
import { PreviewStep } from "./preview-step";

const STEP_LABELS: Record<string, string> = {
  customer: "Customer",
  duration: "Duration",
  places: "Places",
  passengers: "Passengers",
  pricing: "Pricing",
  rooms: "Rooms",
  transport: "Transport",
  hotels: "Hotels",
  tourPlan: "Tour Plan",
  inclusions: "Inclusions",
  preview: "Preview",
};

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  customer: CustomerStep,
  duration: DurationStep,
  places: PlacesStep,
  passengers: PassengersStep,
  pricing: PricingStep,
  rooms: RoomsStep,
  transport: TransportStep,
  hotels: HotelsStep,
  tourPlan: TourPlanStep,
  inclusions: InclusionsStep,
  preview: PreviewStep,
};

export function WizardContainer() {
  const { currentStep, setStep, nextStep, prevStep, resetDraft } = useQuotationStore();
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];
  const progress = ((currentIndex + 1) / WIZARD_STEPS.length) * 100;
  const currentLabel = STEP_LABELS[currentStep];
  const nextLabel = WIZARD_STEPS[currentIndex + 1] ? STEP_LABELS[WIZARD_STEPS[currentIndex + 1]] : null;

  return (
    <div className="mx-auto max-w-5xl px-0 py-6">
      <section className="mb-5 rounded-3xl border border-orange-100 bg-white/85 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Step {currentIndex + 1} of {WIZARD_STEPS.length}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">{currentLabel}</h2>
            {nextLabel && <p className="mt-1 text-sm text-stone-500">Next up: {nextLabel}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => { if (confirm("Clear all quotation data and start again?")) resetDraft(); }}>
            Start new
          </Button>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-orange-100">
          <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Quotation steps">
          {WIZARD_STEPS.map((step, i) => (
            <button
              key={step}
              type="button"
              onClick={() => setStep(step)}
              className={cn(
                "flex min-w-fit items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition-all hover:-translate-y-0.5",
                i === currentIndex
                  ? "border-orange-300 bg-orange-50 text-orange-800 shadow-sm"
                  : i < currentIndex
                    ? "border-orange-100 bg-white text-stone-700"
                    : "border-transparent bg-stone-50 text-stone-500 hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  i === currentIndex
                    ? "bg-orange-500 text-white"
                    : i < currentIndex
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-stone-400"
                )}
              >
                {i + 1}
              </span>
              {STEP_LABELS[step]}
            </button>
          ))}
        </nav>
      </section>

      <div className="mb-8">
        <StepComponent />
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-2xl border border-orange-100 bg-white/90 p-3 shadow-md shadow-orange-950/5 backdrop-blur">
        <Button variant="outline" onClick={prevStep} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentStep !== "preview" && (
          <Button onClick={nextStep}>{nextLabel ? `Next: ${nextLabel}` : "Next"}</Button>
        )}
      </div>
    </div>
  );
}
