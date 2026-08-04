"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { WIZARD_STEPS } from "@/lib/quotation-schema";
import { APP_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TripBasicsStep } from "./trip-basics-step";
import { PlacesStep } from "./places-step";
import { RoomsTransportStep } from "./rooms-transport-step";
import { HotelsStep } from "./hotels-step";
import { TourPlanStep } from "./tour-plan-step";
import { InclusionsStep } from "./inclusions-step";
import { PreviewStep } from "./preview-step";

const STEP_LABELS: Record<string, string> = {
  tripBasics: "Trip Basics",
  places: "Places",
  roomsTransport: "Rooms & Transport",
  hotels: "Hotels",
  tourPlan: "Tour Plan",
  inclusions: "Inclusions",
  preview: "Preview",
};

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  tripBasics: TripBasicsStep,
  places: PlacesStep,
  roomsTransport: RoomsTransportStep,
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
    <div className="mx-auto max-w-5xl px-0 py-4 sm:py-6">
      <section className="mb-4 rounded-2xl border border-orange-100 bg-white/85 p-3 shadow-sm sm:mb-5 sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-xs">
              {APP_NAME} · Step {currentIndex + 1} of {WIZARD_STEPS.length}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">{currentLabel}</h2>
            {nextLabel && <p className="mt-1 truncate text-sm text-stone-500">Next up: {nextLabel}</p>}
          </div>
          <Button variant="ghost" size="sm" className="self-start sm:self-auto" onClick={() => { if (confirm("Clear all quotation data and start again?")) resetDraft(); }}>
            Start new
          </Button>
        </div>

        <div className="mb-3 h-2 overflow-hidden rounded-full bg-orange-100 sm:mb-4">
          <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Quotation steps">
          {WIZARD_STEPS.map((step, i) => (
            <button
              key={step}
              type="button"
              onClick={() => setStep(step)}
              className={cn(
                "flex min-w-fit snap-start items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition-all sm:hover:-translate-y-0.5",
                i === currentIndex
                  ? "border-orange-300 bg-orange-50 text-orange-800 shadow-sm"
                  : i < currentIndex
                    ? "border-orange-100 bg-white text-stone-700"
                    : "border-transparent bg-stone-50 text-stone-500 hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]",
                  i === currentIndex
                    ? "bg-orange-500 text-white"
                    : i < currentIndex
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-stone-400"
                )}
              >
                {i + 1}
              </span>
              <span className="whitespace-nowrap">{STEP_LABELS[step]}</span>
            </button>
          ))}
        </nav>
      </section>

      <div className="pb-24 sm:pb-28">
        <StepComponent />
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-10 border-t border-orange-100 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(124,45,18,0.08)] backdrop-blur sm:sticky sm:inset-x-auto sm:bottom-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button variant="outline" className="min-w-[5.5rem] flex-1 sm:flex-none" onClick={prevStep} disabled={currentIndex === 0}>
            Previous
          </Button>
          {currentStep !== "preview" && (
            <Button className="min-w-[5.5rem] flex-1 sm:flex-none" onClick={nextStep}>
              <span className="sm:hidden">Next</span>
              <span className="hidden sm:inline">{nextLabel ? `Next: ${nextLabel}` : "Next"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
