"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

/**
 * A dropdown selector that filters ledger information based on active financial accounts.
 */
export const AccountFilter = () => {
  // Pulls navigation handlers and current state values from the active URL query string.
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extracts specific parameters or falls back to standard values.
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  // Fetches API remote states regarding total summaries and individual available options.
  const { isLoading: isLoadingSummary } = useGetSummary();

  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();

  /**
   * Serializes selected credentials back into the route address when toggling filters.
   */
  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    // Clears the identification parameter to ensure an empty selection resets the query filter context.
    if (newValue === "all") {
      query.accountId = "";
    }

    // Appends updated fields into a unified query sequence while omitting raw null definitions.
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLoadingSummary}
    >
      {/* Interactive toggle trigger displaying localized text values */}
      <SelectTrigger className="h-9 w-full cursor-pointer justify-center rounded-md border-none bg-white/10 px-3 text-center text-sm font-normal text-white transition outline-none hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 sm:w-auto lg:w-auto lg:justify-start [&_svg]:!text-white [&_svg]:!opacity-100">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>

      {/* Dropdown element containing selectable account items mapped from server arrays */}
      <SelectContent className="rounded-lg">
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
