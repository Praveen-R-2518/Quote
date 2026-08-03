import type { QuotationDraft } from "./quotation-schema";

const DRAFT_KEY = "travel-quotation-draft";

export function saveDraft(draft: QuotationDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft(): QuotationDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuotationDraft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}

export function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DRAFT_KEY) !== null;
}
