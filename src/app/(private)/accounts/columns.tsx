"use client";

import { InferResponseType } from "hono";

import { Actions } from "@/app/(private)/accounts/actions";
import { HighlightText } from "@/components/highlight-text";
import { actionsColumn, selectColumn, sortableHeader } from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/hono";
import { getSearchTerm } from "@/lib/table-meta";
import { ColumnDef } from "@tanstack/react-table";

type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][0];

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
  selectColumn<ResponseType>(),
  {
    accessorKey: "name",
    header: sortableHeader("Name"),
    cell: ({ row, table }) => {
      return <HighlightText text={row.original.name} searchTerm={getSearchTerm(table)} />;
    },
    size: 180,
  },
  {
    accessorKey: "description",
    header: sortableHeader("Description"),
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
    header: sortableHeader("Type"),
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
    header: sortableHeader("Status"),
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
  actionsColumn<ResponseType>(({ row }) => (
    <div className="flex justify-end">
      <Actions id={row.original.id} />
    </div>
  )),
];
