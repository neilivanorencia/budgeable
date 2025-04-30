import { useForm } from "react-hook-form";
import { z } from "zod";

import { DatePicker } from "@/components/date-picker";
import { FormActions } from "@/components/form-actions";
import { Select } from "@/components/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { transactionsInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

/**
 * Validates transaction form fields on the client.
 */
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

/**
 * Type inferred from the form validation schema.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * Type expected by the API endpoints, excluding the database record `id`.
 */
type ApiFormValues = Omit<z.input<typeof transactionsInsertSchema>, "id">;

/**
 * Configuration properties for handling form data state and event actions.
 */
type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: {
    label: string;
    value: string;
  }[];
  categoryOptions: {
    label: string;
    value: string;
  }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

/**
 * Handles the creation and modification of transaction records.
 */
export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  // Prepares the form field fallback defaults for initialization.
  const formDefaultValues = {
    date: defaultValues?.date || new Date(),
    accountId: defaultValues?.accountId || "",
    categoryId: defaultValues?.categoryId || "",
    payee: defaultValues?.payee || "",
    amount: defaultValues?.amount || "",
    notes: defaultValues?.notes || "",
  };

  // Hooks up validation rules and schema parameters to the form lifecycle tracker.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  /**
   * Transforms structural field parameters before dispatching data payload mutations.
   * @param values Parsed form data values verified through the local validation schema.
   */
  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    // Scales numerical floats to integers to prevent floating-point tracking errors in the database ledger.
    const amountInMiliunits = convertAmountToMiliunits(amount);

    onSubmit({
      ...values,
      amount: amountInMiliunits,
      categoryId: values.categoryId ?? "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Renders the calendar date picker interface field */}
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Renders the select dropdown menu for choosing or creating a financial account */}
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Account Name</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Renders the select dropdown menu for assigning or creating a budget category */}
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Category Name</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Renders a text input field for capturing the name of the payee entity */}
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Payee</FormLabel>
              <FormControl className="text-sm sm:text-base">
                <Input disabled={disabled} placeholder="Add payee" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Renders a numeric currency field configured for managing transaction value inputs */}
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Amount</FormLabel>
              <FormControl className="flex items-center text-sm sm:text-base">
                <AmountInput disabled={disabled} placeholder="0.00" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Renders an expanded text field layer for adding supplemental remarks or metadata */}
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

        {/* Renders actionable trigger buttons for managing form processing and record deletion updates */}
        <FormActions
          id={id}
          label="transaction"
          onDelete={onDelete}
          disabled={disabled}
          deleteClassName="transition-color w-full cursor-pointer border-2 border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600"
        />
      </form>
    </Form>
  );
};
