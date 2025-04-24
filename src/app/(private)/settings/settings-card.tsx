"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";
import { PlaidConnect } from "@/features/plaid/components/plaid-connect";
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect";
import { cn } from "@/lib/utils";

export const SettingsCard = () => {
  const { data: connectedBank } = useGetConnectedBank();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-manrope line-clamp-1 text-xl font-medium text-slate-800 md:text-2xl">
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
        <Separator />
        <div className="space-y-4">
          <div className="flex flex-col gap-y-2 rounded-md p-3 md:flex-row md:items-center md:justify-between md:gap-x-4 md:p-4">
            <div>
              <p className="text-base font-semibold text-slate-800">Bank Account</p>
              <p className={cn("text-sm text-teal-500", !connectedBank && "text-rose-500")}>
                {connectedBank ? "Bank account connected" : "No bank account connected"}
              </p>
            </div>
            {connectedBank ? <PlaidDisconnect /> : <PlaidConnect />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
