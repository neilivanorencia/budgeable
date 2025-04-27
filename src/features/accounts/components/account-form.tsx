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

const ACCOUNT_TYPE_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit", label: "Credit Card" },
  { value: "investment", label: "Investment" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "other", label: "Other" },
] as const;

const ACCOUNT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;

const formSchema = accountsInsertSchema.pick({
  name: true,
  type: true,
  status: true,
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

export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <SelectTrigger className="w-full cursor-pointer shadow-none md:border-2 hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
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
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-slate-800">Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer shadow-none md:border-2 hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0 text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_STATUS_OPTIONS.map((option) => (
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
        <FormActions id={id} label="account" onDelete={onDelete} disabled={disabled} />
      </form>
    </Form>
  );
};
