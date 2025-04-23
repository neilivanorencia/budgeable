import { format } from "date-fns";
import * as React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        disabled={disabled}
        variant="outline"
        className={cn(
          "w-full justify-start border-2 bg-transparent text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={handleButtonClick}
      >
        <FaRegCalendarAlt className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : "Pick a date"}
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-[9999] mt-1 rounded-md border bg-white shadow-lg"
          style={{ zIndex: 9999 }}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={disabled}
            initialFocus
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
};
