"use client";

import { useEffect, useState } from "react";
import { WizardContainer } from "@/components/wizard/wizard-container";
import { useQuotationStore } from "@/store/quotation-store";
import type { AppConfig } from "@/lib/config-service";
import Link from "next/link";
import { hasDraft, clearDraft } from "@/lib/draft-storage";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { setConfig, loadFromStorage, persistDraft, resetDraft } = useQuotationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  useEffect(() => {
    if (hasDraft()) setShowDraftPrompt(true);
    else loadFromStorage();
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
  }, [setConfig, loadFromStorage]);

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

  return (
    <div className="app-background min-h-screen px-4 py-4 sm:px-6">
      <header className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-sm">
              P
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg">Sri Lanka Travel Quotation</h1>
              <p className="hidden text-xs text-stone-500 sm:block">Pumpkin Tours & Travels</p>
            </div>
          </div>
          <Link href="/admin" className="rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-700">Admin</Link>
        </div>
      </header>
      {showDraftPrompt ? (
        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-orange-100 bg-white/90 px-6 py-8 text-center shadow-sm">
          <p className="mb-4 font-medium text-stone-800">You have an unfinished quotation draft.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => { loadFromStorage(); setShowDraftPrompt(false); }}>Continue draft</Button>
            <Button variant="outline" onClick={() => { clearDraft(); resetDraft(); setShowDraftPrompt(false); }}>Start new</Button>
          </div>
        </div>
      ) : (
        <WizardContainer />
      )}
    </div>
  );
}
