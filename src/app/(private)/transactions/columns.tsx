"use client";

import { format } from "date-fns";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";

import { Actions } from "@/app/(private)/transactions/actions";
import { AccountColumn } from "@/app/(private)/transactions/account-column";
import { CategoryColumn } from "@/app/(private)/transactions/category-column";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HighlightText } from "@/components/highlight-text";
import { client } from "@/lib/hono";
import { getSearchTerm } from "@/lib/table-meta";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex w-12 cursor-pointer items-center justify-center">
        <Checkbox
          className="cursor-pointer data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 focus-visible:ring-teal-500/50"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-12 cursor-pointer items-center justify-center">
        <Checkbox
          className="cursor-pointer data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 focus-visible:ring-teal-500/50"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    size: 48,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;

      return <span>{format(date, "dd MMMM, yyyy")}</span>;
    },
    size: 160,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      return (
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const payee = row.getValue("payee") as string;
      return <HighlightText text={payee} searchTerm={getSearchTerm(table)} />;
    },
    size: 200,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount") as string);

      return (
        <Badge
          variant={amount < 0 ? "destructive" : "primary"}
          className="text-sm font-normal"
        >
          {formatCurrency(amount)}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      return (
        <AccountColumn
          account={row.original.account}
          accountId={row.original.accountId}
          searchTerm={getSearchTerm(table)}
        />
      );
    },
    size: 160,
  },
  {
    id: "actions",
    size: 48,
    enableGlobalFilter: false,
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
