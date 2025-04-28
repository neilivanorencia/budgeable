import { clsx, type ClassValue } from "clsx";
import { format, eachDayOfInterval, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export const DEFAULT_CURRENCY = "USD";

export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY) {
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}

export function getCurrencySymbol(currency: string = DEFAULT_CURRENCY) {
  return (
    Intl.NumberFormat(undefined, { style: "currency", currency })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  );
}

export function getCurrencyFractionDigits(currency: string = DEFAULT_CURRENCY) {
  return Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions()
    .maximumFractionDigits;
}

export function calculatePercentageChange(currentValue: number, previousValue: number) {
  if (previousValue === 0) {
    return previousValue === currentValue ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const filledDays = days.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return { date: day, income: 0, expenses: 0 };
    }
  });
  return filledDays;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}

const percentFormatter = new Intl.NumberFormat("en-PH", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) {
  const result = percentFormatter.format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
