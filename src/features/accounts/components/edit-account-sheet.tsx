import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountsInsertSchema } from "@/db/schema";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";

/**
 * Validates account form fields against the selected schema properties.
 */
const formSchema = accountsInsertSchema.pick({
  name: true,
  type: true,
  status: true,
  description: true,
  notes: true,
});

/**
 * Type representing the schema configuration for the account form values.
 */
type FormValues = z.input<typeof formSchema>;

/**
 * An overlay sheet component providing an isolated environment to update or delete a financial account.
 */
export const EditAccountSheet = () => {
  // Accesses visibility control flags and the contextual item identifier for managing the sheet.
  const { isOpen, onClose, id } = useOpenAccount();

  // Instantiates a confirmation dialog modal sequence to prevent accidental record deletions.
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this account?",
    "This will permanently remove the account and all its data. This action cannot be undone."
  );

  // Core account entity query hooks.
  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount();
  const deleteMutation = useDeleteAccount(id);

  // Computes initialization loading flags to lock interaction until the account data resolves.
  const isLoading = accountQuery.isLoading;

  // Computes background mutation processing flags to lock interactions during transport execution.
  const isPending = editMutation.isPending || deleteMutation.isPending;

  /**
   * Dispatches parsed and validated form fields to the account update mutation.
   * @param values Form inputs captured from the nested account form structure.
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

  // Normalizes account fields into a structured default values object with explicit type casting.
  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
        type: accountQuery.data.type as FormValues["type"],
        status: accountQuery.data.status as FormValues["status"],
        description: accountQuery.data.description,
        notes: accountQuery.data.notes,
      }
    : {
        name: "",
        type: "other" as const,
        status: "active" as const,
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
              Edit Account
            </SheetTitle>
            <SheetDescription className="text-center">
              Update an existing account details.
            </SheetDescription>
          </SheetHeader>

          {/* Displays a centered spinner while loading data, or maps the child input canvas */}
          {isLoading ? (
            <div className="absolute-inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <AccountForm
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
