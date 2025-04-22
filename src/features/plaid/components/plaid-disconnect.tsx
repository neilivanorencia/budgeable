"use client";

import { Button } from "@/components/ui/button";
import { useDeleteConnectedBank } from "@/features/plaid/api/use-delete-connected-bank";
import { useConfirm } from "@/hooks/use-confirm";

export const PlaidDisconnect = () => {
  const [confirm, Dialog] = useConfirm(
    "Are you sure you want to disconnect your bank?",
    "This will disconnect your bank account, and all the associated data."
  );
  const deleteConnectedBank = useDeleteConnectedBank();

  const onClick = async () => {
    const confirmed = confirm();

    if (confirmed) {
      deleteConnectedBank.mutate();
    }
  };

  return (
    <>
      <Dialog />
      <Button
        disabled={deleteConnectedBank.isPending}
        onClick={onClick}
        className="transition-color w-full cursor-pointer bg-teal-500 text-white duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:mt-0 md:w-auto"
      >
        Disconnect Bank
      </Button>
    </>
  );
};
