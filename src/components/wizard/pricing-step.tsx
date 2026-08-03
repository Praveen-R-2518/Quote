"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function PricingStep() {
  const { draft, setPricing, config } = useQuotationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency & Price</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            value={draft.currencyCode}
            onChange={(e) => setPricing(e.target.value, draft.pricePerPerson)}
          >
            {config?.currencies.map((c) => (
              <option key={c.id} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price Per Person</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            value={draft.pricePerPerson}
            onChange={(e) => setPricing(draft.currencyCode, Number(e.target.value) || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
