"use client";

import { InferResponseType } from "hono";

import { Actions } from "@/app/(private)/categories/actions";
import { HighlightText } from "@/components/highlight-text";
import { actionsColumn, selectColumn, sortableHeader } from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/hono";
import { getSearchTerm } from "@/lib/table-meta";
import { ColumnDef } from "@tanstack/react-table";

type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0];

const DEFAULT_CATEGORY_COLOR = "#14b8a6";

export const columns: ColumnDef<ResponseType>[] = [
  selectColumn<ResponseType>(),
  {
    accessorKey: "name",
    header: sortableHeader("Name"),
    cell: ({ row, table }) => {
      const { name } = row.original;
      return <HighlightText text={name} searchTerm={getSearchTerm(table)} />;
    },
    size: 160,
  },
  {
    accessorKey: "color",
    header: sortableHeader("Color"),
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const color = row.original.color;
      const displayColor = color ?? DEFAULT_CATEGORY_COLOR;

      return (
        <div className="flex items-center gap-2">
          <span
            className="size-5 shrink-0 rounded-md border border-black/10"
            style={{ backgroundColor: displayColor }}
          />
          <span className="font-mono text-sm tracking-wide text-slate-600">
            {color ? color.toUpperCase() : "—"}
          </span>
        </div>
      );
    },
    size: 160,
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
    size: 380,
  },
  {
    accessorKey: "type",
    header: sortableHeader("Type"),
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <Badge variant={type === "income" ? "primary" : "destructive"} className="capitalize text-sm font-normal">
          {type}
        </Badge>
      );
    },
    size: 120,
  },
  actionsColumn<ResponseType>(({ row }) => (
    <div className="flex justify-end">
      <Actions id={row.original.id} />
    </div>
  )),
];
