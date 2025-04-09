import { z } from "zod";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountsInsertSchema } from "@/db/schema";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";

const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const mutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    const validated = formSchema.parse(values);
    mutation.mutate(validated, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name,
  } : {
    name: "",
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-teal-50 px-4 pt-6">
        <SheetHeader>
          <SheetTitle className="font-manrope text-center text-xl font-bold">
            New Account
          </SheetTitle>
          <SheetDescription className="text-center">
            Start tracking your finances by adding a new account.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={defaultValues}
        />
      </SheetContent>
    </Sheet>
  );
};
