import CurrencyInput from "react-currency-input-field";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { IoInformation } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import { cn, getCurrencyFractionDigits, getCurrencySymbol } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(currency);
  const fractionDigits = getCurrencyFractionDigits(currency);

  const parsedValue = parseFloat(value);
  const isIncome = parsedValue >= 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    onChange((parseFloat(value) * -1).toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "absolute flex cursor-pointer items-center justify-center bg-transparent text-sm transition hover:bg-transparent sm:text-base",
                isIncome && "bg-transparent text-green-400 hover:bg-transparent",
                isExpense && "bg-transparent text-sky-400 hover:bg-transparent"
              )}
            >
              {!parsedValue && <IoInformation className="text-slate-400" />}
              {isIncome && <HiOutlinePlus className="size-4" />}
              {isExpense && <HiOutlineMinus className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Use [+] for income and [-] for expense</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix={symbol}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pl-10 text-sm shadow-none transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:border-2 md:shadow-xs",
          "focus-visible:border-teal-500"
        )}
        placeholder={placeholder}
        value={value}
        decimalsLimit={fractionDigits}
        decimalScale={fractionDigits}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="text-muted-foreground mt-2 text-xs">
        {isIncome && "This will count as income"}
      </p>
      <p className="text-muted-foreground mt-2 text-xs">
        {isExpense && "This will count as expense"}
      </p>
    </div>
  );
};
