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

const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you?",
    "Deleting an account cannot be undone."
  );

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount();
  const deleteMutation = useDeleteAccount(id);

  const isLoading = accountQuery.isLoading;

  const isPending = editMutation.isPending || deleteMutation.isPending;

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

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
          <SheetHeader>
            <SheetTitle className="font-manrope text-center text-xl font-bold">
              Edit Account
            </SheetTitle>
            <SheetDescription className="text-center">
              Update an existing account details.
            </SheetDescription>
          </SheetHeader>
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
