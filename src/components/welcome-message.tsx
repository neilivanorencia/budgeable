"use client";

import { useUser } from "@clerk/nextjs";
import { PiConfetti } from "react-icons/pi";

export const WelcomeMessage = () => {
  const { user } = useUser();

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center">
        <h2 className="font-manrope text-2xl font-medium text-white md:text-4xl">
          Welcome! {user?.firstName}
        </h2>
        <PiConfetti className="ml-2 size-10 text-white" />
      </div>
      <p className="text-sm text-slate-200 md:text-base">
        This dashboard provides an overview of your expenses and account activity.
      </p>
    </div>
  );
};
