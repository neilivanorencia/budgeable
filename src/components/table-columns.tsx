"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, HeaderContext } from "@tanstack/react-table";

export function selectColumn<T>(): ColumnDef<T> {
  return {
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
  };
}

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

export function actionsColumn<T>(cell: ColumnDef<T>["cell"], size = 40): ColumnDef<T> {
  return {
    id: "actions",
    size,
    enableGlobalFilter: false,
    cell,
  };
}
