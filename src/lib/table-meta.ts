import type { RowData, Table } from "@tanstack/react-table";

export function getSearchTerm<T extends RowData>(table: Table<T>): string | undefined {
  return (table.options.meta as { searchTerm?: string } | undefined)?.searchTerm;
}
