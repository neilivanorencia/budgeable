"use client";

import { useUser } from "@clerk/nextjs";
import { PiConfetti } from "react-icons/pi";

/**
 * Displays a personalized greeting header card using authentication profiles.
 */
export const WelcomeMessage = () => {
  // Pulls active profile attributes from the client session layer.
  const { user } = useUser();

  return (
    <div className="mb-4 space-y-2">
      {/* Title greeting row containing name strings and contextual icons */}
      <div className="flex items-center">
        <h2 className="font-manrope text-2xl font-medium text-white md:text-4xl">
          Welcome! {user?.firstName}
        </h2>
        <PiConfetti className="ml-2 size-10 text-white" />
      </div>

      {/* Descriptive subtext outlining general utility behaviors */}
      <p className="text-sm text-slate-200 md:text-base">
        Track your expenses and budget activities here.
      </p>
    </div>
  );
};
