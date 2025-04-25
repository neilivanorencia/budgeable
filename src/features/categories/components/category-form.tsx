import { useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/color-picker";
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

const CATEGORY_TYPE_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
] as const;

const formSchema = categoriesInsertSchema.pick({
  name: true,
  type: true,
  color: true,
  description: true,
  notes: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer shadow-none md:border-2 hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 text-base md:text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_TYPE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="color"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Color</FormLabel>
              <FormControl>
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
        <div className={id ? "grid grid-cols-2 gap-x-2" : ""}>
          <Button
            className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
            disabled={disabled}
          >
            {id ? "Save changes" : "Create category"}
          </Button>

          {!!id && (
            <Button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              variant="outline"
              className="transition-color w-full cursor-pointer border border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600 md:border-2"
            >
              <BsTrash className="size-4" />
              Delete category
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
