import { getCurrencySymbol } from "@/lib/utils";

/**
 * Expected shape for currency configuration objects used in select dropdown options.
 */
type CurrencyOption = {
  value: string;
  label: string;
  symbol: string;
};

/**
 * Fallback-safe array fetcher that scans the modern Intl API to extract all standard global currency strings.
 */
function getSupportedCurrencyCodes(): string[] {
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf;

  // Uses native engine runtime support keys if exposed by the environment
  if (typeof supported === "function") {
    return supported("currency");
  }

  // Baseline standard fallback matrix used if the runtime engine environment lack native feature flags
  return ["USD", "EUR", "GBP", "JPY", "PHP", "AUD", "CAD", "CNY", "INR", "SGD"];
}

// Pre-configures a localized currency display descriptor instance based on system locale configurations
const displayNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(undefined, { type: "currency" })
    : undefined;

/**
 * An alphabetically sorted index array mapping standard currency keys to formatted display labels.
 */
export const CURRENCY_OPTIONS: CurrencyOption[] = getSupportedCurrencyCodes()
  .map((code) => {
    // Resolves localized full names matching standard ISO code indicators
    const name = displayNames?.of(code) ?? code;
    const symbol = getCurrencySymbol(code);

    return {
      value: code,
      label: `${code} — ${name} (${symbol})`,
      symbol,
    };
  })
  // Orders dataset mutations consistently from A down through Z
  .sort((a, b) => a.value.localeCompare(b.value));
