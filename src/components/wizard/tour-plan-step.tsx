"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TourPlanRow } from "@/lib/quotation-schema";

export function TourPlanStep() {
  const {
    draft,
    setTourPlan,
    regenerateTourPlan,
    setQuotationDate,
    setExpirationDate,
    setMeals,
    setDefaultRoomCategory,
  } = useQuotationStore();

  useEffect(() => {
    if (draft.tourPlan.length === 0 && draft.days > 0) {
      regenerateTourPlan();
    }
  }, [draft.tourPlan.length, draft.days, regenerateTourPlan]);

  const updateRow = (index: number, field: keyof TourPlanRow, value: string) => {
    const updated = draft.tourPlan.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setTourPlan(updated);
  };

  const updateMeal = (field: keyof typeof draft.meals, value: number) => {
    setMeals({ ...draft.meals, [field]: Math.max(0, value) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Plan & Dates</CardTitle>
        <p className="text-sm text-gray-500">
          Review the day-by-day itinerary, meals, and quotation dates
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quotationDate">Quotation Date</Label>
            <Input
              id="quotationDate"
              value={draft.quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              placeholder="DD.MM.YYYY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              value={draft.expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder="DD.MM.YYYY"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-md border bg-gray-50 p-4">
          <Label>Meals included in package</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="breakfasts" className="text-xs text-gray-600">
                Breakfasts
              </Label>
              <Input
                id="breakfasts"
                type="number"
                min={0}
                value={draft.meals.breakfasts}
                onChange={(e) => updateMeal("breakfasts", Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lunches" className="text-xs text-gray-600">
                Lunches
              </Label>
              <Input
                id="lunches"
                type="number"
                min={0}
                value={draft.meals.lunches}
                onChange={(e) => updateMeal("lunches", Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dinners" className="text-xs text-gray-600">
                Dinners
              </Label>
              <Input
                id="dinners"
                type="number"
                min={0}
                value={draft.meals.dinners}
                onChange={(e) => updateMeal("dinners", Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-600">Package description (for quotation table)</Label>
            <p className="rounded-md border bg-white px-3 py-2 text-sm">{draft.packageDescription}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultRoomCategory">Default Room Category</Label>
          <Input
            id="defaultRoomCategory"
            value={draft.defaultRoomCategory}
            onChange={(e) => setDefaultRoomCategory(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Tour Plan ({draft.nights}N {draft.days}D)</Label>
          <Button type="button" variant="outline" size="sm" onClick={regenerateTourPlan}>
            Auto-fill from hotels
          </Button>
        </div>

        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-2 py-2 text-left font-semibold">DAY</th>
                <th className="px-2 py-2 text-left font-semibold">FROM</th>
                <th className="px-2 py-2 text-left font-semibold">TO</th>
                <th className="px-2 py-2 text-left font-semibold">HOTEL</th>
                <th className="px-2 py-2 text-left font-semibold">LOCATION</th>
                <th className="px-2 py-2 text-left font-semibold">ROOM CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {draft.tourPlan.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[80px]"
                      value={row.dayLabel}
                      onChange={(e) => updateRow(i, "dayLabel", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      value={row.from}
                      onChange={(e) => updateRow(i, "from", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      value={row.to}
                      onChange={(e) => updateRow(i, "to", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[140px]"
                      value={row.hotelName}
                      onChange={(e) => updateRow(i, "hotelName", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[100px]"
                      value={row.stayLocation}
                      onChange={(e) => updateRow(i, "stayLocation", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      className="h-8 min-w-[90px]"
                      value={row.roomCategory}
                      onChange={(e) => updateRow(i, "roomCategory", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
              {draft.tourPlan.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No tour plan rows yet. Set duration and hotels, then click Auto-fill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
