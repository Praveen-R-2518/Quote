"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { APP_NAME, BRAND_LOGO_SRC, DEFAULT_COMPANY_NAME } from "@/lib/brand";

interface LoginScreenProps {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-surface flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-admin-fade-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 elevation-2 ring-1 ring-stone-100">
            {!logoError ? (
              <Image
                src={BRAND_LOGO_SRC}
                alt={`${DEFAULT_COMPANY_NAME} logo`}
                width={48}
                height={48}
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <span className="text-lg font-bold text-orange-600">P</span>
            )}
          </span>
          <p className="mt-4 text-sm font-semibold text-navy">{APP_NAME}</p>
          <p className="text-xs text-navy-soft">Admin access</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              Enter admin PIN
            </CardTitle>
            <p className="text-sm text-navy-soft">Restricted to authorised staff only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              {error && <Alert variant="error">{error}</Alert>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Verifying…" : "Unlock admin panel"}
              </Button>
              <Link
                href="/"
                className="block text-center text-sm font-medium text-navy-soft transition-colors hover:text-orange-700"
              >
                Back to Builder
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
