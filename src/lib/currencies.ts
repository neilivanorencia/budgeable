import { getCurrencySymbol } from "@/lib/utils";

export type CurrencyOption = {
  value: string;
  label: string;
  symbol: string;
};

function getSupportedCurrencyCodes(): string[] {
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
    .supportedValuesOf;

  if (typeof supported === "function") {
    return supported("currency");
  }

  return ["USD", "EUR", "GBP", "JPY", "PHP", "AUD", "CAD", "CNY", "INR", "SGD"];
}

const displayNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(undefined, { type: "currency" })
    : undefined;

export const CURRENCY_OPTIONS: CurrencyOption[] = getSupportedCurrencyCodes()
  .map((code) => {
    const name = displayNames?.of(code) ?? code;
    const symbol = getCurrencySymbol(code);

    return {
      value: code,
      label: `${code} — ${name} (${symbol})`,
      symbol,
    };
  })
  .sort((a, b) => a.value.localeCompare(b.value));
