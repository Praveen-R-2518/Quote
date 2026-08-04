"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const ENTITIES = ["places", "currencies", "roomTypes", "vehicles", "hotels", "inclusionTemplates", "exclusionTemplates"] as const;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [entity, setEntity] = useState<string>("places");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/admin/${entity}`)
      .then((r) => {
        if (r.status === 401) { setAuthenticated(false); return null; }
        setAuthenticated(true);
        return r.json();
      })
      .then((data) => { if (data) setItems(data); })
      .catch(() => setAuthenticated(false));
  }, [entity, authenticated]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPin("");
    } else {
      setError("Invalid PIN");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const refresh = () => {
    fetch(`/api/admin/${entity}`).then((r) => r.json()).then(setItems);
  };

  const handleCreate = async () => {
    const body: Record<string, unknown> = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (v === "true") body[k] = true;
      else if (v === "false") body[k] = false;
      else if (!isNaN(Number(v)) && v !== "") body[k] = Number(v);
      else body[k] = v;
    });
    await fetch(`/api/admin/${entity}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setFormData({});
    refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/${entity}?id=${id}`, { method: "DELETE" });
    refresh();
  };

  if (authenticated === null) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!authenticated) {
    return (
      <div className="app-background flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
              <Link href="/" className="block text-center text-sm font-medium text-stone-500 hover:text-orange-700">Back to App</Link>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen px-4 py-4 sm:px-6">
      <header className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 shadow-sm">
          <h1 className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg">Admin Panel</h1>
          <div className="flex gap-3">
            <Link href="/" className="rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-700">Back to App</Link>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl py-6">
        <div className="mb-4">
          <Label>Entity</Label>
          <select className="mt-1 h-11 w-full rounded-xl border border-orange-100 bg-white px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100" value={entity} onChange={(e) => setEntity(e.target.value)}>
            {ENTITIES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <Card className="mb-6">
          <CardHeader><CardTitle>Add New</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {entity === "places" && (
              <>
                <Input placeholder="name" value={formData.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder="sortOrder" value={formData.sortOrder ?? ""} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
              </>
            )}
            {entity === "currencies" && (
              <>
                <Input placeholder="code" value={formData.code ?? ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                <Input placeholder="symbol" value={formData.symbol ?? ""} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} />
                <Input placeholder="locale" value={formData.locale ?? "en-US"} onChange={(e) => setFormData({ ...formData, locale: e.target.value })} />
                <Input placeholder="sortOrder" value={formData.sortOrder ?? ""} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
              </>
            )}
            {(entity === "roomTypes" || entity === "vehicles") && (
              <>
                <Input placeholder="name" value={formData.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder="capacity" value={formData.capacity ?? ""} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                <Input placeholder="sortOrder" value={formData.sortOrder ?? ""} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
              </>
            )}
            {entity === "hotels" && (
              <>
                <Input placeholder="name" value={formData.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input placeholder="locations (comma-separated)" value={formData.locations ?? ""} onChange={(e) => setFormData({ ...formData, locations: e.target.value })} />
                <Input placeholder="sortOrder" value={formData.sortOrder ?? ""} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
              </>
            )}
            {(entity === "inclusionTemplates" || entity === "exclusionTemplates") && (
              <>
                <Input placeholder="text" value={formData.text ?? ""} onChange={(e) => setFormData({ ...formData, text: e.target.value })} />
                <Input placeholder="sortOrder" value={formData.sortOrder ?? ""} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
                <select className="h-11 w-full rounded-xl border border-orange-100 bg-white px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100" value={formData.isDefault ?? "true"} onChange={(e) => setFormData({ ...formData, isDefault: e.target.value })}>
                  <option value="true">Default</option>
                  <option value="false">Optional</option>
                </select>
              </>
            )}
            <Button onClick={handleCreate}>Create</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Items ({items.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="py-2 text-left">ID</th><th className="py-2 text-left">Details</th><th className="py-2"></th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={String(item.id)} className="border-b">
                      <td className="py-2">{String(item.id)}</td>
                      <td className="py-2">{JSON.stringify(item).slice(0, 120)}</td>
                      <td className="py-2"><Button variant="destructive" size="sm" onClick={() => handleDelete(Number(item.id))}>Delete</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
