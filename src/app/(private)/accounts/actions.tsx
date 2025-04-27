"use client";

import { RowActions } from "@/components/row-actions";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();
  const deleteMutation = useDeleteAccount(id);

  return (
    <RowActions
      onEdit={() => onOpen(id)}
      onDelete={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
      confirmTitle="Delete this account?"
      confirmMessage="This will permanently remove the account and all associated data. This action cannot be undone."
    />
  );
};
