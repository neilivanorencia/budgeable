import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { HighlightText } from "@/components/highlight-text";

type Props = {
  account: string;
  accountId: string;
  searchTerm?: string;
};

/**
 * Presentational table column component displaying an interactable account name link.
 */
export const AccountColumn = ({ account, accountId, searchTerm }: Props) => {
  // Destructures sheet visibility controller method to trigger interactive modals
  const { onOpen: onOpenAccount } = useOpenAccount();

  // Coordinates clicking actions to switch focus towards the targeted entity ID
  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center text-left hover:underline"
    >
      {/* Renders text spans dynamically containing text matching decoration styles */}
      <HighlightText text={account} searchTerm={searchTerm} />
    </button>
  );
};
