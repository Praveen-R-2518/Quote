export function formatCurrency(amount: number, code: string, locale = "en-US", symbol?: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(amount);
  } catch {
    return `${symbol ?? code} ${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export function parseCurrencySymbol(code: string, locale: string): string {
  try {
    const parts = new Intl.NumberFormat(locale, { style: "currency", currency: code }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}
