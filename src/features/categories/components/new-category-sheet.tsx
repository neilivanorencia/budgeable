import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categoriesInsertSchema } from "@/db/schema";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

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
 * An overlay sheet component providing an isolated environment to create a new category.
 */
export const NewCategorySheet = () => {
  // Accesses routing control flags and state modifiers for controlling sheet visibility.
  const { isOpen, onClose } = useNewCategory();

  // Instantiates the API mutation controller for record creation.
  const mutation = useCreateCategory();

  /**
   * Dispatches parsed and validated form fields to the category creation mutation.
   * @param values Form inputs captured from the nested category form structure.
   */
  const onSubmit = (values: FormValues) => {
    const validated = formSchema.parse(values);
    mutation.mutate(validated, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
        {/* Header context section describing active slide-out operations */}
        <SheetHeader>
          <SheetTitle className="font-manrope text-center text-xl font-bold">
            New Category
          </SheetTitle>
          <SheetDescription className="text-center">
            Start organizing transactions by creating a new category.
          </SheetDescription>
        </SheetHeader>

        {/* Renders the interactive category form layout pre-populated with initialization fallbacks */}
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
            type: "expense",
            color: "#14b8a6",
            description: "",
            notes: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
