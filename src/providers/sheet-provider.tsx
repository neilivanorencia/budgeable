"use client";

import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/app/features/accounts/components/new-account-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted()) return null;

  return (
    <>
      <NewAccountSheet />
    </>
  );
};
