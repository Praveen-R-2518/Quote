"use client";

import { useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format/currency";
import { payingPassengers } from "@/lib/quotation-schema";
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
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${draft.customerName || "draft"}.${type === "pdf" ? "pdf" : "docx"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(`${type === "pdf" ? "PDF" : "Word"} export failed. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="alert">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Word export</strong> uses your official company template (logo, colours, layout).
          <strong> PDF export</strong> generates a matching quotation document with inclusions and exclusions included.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation data review</CardTitle>
          <p className="text-sm text-gray-500">
            Review the data below before exporting.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-500">Duration</dt>
              <dd>{draft.nights}N {draft.days}D</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Quotation date</dt>
              <dd>{draft.quotationDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Expiration date</dt>
              <dd>{draft.expirationDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Customer</dt>
              <dd>{draft.customerName || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Places</dt>
              <dd>
                {draft.stayingLocations.map((s) => `${s.location} (${s.nights}N)`).join(" / ") ||
                  "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">PAX (paying)</dt>
              <dd>{payingPax}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Rooms</dt>
              <dd>{roomsDescription || roomsQty || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Transportation</dt>
              <dd>{transportDescription || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Meals</dt>
              <dd>
                {draft.meals.breakfasts} breakfast, {draft.meals.lunches} lunch, {draft.meals.dinners} dinner
                {draft.meals.dinners !== 1 ? "s" : ""}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-gray-500">Description</dt>
              <dd>{draft.packageDescription}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Per person</dt>
              <dd>
                {formatCurrency(draft.pricePerPerson, draft.currencyCode, currency?.locale, currency?.symbol)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Total</dt>
              <dd>
                {formatCurrency(totalPrice, draft.currencyCode, currency?.locale, currency?.symbol)}
              </dd>
            </div>
          </dl>

          {draft.tourPlan.length > 0 && (
            <div>
              <p className="mb-2 font-medium">Tour plan (max 4 days in Word template)</p>
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
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
                    {draft.tourPlan.slice(0, 4).map((row, i) => (
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
            <div>
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

      <div className="flex flex-wrap gap-3">
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
