import type { RowData, Table } from "@tanstack/react-table";

import { DEFAULT_CURRENCY } from "@/lib/utils";

/**
 * Safely extracts the active global search query string from a TanStack Table context metadata object.
 */
export function getSearchTerm<T extends RowData>(table: Table<T>): string | undefined {
  return (table.options.meta as { searchTerm?: string } | undefined)?.searchTerm;
}

/**
 * Resolves the configuration currency code identifier stored inside the table metadata parameters.
 */
export function getCurrency<T extends RowData>(table: Table<T>): string {
  return (table.options.meta as { currency?: string } | undefined)?.currency ?? DEFAULT_CURRENCY;
}
