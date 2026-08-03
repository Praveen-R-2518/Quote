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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-1">
        {WIZARD_STEPS.map((step, i) => (
          <button
            key={step}
            type="button"
            onClick={() => setStep(step)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              i === currentIndex ? "bg-emerald-600 text-white" : i < currentIndex ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
            )}
          >
            {STEP_LABELS[step]}
          </button>
        ))}
      </nav>

      <div className="mb-8">
        <StepComponent />
      </div>

      <div className="mb-4 flex justify-end">
        <Button variant="ghost" onClick={() => { if (confirm("Clear all quotation data and start again?")) resetDraft(); }}>Start new quotation</Button>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentStep !== "preview" && (
          <Button onClick={nextStep}>Next</Button>
        )}
      </div>
    </div>
  );
}
