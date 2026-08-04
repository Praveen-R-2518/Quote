"use client";

import { useEffect, useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { QuotationPreview } from "@/components/preview/quotation-preview";
import type { AppConfig } from "@/lib/config-service";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";

export default function PreviewPage() {
  const { setConfig, loadFromStorage, config } = useQuotationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    fetch("/api/config")
      .then((r) => r.json())
      .then((configData: AppConfig) => { setConfig(configData); setLoading(false); })
      .catch(() => setLoading(false));
  }, [setConfig, loadFromStorage]);

  if (loading) return <div className="app-background flex min-h-screen items-center justify-center"><p className="rounded-full bg-white/75 px-5 py-3 text-stone-500 shadow-sm">Loading...</p></div>;

  return (
    <div className="app-background min-h-screen px-4 py-4 sm:px-6">
      <AppHeader
        companyName={config?.company?.name}
        right={
          <Link href="/" className="rounded-xl px-2.5 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 sm:px-3">
            <span className="hidden sm:inline">Back to Builder</span>
            <span className="sm:hidden">← Back</span>
          </Link>
        }
      />
      <div className="mx-auto max-w-5xl py-6">
        <QuotationPreview />
      </div>
    </div>
  );
}
