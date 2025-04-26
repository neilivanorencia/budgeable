"use client";

import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";

import { Actions } from "@/app/(private)/accounts/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HighlightText } from "@/components/highlight-text";
import { client } from "@/lib/hono";
import { getSearchTerm } from "@/lib/table-meta";
import { ColumnDef } from "@tanstack/react-table";

export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0];

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  cash: "Cash",
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  ewallet: "E-Wallet",
  other: "Other",
};

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      return <HighlightText text={row.original.name} searchTerm={getSearchTerm(table)} />;
    },
    size: 180,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const description = row.original.description;
      return (
        <span className="text-muted-foreground block truncate text-sm">
          {description?.trim()
            ? <HighlightText text={description} searchTerm={getSearchTerm(table)} />
            : "—"
          }
        </span>
      );
    },
    size: 430,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <Badge variant="outline" className="text-sm font-normal">
          {ACCOUNT_TYPE_LABELS[type] ?? type}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge variant={status === "active" ? "primary" : "secondary"} className="capitalize text-sm font-normal">
          {status}
        </Badge>
      );
    },
    size: 110,
  },
  {
    id: "actions",
    size: 40,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Actions id={row.original.id} />
      </div>
    ),
  },
];
