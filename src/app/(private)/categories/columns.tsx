"use client";

import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";

import { Actions } from "@/app/(private)/categories/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table";

export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][0];

const DEFAULT_CATEGORY_COLOR = "#14b8a6";

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
    cell: ({ row }) => {
      const { name } = row.original;

      return <span>{name}</span>;
    },
    size: 160,
  },
  {
    accessorKey: "color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span className="text-muted-foreground block truncate text-sm">
          {description?.trim() ? description : "—"}
        </span>
      );
    },
    size: 380,
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
        <Badge variant={type === "income" ? "primary" : "destructive"} className="capitalize text-sm font-normal">
          {type}
        </Badge>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Actions id={row.original.id} />
      </div>
    ),
  },
];
