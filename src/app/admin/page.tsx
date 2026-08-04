"use client";

import { useEffect, useState } from "react";
import { LoginScreen } from "@/components/admin/login-screen";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/places")
      .then((r) => setAuthenticated(r.status !== 401))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="admin-surface flex min-h-screen items-center justify-center">
        <p className="rounded-full bg-white px-5 py-3 text-sm text-navy-soft elevation-1">Loading…</p>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <ToastProvider>
      <AdminShell onUnauthorized={() => setAuthenticated(false)} onLogout={handleLogout} />
    </ToastProvider>
  );
}
