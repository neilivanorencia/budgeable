import { useGetCurrency } from "@/features/settings/api/use-get-currency";
import { DEFAULT_CURRENCY, formatCurrency } from "@/lib/utils";

export const useCurrency = () => {
  const { data } = useGetCurrency();
  const currency = data ?? DEFAULT_CURRENCY;

  return {
    currency,
    format: (value: number) => formatCurrency(value, currency),
  };
};
