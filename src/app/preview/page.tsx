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

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-emerald-700">Quotation Preview</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600">Back to Wizard</Link>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <QuotationPreview />
      </div>
    </div>
  );
}
