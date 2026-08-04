"use client";

import { useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format/currency";
import { payingPassengers, formatPaxQty, TOUR_TYPE_LABELS } from "@/lib/quotation-schema";
import { totalRooms, formatRoomsDescription } from "@/lib/room-allocation";
import { FileDown, FileText, RotateCcw, Info } from "lucide-react";

export function QuotationPreview() {
  const { draft, config, persistDraft, resetDraft } = useQuotationStore();
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const currency = config?.currencies.find((c) => c.code === draft.currencyCode);
  const payingPax = payingPassengers(draft.passengers);
  const totalPrice = draft.pricePerPerson * payingPax;
  const roomsQty = totalRooms(draft.roomAllocations);
  const roomsDescription = formatRoomsDescription(draft.roomAllocations);
  const transportDescription = draft.transport.map((t) => `${t.count}x ${t.vehicleName}`).join(", ");

  const handleExport = async (type: "pdf" | "docx") => {
    setExporting(type);
    persistDraft();
    try {
      const res = await fetch(`/api/export/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error ?? "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${draft.customerName || "draft"}.${type === "pdf" ? "pdf" : "docx"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : `${type === "pdf" ? "PDF" : "Word"} export failed. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-2xl border border-orange-100 bg-white/80 p-4 text-sm text-stone-700 shadow-sm" role="alert">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Word export</strong> and <strong>PDF export</strong> both use the same official company template, so the PDF matches the Word document (logo, colours, and layout).
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation data review</CardTitle>
          <p className="text-sm text-stone-500">
            Review the data below before exporting.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="review-grid grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-stone-500">Duration</dt>
              <dd className="break-words">{draft.nights}N {draft.days}D</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Quotation date</dt>
              <dd className="break-words">{draft.quotationDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Expiration date</dt>
              <dd className="break-words">{draft.expirationDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Customer</dt>
              <dd className="break-words">{draft.customerName || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Tour type</dt>
              <dd className="break-words">
                {draft.tourType} — {TOUR_TYPE_LABELS[draft.tourType]}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Places</dt>
              <dd className="break-words">
                {draft.stayingLocations.map((s) => `${s.location} (${s.nights}N)`).join(" / ") ||
                  "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">PAX (paying)</dt>
              <dd className="break-words">{formatPaxQty(payingPax)}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Rooms</dt>
              <dd className="break-words">{roomsDescription || roomsQty || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Transportation</dt>
              <dd className="break-words">{transportDescription || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Meals</dt>
              <dd>
                {draft.meals.breakfasts} breakfast, {draft.meals.lunches} lunch, {draft.meals.dinners} dinner
                {draft.meals.dinners !== 1 ? "s" : ""}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-stone-500">Description</dt>
              <dd className="break-words">{draft.packageDescription}</dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Per person</dt>
              <dd>
                {formatCurrency(draft.pricePerPerson, draft.currencyCode, currency?.locale, currency?.symbol)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500">Total</dt>
              <dd>
                {formatCurrency(totalPrice, draft.currencyCode, currency?.locale, currency?.symbol)}
              </dd>
            </div>
          </dl>

          {draft.tourPlan.length > 0 && (
            <div>
              <p className="mb-2 font-medium">Tour plan</p>
              <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white/70">
                <table className="min-w-full text-xs">
                  <thead className="bg-orange-100/80">
                    <tr>
                      <th className="px-2 py-1 text-left">DAY</th>
                      <th className="px-2 py-1 text-left">FROM</th>
                      <th className="px-2 py-1 text-left">TO</th>
                      <th className="px-2 py-1 text-left">HOTEL</th>
                      <th className="px-2 py-1 text-left">LOCATION</th>
                      <th className="px-2 py-1 text-left">CATEGORY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.tourPlan.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1">{row.dayLabel}</td>
                        <td className="px-2 py-1">{row.from}</td>
                        <td className="px-2 py-1">{row.to}</td>
                        <td className="px-2 py-1">{row.hotelName}</td>
                        <td className="px-2 py-1">{row.stayLocation}</td>
                        <td className="px-2 py-1">{row.roomCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {draft.inclusions.length > 0 && (
            <div>
              <p className="font-medium">Inclusions</p>
              <ul className="ml-4 mt-1 list-disc">
                {draft.inclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {draft.exclusions.length > 0 && (
            <div className="mt-6">
              <p className="font-medium">Exclusions</p>
              <ul className="ml-4 mt-1 list-disc">
                {draft.exclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-orange-100 bg-white/85 p-3 shadow-sm">
        <Button onClick={() => handleExport("docx")} disabled={!!exporting}>
          <FileText className="mr-2 h-4 w-4" />
          {exporting === "docx" ? "Exporting..." : "Export Word"}
        </Button>
        <Button variant="outline" onClick={() => handleExport("pdf")} disabled={!!exporting}>
          <FileDown className="mr-2 h-4 w-4" />
          {exporting === "pdf" ? "Exporting..." : "Export PDF"}
        </Button>
        <Button variant="ghost" onClick={resetDraft}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start new quotation
        </Button>
      </div>
    </div>
  );
}
