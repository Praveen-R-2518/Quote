import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";
import {
  HERO_EYEBROW,
  HERO_HEADLINE_ACCENT,
  HERO_HEADLINE_LINE1,
  HERO_SUBTEXT,
  TRUST_ITEMS,
} from "@/lib/brand";

interface HeroSectionProps {
  onStartNew: () => void;
  draftAvailable?: boolean;
  onContinueDraft?: () => void;
}

export function HeroSection({ onStartNew, draftAvailable, onContinueDraft }: HeroSectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden px-4 pt-10 sm:px-6 sm:pt-20 lg:pt-24">
      <div className="grid grid-cols-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="animate-fade-in-up">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-200/70 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-orange-700 shadow-sm sm:px-3.5 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{HERO_EYEBROW}</span>
          </span>

          <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.1] tracking-tight text-navy sm:mt-6 sm:text-5xl lg:text-[3.4rem]">
            {HERO_HEADLINE_LINE1}
            <br />
            <span className="text-gradient-brand">{HERO_HEADLINE_ACCENT}</span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-soft sm:mt-6 sm:text-[17px]">
            {HERO_SUBTEXT}
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {draftAvailable ? (
              <>
                <Button
                  size="lg"
                  className="group w-full text-[15px] shadow-lg shadow-orange-500/20 sm:w-auto sm:min-w-[11.5rem]"
                  onClick={onContinueDraft}
                >
                  Continue draft
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="lg" variant="outline" className="w-full text-[15px] sm:w-auto sm:min-w-[11.5rem]" onClick={onStartNew}>
                  Create New Quotation
                </Button>
              </>
            ) : (
              <Button size="lg" className="group w-full text-[15px] shadow-lg shadow-orange-500/20 sm:w-auto sm:min-w-[13rem]" onClick={onStartNew}>
                Create New Quotation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            )}
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-black/[0.06] pt-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[13px] font-medium text-navy-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden="true" />
                {item}
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-in-up [animation-delay:120ms]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
