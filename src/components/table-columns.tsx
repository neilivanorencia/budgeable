"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, HeaderContext } from "@tanstack/react-table";

/**
 * Generates a structural selection checkbox column configuration for multi-row data table operations.
 */
export function selectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",

    // Renders the global page-level master toggle switch inside the header cell row
    header: ({ table }) => (
      <div className="flex w-12 cursor-pointer items-center justify-center">
        <Checkbox
          className="cursor-pointer focus-visible:ring-teal-500/50 data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),

    // Renders custom independent checkbox anchors localized to tracking structural items
    cell: ({ row }) => (
      <div className="flex w-12 cursor-pointer items-center justify-center">
        <Checkbox
          className="cursor-pointer focus-visible:ring-teal-500/50 data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500"
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
  };
}

/**
 * Creates a table column header cell that controls alphabetic or numeric sorting orders when clicked.
 */
export function sortableHeader<T>(label: string): ColumnDef<T>["header"] {
  const Header = ({ column }: HeaderContext<T, unknown>) => (
    <Button
      variant="ghost"
      className="hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
  Header.displayName = "SortableHeader";

  return Header;
}

/**
 * Builds a trailing layout structural column wrapper used to house interactive row operation context inputs.
 */
export function actionsColumn<T>(cell: ColumnDef<T>["cell"], size = 40): ColumnDef<T> {
  return {
    id: "actions",
    size,
    enableGlobalFilter: false,
    cell,
  };
}
