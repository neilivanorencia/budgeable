"use client";

import { Loader2 } from "lucide-react";
import { LuPlus } from "react-icons/lu";

import { columns } from "@/app/(private)/accounts/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

/**
 * Dashboard page managing financial account records and batch operations.
 */
const AccountsPage = () => {
  // Global hooks handling individual creation sheets, account querying, and deletion mutations
  const newAccount = useNewAccount();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];
  const deleteAccounts = useBulkDeleteAccounts();

  // Computes active data manipulation states to freeze layout control triggers
  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  // Renders a standard isolated animation spinner panel while network streams execute queries
  if (accountsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="flex h-80 items-center justify-center gap-0 border-none shadow-none drop-shadow-none">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="gap-0 border-none shadow-none drop-shadow-none">
        {/* Core header element hosting layout titles and item registration controls */}
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="font-manrope line-clamp-1 text-xl font-medium text-slate-800 md:text-2xl">
            Accounts Page
          </CardTitle>
          <Button
            className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
            onClick={newAccount.onOpen}
          >
            <LuPlus className="size-4" />
            Add new
          </Button>
        </CardHeader>
        {/* Presentational content layout displaying table rows, custom query filters, and bulk item removal triggers */}
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
