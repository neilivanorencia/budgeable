"use client";

import { useEffect, useState } from "react";

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";

/**
 * Global provider wrapper that mounts application-wide slide-out sheets and modals.
 */
export const SheetProvider = () => {
  // Flag tracking whether the component has successfully mounted into the client DOM tree.
  const [isMounted, setIsMounted] = useState(false);

  // Flips mounting state immediately following initial layout initialization.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Suppresses server-side pre-rendering output to avoid multi-layer layout hydration errors.
  if (!isMounted) return null;

  return (
    <>
      {/* Global state overlay panels tracking entity creation and editing workflows */}
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
