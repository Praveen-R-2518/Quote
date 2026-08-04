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
    <section className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-orange-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {HERO_EYEBROW}
          </span>

          <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            {HERO_HEADLINE_LINE1}
            <br />
            <span className="text-gradient-brand">{HERO_HEADLINE_ACCENT}</span>
          </h1>

          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-navy-soft">
            {HERO_SUBTEXT}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {draftAvailable ? (
              <>
                <Button
                  size="lg"
                  className="group min-w-[11.5rem] text-[15px] shadow-lg shadow-orange-500/20"
                  onClick={onContinueDraft}
                >
                  Continue draft
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="lg" variant="outline" className="min-w-[11.5rem] text-[15px]" onClick={onStartNew}>
                  Create New Quotation
                </Button>
              </>
            ) : (
              <Button size="lg" className="group min-w-[13rem] text-[15px] shadow-lg shadow-orange-500/20" onClick={onStartNew}>
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
