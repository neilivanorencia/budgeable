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

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
