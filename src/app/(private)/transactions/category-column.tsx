import { TriangleAlert } from "lucide-react";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { HighlightText } from "@/components/highlight-text";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
  searchTerm?: string;
};

/**
 * Presentational table column component displaying an interactable category label.
 */
export const CategoryColumn = ({ id, category, categoryId, searchTerm }: Props) => {
  // Destructures state control hooks to toggle editing sheet overlays
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  // Redirects the focus path based on the structural validity of the classification property
  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };

  return (
    /* Structural action trigger adapting textual context properties and alert warning elements dynamically */
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center text-left hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="size-4 shrink-0 text-rose-500" />}
      {category ? <HighlightText text={category} searchTerm={searchTerm} /> : "Uncategorized"}
    </button>
  );
};
