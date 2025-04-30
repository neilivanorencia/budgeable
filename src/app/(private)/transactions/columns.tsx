"use client";

import { format } from "date-fns";
import { InferResponseType } from "hono";

import { Actions } from "@/app/(private)/transactions/actions";
import { AccountColumn } from "@/app/(private)/transactions/account-column";
import { CategoryColumn } from "@/app/(private)/transactions/category-column";
import { HighlightText } from "@/components/highlight-text";
import { actionsColumn, selectColumn, sortableHeader } from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/hono";
import { getCurrency, getSearchTerm } from "@/lib/table-meta";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

// Extracts the core transaction shape from the upstream API endpoint signature definition
type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

/**
 * Data table column definitions for managing the transaction data matrix view.
 */
export const columns: ColumnDef<ResponseType>[] = [
  // Generates standard checkbox row selection control inputs
  selectColumn<ResponseType>(),
  {
    accessorKey: "date",
    header: sortableHeader("Date"),
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;

      return <span>{format(date, "dd MMMM, yyyy")}</span>;
    },
    size: 160,
  },
  {
    accessorKey: "category",
    header: sortableHeader("Category"),
    cell: ({ row, table }) => {
      return (
        /* Renders the classification label or redirects towards transactional recovery panels */
        <CategoryColumn
          id={row.original.id}
          category={row.original.category}
          categoryId={row.original.categoryId}
          searchTerm={getSearchTerm(table)}
        />
      );
    },
    size: 160,
  },
  {
    accessorKey: "payee",
    header: sortableHeader("Payee"),
    cell: ({ row, table }) => {
      const payee = row.getValue("payee") as string;
      return <HighlightText text={payee} searchTerm={getSearchTerm(table)} />;
    },
    size: 200,
  },
  {
    accessorKey: "amount",
    header: sortableHeader("Amount"),
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("amount") as string);
      const currency = getCurrency(table);

      return (
        /* Applies alternative visual accent variations matching income vs expenditure values */
        <Badge variant={amount < 0 ? "destructive" : "primary"} className="text-sm font-normal">
          {formatCurrency(amount, currency)}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "account",
    header: sortableHeader("Account"),
    cell: ({ row, table }) => {
      return (
        /* Renders the relational holding account layer link */
        <AccountColumn
          account={row.original.account}
          accountId={row.original.accountId}
          searchTerm={getSearchTerm(table)}
        />
      );
    },
    size: 160,
  },
  // Generates trailing standalone action dropdown triggers tracking individual record identifiers
  actionsColumn<ResponseType>(({ row }) => <Actions id={row.original.id} />, 48),
];
