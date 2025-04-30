"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Papa from "papaparse";
import { LuDownload, LuPlus } from "react-icons/lu";
import { toast } from "sonner";

import { columns } from "@/app/(private)/transactions/columns";
import { ImportCard } from "@/app/(private)/transactions/import-card";
import { UploadButton } from "@/app/(private)/transactions/upload-button";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

// Enum managing the display variants of the transactions dashboard panel
enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

// Blueprint initial state for incoming parsed CSV spreadsheet sets
const INITIAL_IMPORT_RESULTS = {
  data: [] as string[][],
  errors: [] as unknown[],
  meta: {} as Record<string, unknown>,
};

/**
 * Smart dashboard page managing transaction records, ledger lists, and data integrations.
 */
const TransactionsPage = () => {
  // Configures the custom validation confirmation prompt modal used to assign targeted accounts
  const [AccountDialog, confirm] = useSelectAccount();

  // Local state tracking the current dashboard display variant view mode
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  // Activates the spreadsheet staging panel upon successful raw file ingestion
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  // Reverts view modes back to the transaction log list layout view
  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  // Hooks querying global currency preference setups and entity creation/deletion mutations
  const { currency } = useCurrency();
  const newTransaction = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();

  // Computes active data manipulation states to freeze layout control triggers
  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  // Converts transaction rows on the client into an unparsed downloadable CSV string asset
  const handleExport = () => {
    const data = transactions.map((row) => ({
      Date: format(new Date(row.date), "yyyy-MM-dd"),
      Account: row.account,
      Category: row.category,
      Payee: row.payee,
      [`Amount (${currency})`]: row.amount,
      Notes: row.notes ?? "",
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${format(new Date(), "yyyy-MM-dd")}_budgeable.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Triggers target account lookups and binds selection identifiers to ingestion bulk sets
  const onSubmitImport = async (values: Record<string, string | number | null>[]) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("No account selected");
    }

    const data = (values as unknown as (typeof transactionSchema.$inferInsert)[]).map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        toast.success("Transactions created");
        onCancelImport();
      },
      onError: () => {
        toast.error("Failed to create transactions");
      },
    });
  };

  // Renders standard isolated animation spinner panels while network streams execute queries
  if (transactionsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="flex h-80 items-center justify-center gap-0 border-none shadow-none drop-shadow-none">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </Card>
      </div>
    );
  }

  // Renders the spreadsheet classification mapper layout block if file staging paths trigger
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
      </>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="gap-0 border-none shadow-none drop-shadow-none">
        {/* Core header element hosting main timeline titles and bulk data manipulation controls */}
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="font-manrope line-clamp-1 text-xl font-medium text-slate-800 md:text-2xl">
            Transactions History
          </CardTitle>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
            <Button
              className="transition-color w-[calc(50%-0.25rem)] cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
              onClick={newTransaction.onOpen}
            >
              <LuPlus className="size-4" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
            <Button
              className="transition-color w-full cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
              onClick={handleExport}
              disabled={isDisabled || transactions.length === 0}
            >
              <LuDownload className="size-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        {/* Presentational content layout displaying columns data, searching, and custom removal queries */}
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
