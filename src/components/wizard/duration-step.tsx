"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { durationMismatch } from "@/lib/quotation-schema";

export function DurationStep() {
  const { draft, setDuration } = useQuotationStore();
  const mismatch = durationMismatch(draft.nights, draft.days);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Duration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nights">Nights</Label>
            <Input
              id="nights"
              type="number"
              min={1}
              value={draft.nights}
              onChange={(e) => setDuration(Number(e.target.value) || 1, draft.days)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days">Days</Label>
            <Input
              id="days"
              type="number"
              min={1}
              value={draft.days}
              onChange={(e) => setDuration(draft.nights, Number(e.target.value) || 1)}
            />
          </div>
        </div>
        {mismatch && (
          <Alert variant="warning">
            Days should typically be nights + 1 (e.g., 3 nights = 4 days). Current: {draft.nights} nights / {draft.days} days.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
