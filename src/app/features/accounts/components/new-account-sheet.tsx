import { z } from "zod";

import { useCreateAccount } from "@/app/features/accounts/api/use-create-account";
import { AccountForm } from "@/app/features/accounts/components/account-form";
import { useNewAccount } from "@/app/features/accounts/hooks/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountsInsertSchema } from "@/db/schema";

const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    const validated = formSchema.parse(values);
    mutation.mutate(validated, {
      onSuccess: () => {
        onClose();
      },
    });
  };

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
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
