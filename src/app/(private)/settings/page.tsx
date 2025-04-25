"use client";

import { SettingsCard } from "@/app/(private)/settings/settings-card";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";

const SettingsPage = () => {
  const { isLoading } = useGetConnectedBank();

  if (isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="flex h-[220px] items-center justify-center gap-0 border-none shadow-none">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <SettingsCard />
    </div>
  );
};

export default SettingsPage;
