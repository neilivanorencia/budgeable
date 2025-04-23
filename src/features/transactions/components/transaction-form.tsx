import { useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { z } from "zod";

import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { transactionsInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiSchema = transactionsInsertSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

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
  const formDefaultValues = {
    date: defaultValues?.date || new Date(),
    accountId: defaultValues?.accountId || "",
    categoryId: defaultValues?.categoryId || "",
    payee: defaultValues?.payee || "",
    amount: defaultValues?.amount || "",
    notes: defaultValues?.notes || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);

    onSubmit({
      ...values,
      amount: amountInMiliunits,
      categoryId: values.categoryId ?? "",
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  className="border-2 focus-visible:border-teal-500"
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
            {id ? "Save changes" : "Create transaction"}
          </Button>

          {!!id && (
            <Button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              variant="outline"
              className="transition-color w-full cursor-pointer border-2 border-teal-500 text-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-50 hover:text-teal-600"
            >
              <BsTrash className="size-4" />
              Delete transaction
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
