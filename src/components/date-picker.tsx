import { format } from "date-fns";
import * as React from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { FaRegCalendarAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  const displayDate = value || new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full cursor-pointer justify-start border-2 bg-transparent text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <FaRegCalendarAlt className="size-4" />
          {format(displayDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
