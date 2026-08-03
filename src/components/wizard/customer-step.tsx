"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerStep() {
  const { draft, setCustomerName, config } = useQuotationStore();
  const required = config?.template?.requireCustomerName ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="customerName">
            Customer Name {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="customerName"
            value={draft.customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer or group name"
            required={required}
          />
        </div>
      </CardContent>
    </Card>
  );
}
