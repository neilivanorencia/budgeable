import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { HighlightText } from "@/components/highlight-text";

type Props = {
  account: string;
  accountId: string;
  searchTerm?: string;
};

export const AccountColumn = ({ account, accountId, searchTerm }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <button type="button" onClick={onClick} className="flex cursor-pointer items-center text-left hover:underline">
      <HighlightText text={account} searchTerm={searchTerm} />
    </button>
  );
};
