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

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const headers = data[0];
  const rows = data.slice(1);

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

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

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

    const arrayOfData = mappedData.rows.map((row) => {
      return row.reduce((acc: Record<string, string | null>, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount ?? "")),
      date: format(parse(item.date ?? "", dateFormat, new Date()), outputFormat),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none shadow-none drop-shadow-none">
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
