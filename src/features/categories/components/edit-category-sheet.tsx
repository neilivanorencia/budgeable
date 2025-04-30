import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categoriesInsertSchema } from "@/db/schema";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";

/**
 * Validates category form fields against the selected schema properties.
 */
const formSchema = categoriesInsertSchema.pick({
  name: true,
  type: true,
  color: true,
  description: true,
  notes: true,
});

/**
 * Type representing the schema configuration for the category form values.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * An overlay sheet component providing an isolated environment to update or delete a category.
 */
export const EditCategorySheet = () => {
  // Accesses visibility control flags and the contextual item identifier for managing the sheet.
  const { isOpen, onClose, id } = useOpenCategory();

  // Instantiates a confirmation dialog modal sequence to prevent accidental record deletions.
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this category?",
    "This will permanently remove the category. Transactions using it will become uncategorized. This action cannot be undone."
  );

  // Core category entity query hooks.
  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory();
  const deleteMutation = useDeleteCategory(id);

  // Computes initialization loading flags to lock interaction until the category data resolves.
  const isLoading = categoryQuery.isLoading;

  // Computes background mutation processing flags to lock interactions during transport execution.
  const isPending = editMutation.isPending || deleteMutation.isPending;

  /**
   * Dispatches parsed and validated form fields to the category update mutation.
   * @param values Form inputs captured from the nested category form structure.
   */
  const onSubmit = (values: FormValues) => {
    if (!id) return;

    const validated = formSchema.parse(values);
    editMutation.mutate(
      { id, data: validated },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  /**
   * Prompts the user with a confirmation modal prior to triggering the deletion engine.
   */
  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  // Normalizes category fields into a structured default values object, applying a fallback color.
  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
        type: categoryQuery.data.type as FormValues["type"],
        color: categoryQuery.data.color ?? "#14b8a6",
        description: categoryQuery.data.description,
        notes: categoryQuery.data.notes,
      }
    : {
        name: "",
        type: "expense" as const,
        color: "#14b8a6",
        description: "",
        notes: "",
      };

  return (
    <>
      {/* Structural placement for the overlay confirmation dialog layer */}
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
          {/* Header context section describing active slide-out operations */}
          <SheetHeader>
            <SheetTitle className="font-manrope text-center text-xl font-bold">
              Edit Category
            </SheetTitle>
            <SheetDescription className="text-center">
              Update an existing category.
            </SheetDescription>
          </SheetHeader>

          {/* Displays a centered spinner while loading data, or maps the child input canvas */}
          {isLoading ? (
            <div className="absolute-inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
