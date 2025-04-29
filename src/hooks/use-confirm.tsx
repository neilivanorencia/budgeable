import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Custom React hook that generates a programmatic confirmation overlay dialog modal window.
 */
export const useConfirm = (
  title: string,
  description: string
): [() => React.ReactElement, () => Promise<boolean>] => {
  // Retains the pending async task reference pointer used to handle confirmation outcomes.
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  /**
   * Spawns a deferred Promise layer that pauses execution, awaiting explicit user resolution.
   */
  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });

  /**
   * Resets local state parameters, closing down active modal viewports.
   */
  const handleClose = () => {
    setPromise(null);
  };

  /**
   * Fulfills the intercepted promise transaction layer, validating the targeted operation pathway.
   */
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  /**
   * Fulfills the intercepted promise transaction layer, rejecting the targeted operation pathway safely.
   */
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  /**
   * Captures automatic layout click-away events to ensure the interceptor resolves gracefully.
   */
  const handleModalClose = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  /**
   * Presentational alert dialog layout component injected into consumer component DOM trees.
   */
  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise !== null} onOpenChange={handleModalClose}>
        <DialogContent>
          {/* Header row tracking confirmation labels and descriptive context targets */}
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {/* Control bar mounting action triggers side-by-side with localized styling rules */}
          <DialogFooter className="grid grid-cols-2 gap-x-2 pt-2 sm:flex">
            <Button
              variant="outline"
              className="transition-color cursor-pointer border-2 border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="transition-color cursor-pointer bg-rose-500 shadow-none duration-300 ease-in-out hover:bg-rose-400 hover:shadow-lg hover:shadow-rose-200/50"
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
