import { format, parse } from "date-fns";
import { useState } from "react";

import { ImportTable } from "@/app/(private)/transactions/import-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertAmountToMiliunits } from "@/lib/utils";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: Record<string, string | number | null>[]) => void;
};

/**
 * Multi-step data parsing component that handles raw CSV or matrix arrays.
 */
export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  // Tracks user-selected database destination labels assigned to individual table headers
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  // Extracts the baseline header definitions separate from target values
  const headers = data[0];
  const rows = data.slice(1);

  // Clears out matching previous column assignments to prevent multi-column mapping conflicts
  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = { ...prevSelectedColumns };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  // Computes current assignment completeness to enable continuation steps
  const progress = Object.values(selectedColumns).filter(Boolean).length;

  // Transforms the physical user-mapped text matrix into normalized system database records
  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    // Filter mapping that discards cell indexes flagged for omission by the user
    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      rows: rows
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null) ? [] : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    // Compiles individual data lines into keyed javascript object collections
    const arrayOfData = mappedData.rows.map((row) => {
      return row.reduce((acc: Record<string, string | null>, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    // Sanitizes property data strings into functional system types and standard time formats
    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount ?? "")),
      date: format(parse(item.date ?? "", dateFormat, new Date()), outputFormat),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="gap-0 border-none shadow-none drop-shadow-none">
        {/* Header container housing layout controls and tracking mapping status */}
        <CardHeader className="flex flex-col items-center gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="font-manrope line-clamp-1 text-xl font-medium text-slate-800 md:text-2xl">
            Import Transaction
          </CardTitle>
          <div className="flex w-full items-center justify-end gap-x-2 md:w-auto">
            <Button
              className="transition-color w-[calc(50%-0.25rem)] cursor-pointer bg-rose-500 shadow-none duration-300 ease-in-out hover:bg-rose-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="transition-color w-[calc(50%-0.25rem)] cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </CardHeader>
        {/* Main data area displaying the interactable header-mapping column spreadsheet */}
        <CardContent>
          <ImportTable
            headers={headers}
            rows={rows}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
