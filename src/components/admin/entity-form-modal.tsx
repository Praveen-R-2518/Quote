"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import type { AdminEntityConfig } from "@/lib/admin/entity-config";
import type { EntityItem } from "@/lib/admin/use-entity-crud";

interface EntityFormModalProps {
  open: boolean;
  onClose: () => void;
  entity: AdminEntityConfig;
  initialItem: EntityItem | null;
  refData: Record<string, EntityItem[]>;
  onSubmit: (data: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;
}

type FormValues = Record<string, string | boolean>;

function buildInitialValues(entity: AdminEntityConfig, item: EntityItem | null): FormValues {
  const values: FormValues = {};
  for (const field of entity.fields) {
    const raw = item ? item[field.key] : undefined;
    if (field.type === "boolean") {
      values[field.key] = raw !== undefined ? Boolean(raw) : Boolean(field.defaultValue ?? false);
    } else {
      values[field.key] = raw !== undefined && raw !== null ? String(raw) : String(field.defaultValue ?? "");
    }
  }
  return values;
}

export function EntityFormModal({ open, onClose, entity, initialItem, refData, onSubmit }: EntityFormModalProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(entity, initialItem));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(entity, initialItem));
      setErrors({});
      setSubmitError(null);
    }
  }, [open, entity, initialItem]);

  const setValue = (key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    for (const field of entity.fields) {
      if (!field.required) continue;
      const value = values[field.key];
      if (field.type === "boolean") continue;
      if (String(value ?? "").trim() === "") {
        nextErrors[field.key] = `${field.label} is required.`;
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload: Record<string, unknown> = {};
    for (const field of entity.fields) {
      const raw = values[field.key];
      if (field.type === "number" || field.type === "select") {
        payload[field.key] = raw === "" ? null : Number(raw);
      } else if (field.type === "boolean") {
        payload[field.key] = Boolean(raw);
      } else {
        payload[field.key] = raw;
      }
    }

    const result = await onSubmit(payload);
    setSubmitting(false);
    if (result.ok) {
      onClose();
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  const isEditing = Boolean(initialItem);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit ${entity.singular}` : `Add ${entity.singular}`}
      description={entity.description}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEditing ? "Save changes" : `Add ${entity.singular}`}
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {submitError && <Alert variant="error">{submitError}</Alert>}

        {entity.fields.map((field) => {
          const fieldId = `field-${field.key}`;
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

              {field.type === "textarea" && (
                <Textarea
                  id={fieldId}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(errors[field.key])}
                />
              )}

              {field.type === "select" && field.optionsFrom && (
                <Select
                  id={fieldId}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  aria-invalid={Boolean(errors[field.key])}
                >
                  <option value="" disabled>Select {field.label.toLowerCase()}…</option>
                  {(refData[field.optionsFrom] ?? []).map((opt) => (
                    <option key={String(opt.id)} value={String(opt.id)}>
                      {String(opt[field.optionLabelKey ?? "name"])}
                    </option>
                  ))}
                </Select>
              )}

              {(field.type === "text" || field.type === "number") && (
                <Input
                  id={fieldId}
                  type={field.type === "number" ? "number" : "text"}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(errors[field.key])}
                />
              )}

              {field.helperText && <p className="text-xs text-navy-soft">{field.helperText}</p>}
              {errors[field.key] && <p className="text-xs font-medium text-red-600">{errors[field.key]}</p>}
            </div>
          );
        })}
      </form>
    </Modal>
  );
}
