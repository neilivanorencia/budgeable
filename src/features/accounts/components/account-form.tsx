import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { accountsInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Static options mapping acceptable financial account asset types.
 */
const ACCOUNT_TYPE_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit", label: "Credit Card" },
  { value: "investment", label: "Investment" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "other", label: "Other" },
] as const;

/**
 * Static availability modifiers designating account lifestyle validation states.
 */
const ACCOUNT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;

/**
 * Client-side validation schema filtering allowed properties from the database schema.
 */
const formSchema = accountsInsertSchema.pick({
  name: true,
  type: true,
  status: true,
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
 * Form interface for creating or updating financial account data registries.
 */
export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
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
        {/* Input field for entering the descriptive account title */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Account Name</FormLabel>
              <FormControl className="text-sm sm:text-base">
                <Input disabled={disabled} placeholder="Add account name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Input field for adding a brief summary or account context */}
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

        {/* Dropdown selection menu for designating the financial classification asset profile */}
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer text-sm shadow-none hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 md:border-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Dropdown status toggler to classify historical data relevance filters */}
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer text-sm shadow-none hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 md:border-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <FormActions id={id} label="account" onDelete={onDelete} disabled={disabled} />
      </form>
    </Form>
  );
};
