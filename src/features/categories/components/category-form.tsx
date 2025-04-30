import { useForm } from "react-hook-form";
import { z } from "zod";

import { ColorPicker } from "@/components/color-picker";
import { FormActions } from "@/components/form-actions";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categoriesInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Static options defining valid classifications for a transaction category.
 */
const CATEGORY_TYPE_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
] as const;

/**
 * Client-side validation schema filtering allowed properties from the database schema.
 */
const formSchema = categoriesInsertSchema.pick({
  name: true,
  type: true,
  color: true,
  description: true,
  notes: true,
});

/**
 * Type representing the validated form values.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * Component configurations for controlling state initialization and actions.
 */
type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

/**
 * Form interface for creating or updating transaction category data.
 */
export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  // Registers the react-hook-form instance using the selected Zod schema.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  /**
   * Forwards validated form values to the parent submission handler.
   */
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Input field for entering the unique category name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Category Name</FormLabel>
              <FormControl className="text-sm sm:text-base">
                <Input disabled={disabled} placeholder="Add category name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Input field for adding a brief summary or category description */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Description</FormLabel>
              <FormControl className="text-sm sm:text-base">
                <Input
                  disabled={disabled}
                  placeholder="Add a description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dropdown selection menu for designating the transaction classification type */}
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer text-base shadow-none hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 md:border-2 md:text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Custom interactive picker component to assign a distinct category color theme */}
        <FormField
          name="color"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Color</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Text area input field for logging optional metadata notes or details */}
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Notes</FormLabel>
              <FormControl className="text-sm sm:text-base">
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Add some optional notes"
                  className="border shadow-none focus-visible:border-teal-500 md:border-2"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Core button actions panel component for dispatching form mutations */}
        <FormActions id={id} label="category" onDelete={onDelete} disabled={disabled} />
      </form>
    </Form>
  );
};
