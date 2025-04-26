import type { RowData, Table } from "@tanstack/react-table";

import { DEFAULT_CURRENCY } from "@/lib/utils";

export function getSearchTerm<T extends RowData>(table: Table<T>): string | undefined {
  return (table.options.meta as { searchTerm?: string } | undefined)?.searchTerm;
}

export function getCurrency<T extends RowData>(table: Table<T>): string {
  return (
    (table.options.meta as { currency?: string } | undefined)?.currency ?? DEFAULT_CURRENCY
  );
}
