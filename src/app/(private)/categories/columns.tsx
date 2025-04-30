"use client";

import { InferResponseType } from "hono";

import { Actions } from "@/app/(private)/categories/actions";
import { HighlightText } from "@/components/highlight-text";
import { actionsColumn, selectColumn, sortableHeader } from "@/components/table-columns";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/hono";
import { getSearchTerm } from "@/lib/table-meta";
import { ColumnDef } from "@tanstack/react-table";

// Extracts the core category data structure from the upstream Hono API endpoint schema definition
type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0];

// Standard fallback color configuration used if a specific classification token lacks an explicit color code
const DEFAULT_CATEGORY_COLOR = "#14b8a6";

/**
 * Data table column definitions for managing the financial categories data matrix view.
 */
export const columns: ColumnDef<ResponseType>[] = [
  // Generates standard checkbox row selection control inputs
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
        /* Render cell layout hosting a colored inline badge alongside the uppercase hexadecimal value */
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
          {description?.trim() ? (
            <HighlightText text={description} searchTerm={getSearchTerm(table)} />
          ) : (
            "—"
          )}
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
        /* Maps distinct visual color variants to separate profit flows from expenditures */
        <Badge
          variant={type === "income" ? "primary" : "destructive"}
          className="text-sm font-normal capitalize"
        >
          {type}
        </Badge>
      );
    },
    size: 120,
  },
  // Generates trailing standalone action dropdown triggers tracking individual record identifiers
  actionsColumn<ResponseType>(({ row }) => (
    <div className="flex justify-end">
      <Actions id={row.original.id} />
    </div>
  )),
];
