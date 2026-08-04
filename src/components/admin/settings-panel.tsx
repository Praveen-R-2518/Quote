"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import type { AdminEntityConfig } from "@/lib/admin/entity-config";
import type { EntityItem } from "@/lib/admin/use-entity-crud";
import { useEntityCrud } from "@/lib/admin/use-entity-crud";

interface SettingsPanelProps {
  entity: AdminEntityConfig;
  onUnauthorized: () => void;
}

type FormValues = Record<string, string | boolean>;

function buildValues(entity: AdminEntityConfig, item: EntityItem | null): FormValues {
  const values: FormValues = {};
  for (const field of entity.fields) {
    const raw = item ? item[field.key] : undefined;
    values[field.key] =
      field.type === "boolean"
        ? Boolean(raw ?? field.defaultValue ?? false)
        : String(raw ?? field.defaultValue ?? "");
  }
  return values;
}

export function SettingsPanel({ entity, onUnauthorized }: SettingsPanelProps) {
  const { items, loading, create, update } = useEntityCrud(entity.key, onUnauthorized);
  const current = items[0] ?? null;
  const [values, setValues] = useState<FormValues>(() => buildValues(entity, null));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading) {
      setValues(buildValues(entity, current));
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, current?.id]);

  const setValue = (key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const field of entity.fields) {
      payload[field.key] = field.type === "boolean" ? Boolean(values[field.key]) : values[field.key];
    }

    const result = current ? await update(current.id, payload) : await create(payload);
    setSaving(false);

    if (result.ok) {
      setDirty(false);
      showToast(`${entity.singular} saved.`);
    } else {
      setError(result.error ?? "Could not save changes.");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{entity.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entity.label}</CardTitle>
        <p className="text-sm text-navy-soft">{entity.description}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        {entity.fields.map((field) => {
          const fieldId = `settings-${entity.key}-${field.key}`;
          if (field.type === "boolean") {
            return (
              <div key={field.key} className="flex items-start justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3.5">
                <div>
                  <Label htmlFor={fieldId} className="font-medium">{field.label}</Label>
                  {field.helperText && <p className="mt-0.5 text-xs text-navy-soft">{field.helperText}</p>}
                </div>
                <Switch
                  id={fieldId}
                  checked={Boolean(values[field.key])}
                  onCheckedChange={(checked) => setValue(field.key, checked)}
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={fieldId}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={fieldId}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={fieldId}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              {field.helperText && <p className="text-xs text-navy-soft">{field.helperText}</p>}
            </div>
          );
        })}

        <div className="flex items-center justify-between border-t border-stone-100 pt-5">
          <p className="text-xs text-navy-soft">{dirty ? "You have unsaved changes." : "All changes saved."}</p>
          <Button onClick={handleSave} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
