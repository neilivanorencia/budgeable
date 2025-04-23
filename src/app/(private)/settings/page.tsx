"use client";

import { SettingsCard } from "@/app/(private)/settings/settings-card";
import { SettingsSkeleton } from "@/components/skeletons/page-skeleton";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";

const SettingsPage = () => {
  const { isLoading } = useGetConnectedBank();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <SettingsCard />
    </div>
  );
};

export default SettingsPage;
