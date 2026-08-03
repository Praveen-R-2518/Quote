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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-500">Run npm run db:migrate && npm run db:seed</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-emerald-700">Sri Lanka Travel Quotation</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-emerald-600">Admin</Link>
        </div>
      </header>
      {showDraftPrompt ? (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="mb-4">You have an unfinished quotation draft.</p>
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
