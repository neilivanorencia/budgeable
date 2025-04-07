import { useNewAccount } from "@/app/features/accounts/hooks/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-teal-50">
        <SheetHeader>
          <SheetTitle className="text-center">New Account</SheetTitle>
          <SheetDescription className="text-center">
            Start tracking your finances by adding a new account.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
