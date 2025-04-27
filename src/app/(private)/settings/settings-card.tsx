"use client";

import { Select } from "@/components/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateCurrency } from "@/features/settings/api/use-update-currency";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";
import { PlaidConnect } from "@/features/plaid/components/plaid-connect";
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect";
import { useConfirm } from "@/hooks/use-confirm";
import { CURRENCY_OPTIONS } from "@/lib/currencies";
import { cn } from "@/lib/utils";

export const SettingsCard = () => {
  const { data: connectedBank } = useGetConnectedBank();
  const { currency } = useCurrency();
  const updateCurrency = useUpdateCurrency();

  const [ConfirmDialog, confirm] = useConfirm(
    "Change currency?",
    "Existing amounts will be converted to the selected currency at today's exchange rate. This cannot be automatically reverted."
  );

  const onCurrencyChange = async (value?: string) => {
    if (!value || value === currency) return;

    const ok = await confirm();

    if (ok) {
      updateCurrency.mutate({ currency: value });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="gap-0 border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-manrope line-clamp-1 text-center text-xl font-medium text-slate-800 md:text-left md:text-2xl">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div>
            <div className="flex flex-col gap-y-2 rounded-md p-3 md:flex-row md:items-center md:justify-between md:gap-x-4 md:px-0 md:py-4">
              <div>
                <p className="text-base font-medium text-slate-800">Currency</p>
                <p className="text-sm text-slate-600">
                  Amounts are displayed and stored in this currency.
                </p>
              </div>
              <div className={cn("w-full md:w-72", updateCurrency.isPending && "cursor-not-allowed")}>
                <div className={cn(updateCurrency.isPending && "pointer-events-none opacity-70")}>
                  <Select
                    placeholder="Select currency"
                    options={CURRENCY_OPTIONS}
                    value={currency}
                    onChange={onCurrencyChange}
                    disabled={updateCurrency.isPending}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 rounded-md p-3 md:flex-row md:items-center md:justify-between md:gap-x-4 md:px-0 md:py-4">
              <div>
                <p className="text-base font-medium text-slate-800">Bank Account</p>
                <p className={cn("text-sm text-teal-500", !connectedBank && "text-rose-500")}>
                  {connectedBank ? "Bank account connected" : "No bank account connected."}
                </p>
              </div>
              {connectedBank ? <PlaidDisconnect /> : <PlaidConnect />}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
