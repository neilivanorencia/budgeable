"use client";

import * as React from "react";
import { BsTrash } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete selected items?",
    "This will permanently delete all selected items. This action cannot be undone."
  );

  const { currency } = useCurrency();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    meta: {
      searchTerm: globalFilter,
      currency,
    },
  });

  return (
    <div>
      <ConfirmDialog />
      <div className="flex flex-col gap-y-2 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full border text-sm shadow-none sm:max-w-sm sm:text-base md:border-2"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            disabled={disabled}
            className="w-full cursor-pointer border-none bg-rose-500 text-slate-100 shadow-none transition duration-300 ease-in-out outline-none hover:bg-rose-400 hover:text-slate-100 hover:shadow-md hover:shadow-rose-300/50 sm:ml-auto sm:w-auto"
            onClick={async () => {
              const ok = await confirm();

              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
          >
            <BsTrash className="size-4" />
            Delete ({table.getFilteredSelectedRowModel().rows.length} selected)
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-slate-700"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden text-slate-700"
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col-reverse gap-y-2 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
        <div className="text-muted-foreground mt-4 w-full text-center text-sm sm:mt-0 sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="grid w-full grid-cols-2 gap-x-2 font-normal sm:flex sm:w-auto sm:justify-end">
          <span className={!table.getCanPreviousPage() ? "cursor-not-allowed" : undefined}>
            <Button
              variant={table.getCanPreviousPage() ? "default" : "outline"}
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={
                table.getCanPreviousPage()
                  ? "w-full cursor-pointer bg-teal-500 shadow-none transition-colors duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
                  : "w-full pointer-events-none text-slate-800 md:w-auto"
              }
            >
              Previous
            </Button>
          </span>
          <span className={!table.getCanNextPage() ? "cursor-not-allowed" : undefined}>
            <Button
              variant={table.getCanNextPage() ? "default" : "outline"}
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={
                table.getCanNextPage()
                  ? "w-full cursor-pointer bg-teal-500 shadow-none transition-colors duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
                  : "w-full pointer-events-none text-slate-800 md:w-auto"
              }
            >
              Next
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}
