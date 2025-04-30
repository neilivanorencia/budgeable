import { useRef, useState } from "react";

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

/**
 * A imperative modal prompt hook for choosing or creating a financial account.
 * @returns A tuple containing the confirmation dialog component and the trigger confirm execution function.
 */
export const useSelectAccount = (): [
  () => React.ReactElement,
  () => Promise<string | undefined>,
] => {
  // Syncs available accounts collection list entries from the remote query cache.
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  // Forwards direct multi-select inline string creation requests to the underlying mutation engine.
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });

  // Normalizes the database record layout to match standard value/label option contract definitions.
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    value: account.id,
    label: account.name,
  }));

  // Tracks the pending state resolve reference pattern to support imperative promise invocations.
  const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(
    null
  );

  // Caches selected options internally to prevent re-rendering side-effects during option switches.
  const selectValue = useRef<string | undefined>(undefined);

  /**
   * Initializes the modal interface layout frame and pauses code execution until a resolution triggers.
   */
  const confirm = () =>
    new Promise<string | undefined>((resolve) => {
      setPromise({ resolve });
    });

  /**
   * Cleans up lingering active transaction state markers inside the active hook scope.
   */
  const handleClose = () => {
    setPromise(null);
  };

  /**
   * Resolves the pending workflow promise block with the confirmed target key identifier selection.
   */
  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  /**
   * Resolves the pending workflow promise block with undefined to indicate an aborted request session.
   */
  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  /**
   * Captures backdrop overlays or hardware-driven exit escape keys to ensure safe closure pathways.
   */
  const handleModalClose = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  /**
   * Imperative layout structure that renders a dialog menu targeting account configurations.
   */
  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise !== null} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select account</DialogTitle>
            <DialogDescription>Select an account to continue</DialogDescription>
          </DialogHeader>

          <Select
            placeholder="Select an account"
            options={accountOptions}
            onCreate={onCreateAccount}
            onChange={(value) => (selectValue.current = value)}
            disabled={accountQuery.isLoading || accountMutation.isPending}
          />

          <DialogFooter className="grid grid-cols-2 gap-x-2 pt-2 sm:flex">
            <Button
              variant="outline"
              className="transition-color cursor-pointer border-2 border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="transition-color cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
