"use client";

import { RowActions } from "@/components/row-actions";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";

type Props = {
  id: string;
};

/**
 * Interactive table row actions menu wrapper for individual financial categories.
 */
export const Actions = ({ id }: Props) => {
  // Destructures modal state controls to focus on the target item signature
  const { onOpen } = useOpenCategory();

  // Prepares the mutation network event tied to this specific entity identifier
  const deleteMutation = useDeleteCategory(id);

  return (
    /* Composes contextual drop-down menus with pre-configured validation check titles and copy blocks */
    <RowActions
      onEdit={() => onOpen(id)}
      onDelete={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
      confirmTitle="Delete this category?"
      confirmMessage="This will permanently remove the category. Transactions using it will become uncategorized. This action cannot be undone."
      triggerClassName="size-8 p-0 focus-visible:ring-0"
    />
  );
};
