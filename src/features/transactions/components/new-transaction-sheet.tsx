import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { transactionsInsertSchema } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

/**
 * Zod validation schema configured for parsing new transaction form inputs.
 */
const formSchema = transactionsInsertSchema.omit({
  id: true,
});

/**
 * Type representing the expected structure of parsed transaction form values.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * An overlay sheet component providing an isolated environment to register a new transaction.
 */
export const NewTransactionSheet = () => {
  // Accesses routing control flags and state modifiers for controlling sheet visibility.
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

  // Resolves relational dependency options for budget categories.
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // Resolves relational dependency options for financial accounts.
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  // Computes background mutation processing flags to disable form fields during transport execution.
  const isPending =
    createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;

  // Computes initialization loading flags to lock interaction until the primary record data resolves.
  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  /**
   * Dispatches parsed and validated form fields to the data persistence mutation.
   * @param values Raw inputs collected from the transaction form wrapper.
   */
  const onSubmit = (values: FormValues) => {
    const validated = formSchema.parse(values);
    createMutation.mutate(validated, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
        {/* Header context section describing active modal operations */}
        <SheetHeader>
          <SheetTitle className="font-manrope text-center text-xl font-bold">
            New Transaction
          </SheetTitle>
          <SheetDescription className="text-center">
            Keep track of your budget by logging your transactions.
          </SheetDescription>
        </SheetHeader>

        {/* Displays a full-height centered loading spinner or maps the transactional input canvas */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-slate-200" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
