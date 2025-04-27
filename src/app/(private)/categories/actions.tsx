"use client";

import { RowActions } from "@/components/row-actions";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenCategory();
  const deleteMutation = useDeleteCategory(id);

  return (
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
