"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";
import { PlaidConnect } from "@/features/plaid/components/plaid-connect";
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const SettingsCard = () => {
  const { data: connectedBank, isLoading: isLoadingConnectedBank } = useGetConnectedBank();

  if (isLoadingConnectedBank) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-xl">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[100px] w-full items-center justify-center">
            <Loader2 className="size-6 animate-spin text-slate-300" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-manrope line-clamp-1 text-lg font-semibold text-slate-800 md:text-xl">
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
