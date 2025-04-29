"use client";

import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDateRange } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";

/**
 * A date range filter component that syncs chosen dates directly with the active URL search parameters.
 */
export const DateFilter = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 639px)", false);

  // Extracts current values from the URL query string parameters.
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  // Falls back to a standard rolling thirty-day historical interval window.
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  // Constructs a valid operational runtime baseline from existing URL fields.
  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  /**
   * Formats the designated date boundaries and serializes them into the routing location address.
   */
  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  /**
   * Clears the current overlay state selection and forces a URL query string fallback reset.
   */
  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      {/* Interactive visual button revealing the operational text parameters */}
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="h-9 w-full cursor-pointer rounded-md border-none bg-white/10 px-3 text-left font-normal text-white transition outline-none hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 sm:w-auto lg:w-auto"
        >
          <span className="text-sm">{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </PopoverTrigger>

      {/* Structural selection overlay rendering calendar subgrids and submission triggers */}
      <PopoverContent
        className="flex w-full flex-col items-center p-0 lg:block lg:w-auto"
        align={isMobile ? "center" : "start"}
      >
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild>
            <Button
              className="transition-color w-1/2 cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
              onClick={onReset}
              disabled={!date?.from || !date?.to}
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              className="transition-color w-1/2 cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
