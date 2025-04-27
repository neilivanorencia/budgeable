"use client";

import { RowActions } from "@/components/row-actions";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction();
  const deleteMutation = useDeleteTransaction(id);

  return (
    <RowActions
      onEdit={() => onOpen(id)}
      onDelete={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
      confirmTitle="Delete this transaction?"
      confirmMessage="This will permanently remove the transaction from your records. This action cannot be undone."
      triggerClassName="size-8 p-0 focus-visible:ring-0"
    />
  );
};
