import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "date", "payee"];

/**
 * Dropdown selector component mounted in file import table headers.
 */
export const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Props) => {
  // Extracts the current field mapping rule assigned to this specific column index
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    /* Interactive dropdown field passing tracking attributes down to change listeners */
    <Select value={currentSelection || ""} onValueChange={(value) => onChange(columnIndex, value)}>
      <SelectTrigger
        className={cn(
          "border-none bg-transparent capitalize outline-none focus:ring-transparent focus:ring-offset-0",
          currentSelection && "text-teal-500"
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          // Disables the current option if it is already claimed by an alternative column
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option;

          return (
            <SelectItem key={index} value={option} disabled={disabled} className="capitalize">
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
