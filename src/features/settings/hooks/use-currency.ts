import { useGetCurrency } from "@/features/settings/api/use-get-currency";
import { DEFAULT_CURRENCY, formatCurrency } from "@/lib/utils";

/**
 * Provides the active currency code and a synchronized formatting utility function.
 */
export const useCurrency = () => {
  const { data } = useGetCurrency();
  const currency = data ?? DEFAULT_CURRENCY;

  return {
    currency,
    // Formats a numeric value into a localized currency string using the current active preference.
    format: (value: number) => formatCurrency(value, currency),
  };
};
