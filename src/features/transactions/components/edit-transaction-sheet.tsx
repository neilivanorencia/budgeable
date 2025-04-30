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
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";

/**
 * Zod validation schema configured for parsing transaction form inputs.
 */
const formSchema = transactionsInsertSchema.omit({
  id: true,
});

/**
 * Type representing the expected structure of parsed transaction form values.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * An overlay sheet component providing an isolated environment to update or delete a transaction.
 */
export const EditTransactionSheet = () => {
  // Accesses routing control flags and the contextual item identifier for managing the sheet.
  const { isOpen, onClose, id } = useOpenTransaction();

  // Instantiates an asynchronous modal confirmation sequence for handling records deletion securely.
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this transaction?",
    "This will permanently remove the transaction from your records. This action cannot be undone."
  );

  // Core transaction entity query hooks.
  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction();
  const deleteMutation = useDeleteTransaction(id);

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

  // Computes initialization loading flags to lock interaction until the primary record data resolves.
  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

  // Computes background mutation processing flags to disable form fields during transport execution.
  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  /**
   * Dispatches parsed and validated form fields to the data persistence mutation.
   * @param values Raw inputs collected from the transaction form wrapper.
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
   * Prompts the user with a confirmation modal prior to triggering the record deletion engine.
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

  // Normalizes transaction data fields into a structured default value object, formatting dates and amounts safely.
  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  return (
    <>
      {/* Structural placement for the overlay dialog markup wrapper */}
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
          {/* Header context section describing active modal operations */}
          <SheetHeader>
            <SheetTitle className="font-manrope text-center text-xl font-bold">
              Edit Transaction
            </SheetTitle>
            <SheetDescription className="text-center">
              Update an existing transaction details.
            </SheetDescription>
          </SheetHeader>

          {/* Displays a full-height centered loading spinner or maps the transactional input canvas */}
          {isLoading ? (
            <div className="absolute-inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
