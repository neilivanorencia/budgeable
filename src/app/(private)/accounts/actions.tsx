"use client";

import { RowActions } from "@/components/row-actions";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
  id: string;
};

/**
 * Interactive table row actions menu wrapper for individual bank or financial accounts.
 */
export const Actions = ({ id }: Props) => {
  // Destructures modal state controls to focus on the target item signature
  const { onOpen } = useOpenAccount();

  // Prepares the mutation network event tied to this specific entity identifier
  const deleteMutation = useDeleteAccount(id);

  return (
    /* Composes contextual drop-down menus with pre-configured validation check titles and copy blocks */
    <RowActions
      onEdit={() => onOpen(id)}
      onDelete={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
      confirmTitle="Delete this account?"
      confirmMessage="This will permanently remove the account and all associated data. This action cannot be undone."
    />
  );
};
