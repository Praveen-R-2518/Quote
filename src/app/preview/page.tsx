"use client";

import { useEffect, useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { QuotationPreview } from "@/components/preview/quotation-preview";
import type { AppConfig } from "@/lib/config-service";
import Link from "next/link";

export default function PreviewPage() {
  const { setConfig, loadFromStorage } = useQuotationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    fetch("/api/config")
      .then((r) => r.json())
      .then((config: AppConfig) => { setConfig(config); setLoading(false); })
      .catch(() => setLoading(false));
  }, [setConfig, loadFromStorage]);

  if (loading) return <div className="app-background flex min-h-screen items-center justify-center"><p className="rounded-full bg-white/75 px-5 py-3 text-stone-500 shadow-sm">Loading...</p></div>;

  return (
    <div className="app-background min-h-screen px-4 py-4 sm:px-6">
      <header className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 shadow-sm">
          <h1 className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg">Quotation Preview</h1>
          <Link href="/" className="rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-700">Back to Wizard</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl py-6">
        <QuotationPreview />
      </div>
    </div>
  );
}
