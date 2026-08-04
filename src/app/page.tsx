"use client";

import { useEffect, useState } from "react";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { useQuotationStore } from "@/store/quotation-store";
import type { AppConfig } from "@/lib/config-service";
import { hasDraft, clearDraft } from "@/lib/draft-storage";
import { AppHeader } from "@/components/layout/app-header";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  const { setConfig, loadFromStorage, persistDraft, resetDraft, config } = useQuotationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    setDraftAvailable(hasDraft());
    fetch("/api/config")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load config");
        return r.json();
      })
      .then((config: AppConfig) => {
        setConfig(config);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [setConfig]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => persistDraft(), 30000);
    return () => clearInterval(interval);
  }, [persistDraft]);

  if (loading) {
    return (
      <div className="app-background flex min-h-screen items-center justify-center">
        <p className="rounded-full bg-white/75 px-5 py-3 text-stone-500 shadow-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-background flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-stone-500">Run npm run db:migrate && npm run db:seed</p>
      </div>
    );
  }

  if (showLanding) {
    const continueDraft = () => {
      loadFromStorage();
      setShowLanding(false);
    };
    const startNew = () => {
      clearDraft();
      resetDraft();
      setShowLanding(false);
    };

    return (
      <div className="landing-surface min-h-screen">
        <SiteHeader companyName={config?.company?.name} />

        <main>
          <HeroSection
            onStartNew={startNew}
            draftAvailable={draftAvailable}
            onContinueDraft={continueDraft}
          />
        </main>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen px-4 py-4 sm:px-6">
      <AppHeader companyName={config?.company?.name} showAdminLink />
      <WizardContainer />
    </div>
  );
}
