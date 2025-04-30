import { z } from "zod";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountsInsertSchema } from "@/db/schema";

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
 * An overlay sheet component providing an isolated environment to create a new financial account.
 */
export const NewAccountSheet = () => {
  // Accesses routing control flags and state modifiers for controlling sheet visibility.
  const { isOpen, onClose } = useNewAccount();

  // Instantiates the API mutation controller for record creation.
  const mutation = useCreateAccount();

  /**
   * Dispatches parsed and validated form fields to the account creation mutation.
   * @param values Form inputs captured from the nested account form structure.
   */
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
        {/* Header context section describing active slide-out operations */}
        <SheetHeader>
          <SheetTitle className="font-manrope text-center text-xl font-bold">
            New Account
          </SheetTitle>
          <SheetDescription className="text-center">
            Start tracking your finances by adding a new account.
          </SheetDescription>
        </SheetHeader>

        {/* Renders the interactive account form layout pre-populated with initialization fallbacks */}
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
            type: "other",
            status: "active",
            description: "",
            notes: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
